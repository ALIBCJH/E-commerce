# Data source to get the latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# SSH Key Pair for EC2 access
resource "aws_key_pair" "main" {
  key_name   = "${var.project_name}-key"
  public_key = var.ssh_public_key

  lifecycle {
    # Prevent recreation if it already exists
    ignore_changes = [public_key]
  }
}

# Frontend EC2 Instance (Public Subnet)
resource "aws_instance" "frontend" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.frontend_instance_type
  subnet_id              = var.public_subnet_ids[0]
  vpc_security_group_ids = [var.frontend_sg_id]
  key_name               = aws_key_pair.main.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker amazon-ssm-agent
              systemctl start docker
              systemctl enable docker
              systemctl start amazon-ssm-agent
              systemctl enable amazon-ssm-agent
              usermod -a -G docker ec2-user
              # Pull and run frontend container
              docker pull nginx:latest
              docker run -d -p 80:80 nginx:latest
              EOF

  tags = {
    Name        = "${var.project_name}-frontend"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Backend EC2 Instance (Public Subnet for now, can be moved to private)
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.backend_instance_type
  subnet_id              = var.public_subnet_ids[1]
  vpc_security_group_ids = [var.backend_sg_id]
  key_name               = aws_key_pair.main.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = templatefile("${path.module}/user_data_backend.sh", {
    db_endpoint = var.db_endpoint
  })

  tags = {
    Name        = "${var.project_name}-backend"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Application Load Balancer (ALB)
resource "aws_lb" "frontend_alb" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# Target Group for Frontend
resource "aws_lb_target_group" "frontend_tg" {
  name     = "${var.project_name}-frontend-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
  }

  tags = {
    Name = "${var.project_name}-frontend-tg"
  }
}

# Target Group for Backend
resource "aws_lb_target_group" "backend_tg" {
  name     = "${var.project_name}-backend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    protocol            = "HTTP"
  }

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

# ALB Listener (HTTP)
resource "aws_lb_listener" "frontend" {
  load_balancer_arn = aws_lb.frontend_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

# ALB Listener Rule for Backend API
resource "aws_lb_listener_rule" "backend_api" {
  listener_arn = aws_lb_listener.frontend.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Attach Frontend instance to target group
resource "aws_lb_target_group_attachment" "frontend" {
  target_group_arn = aws_lb_target_group.frontend_tg.arn
  target_id        = aws_instance.frontend.id
  port             = 80
}

# Attach Backend instance to target group
resource "aws_lb_target_group_attachment" "backend" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = aws_instance.backend.id
  port             = 3000
}
