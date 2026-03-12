variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "admin_ip" {
  type        = string
  description = "Admin IP for SSH access in CIDR format"
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "private_subnet_ids" {
  type = list(string)
}