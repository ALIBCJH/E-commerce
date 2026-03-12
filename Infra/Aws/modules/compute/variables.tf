variable "project_name" {
  type        = string
  description = "Project name for resource naming"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "List of public subnet IDs for the ALB and frontend instances"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for backend instances"
}

variable "alb_sg_id" {
  type        = string
  description = "Security group ID for the Application Load Balancer"
}

variable "frontend_sg_id" {
  type        = string
  description = "Security group ID for frontend EC2 instances"
}

variable "backend_sg_id" {
  type        = string
  description = "Security group ID for backend EC2 instances"
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key for EC2 instance access"
}

variable "db_endpoint" {
  type        = string
  description = "Database endpoint for backend configuration"
}

variable "frontend_instance_type" {
  type        = string
  description = "EC2 instance type for frontend"
  default     = "t3.micro"
}

variable "backend_instance_type" {
  type        = string
  description = "EC2 instance type for backend"
  default     = "t3.micro"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository in format: owner/repo-name"
  default     = "*/*" # Allow all repos by default, restrict this in production
}
