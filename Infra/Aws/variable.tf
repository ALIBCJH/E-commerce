variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "ecommerce"
}

variable "admin_ip" {
  description = "Admin IP address for SSH access (CIDR format)"
  type        = string
  default     = "0.0.0.0/0" # Change this to your IP for security
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access (optional - defaults to ~/.ssh/id_ed25519.pub)"
  type        = string
  default     = ""
  # Leave empty to use default key, or override with: terraform apply -var="ssh_public_key=$(cat ~/.ssh/other_key.pub)"
}

variable "frontend_instance_type" {
  description = "EC2 instance type for frontend"
  type        = string
  default     = "t3.micro" # Free tier eligible
}

variable "backend_instance_type" {
  description = "EC2 instance type for backend"
  type        = string
  default     = "t3.micro" # Free tier eligible
}

variable "db_username" {
  description = "Master username for DocumentDB"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "MongoDB password (optional - only needed if using managed database service)"
  type        = string
  sensitive   = true
  default     = null
  # Not required for local MongoDB installation on EC2
}

variable "db_instance_class" {
  description = "Instance class for DocumentDB"
  type        = string
  default     = "db.t3.medium"
}

variable "db_instance_count" {
  description = "Number of DocumentDB instances"
  type        = number
  default     = 1
}

variable "github_repo" {
  description = "GitHub repository in format: owner/repo-name (e.g., username/e-commerce)"
  type        = string
  default     = "ALIBCJH/E-commerce"
}