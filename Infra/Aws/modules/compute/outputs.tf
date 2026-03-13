output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.frontend_alb.dns_name
}

output "frontend_instance_public_ip" {
  description = "Public IP of the frontend EC2 instance"
  value       = aws_instance.frontend.public_ip
}

output "frontend_instance_id" {
  description = "Instance ID of the frontend EC2 instance"
  value       = aws_instance.frontend.id
}

output "backend_instance_public_ip" {
  description = "Public IP of the backend EC2 instance"
  value       = aws_instance.backend.public_ip
}

output "backend_instance_id" {
  description = "Instance ID of the backend EC2 instance"
  value       = aws_instance.backend.id
}

output "backend_instance_private_ip" {
  description = "Private IP of the backend EC2 instance"
  value       = aws_instance.backend.private_ip
}

output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions build/deploy operations"
  value       = aws_iam_role.github_actions_ssm_role.arn
}

output "github_actions_deploy_role_arn" {
  description = "ARN of the IAM role for GitHub Actions build/deploy operations"
  value       = aws_iam_role.github_actions_ssm_role.arn
}

output "github_actions_terraform_role_arn" {
  description = "ARN of the IAM role for GitHub Actions Terraform operations"
  value       = aws_iam_role.github_actions_terraform_role.arn
}

output "ec2_instance_profile_arn" {
  description = "ARN of the EC2 instance profile"
  value       = aws_iam_instance_profile.ec2_profile.arn
}
