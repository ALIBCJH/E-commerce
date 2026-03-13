output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.compute.alb_dns_name
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = "http://${module.compute.alb_dns_name}"
}

output "frontend_instance_public_ip" {
  description = "Public IP of the frontend EC2 instance"
  value       = module.compute.frontend_instance_public_ip
}

output "backend_instance_public_ip" {
  description = "Public IP of the backend EC2 instance"
  value       = module.compute.backend_instance_public_ip
}

output "backend_instance_private_ip" {
  description = "Private IP of the backend EC2 instance"
  value       = module.compute.backend_instance_private_ip
}

output "documentdb_endpoint" {
  description = "MongoDB is installed on the backend EC2 instance"
  value       = "localhost:27017 (on backend instance)"
}

output "documentdb_reader_endpoint" {
  description = "MongoDB connection string"
  value       = "mongodb://localhost:27017/ecommerce (on backend instance)"
}

output "documentdb_connection_string" {
  description = "MongoDB connection details"
  value       = "MongoDB is installed locally on the backend EC2 instance. SSH to backend and use: mongodb://localhost:27017/ecommerce"
  sensitive   = false
}

output "ssh_command_frontend" {
  description = "SSH command to connect to frontend instance"
  value       = "ssh -i ~/.ssh/id_ed25519 ec2-user@${module.compute.frontend_instance_public_ip}"
}

output "ssh_command_backend" {
  description = "SSH command to connect to backend instance"
  value       = "ssh -i ~/.ssh/id_ed25519 ec2-user@${module.compute.backend_instance_public_ip}"
}

# SSM and GitHub Actions Outputs
output "frontend_instance_id" {
  description = "Frontend EC2 instance ID for SSM"
  value       = module.compute.frontend_instance_id
}

output "backend_instance_id" {
  description = "Backend EC2 instance ID for SSM"
  value       = module.compute.backend_instance_id
}

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions build/deploy operations"
  value       = module.compute.github_actions_role_arn
}

output "github_actions_deploy_role_arn" {
  description = "IAM Role ARN for GitHub Actions build/deploy operations"
  value       = module.compute.github_actions_deploy_role_arn
}

output "github_actions_terraform_role_arn" {
  description = "IAM Role ARN for GitHub Actions Terraform operations"
  value       = module.compute.github_actions_terraform_role_arn
}

output "ssm_connection_instructions" {
  description = "Instructions for connecting via SSM"
  value       = <<-EOT
    To connect to instances via SSM:
    
    Frontend: aws ssm start-session --target ${module.compute.frontend_instance_id}
    Backend:  aws ssm start-session --target ${module.compute.backend_instance_id}
    
    To run commands via SSM:
    aws ssm send-command \
      --instance-ids ${module.compute.backend_instance_id} \
      --document-name "AWS-RunShellScript" \
      --parameters commands=["docker ps"]
  EOT
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.networks.vpc_id
}

output "deployment_notes" {
  description = "Important deployment notes"
  sensitive   = true
  value       = <<-EOT
    Deployment Complete! Next Steps:
    
    1. Access your application at: http://${module.compute.alb_dns_name}
    
    2. SSH to instances:
       Frontend: ssh -i ~/.ssh/id_ed25519 ec2-user@${module.compute.frontend_instance_public_ip}
       Backend:  ssh -i ~/.ssh/id_ed25519 ec2-user@${module.compute.backend_instance_public_ip}
    
    3. Deploy your application code:
       - Clone your repo on both instances
       - Build and run Docker containers
    
    4. MongoDB Connection:
       - MongoDB is installed on the backend EC2 instance
       - Connection: mongodb://localhost:27017/ecommerce
       - Access via backend instance only
    
    5. Security Reminders:
       - Update admin_ip variable to your specific IP
       - Store db_password securely
       - Consider setting up HTTPS with ACM certificate
  EOT
}