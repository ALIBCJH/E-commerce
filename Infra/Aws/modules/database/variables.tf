variable "project_name" {
  type        = string
  description = "Project name for tagging"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for the DB subnet group"
}

variable "db_security_group_id" {
  type        = string
  description = "The SG ID that allows Port 27017 from the Backend"
}

variable "db_username" {
  type        = string
  description = "Master username for DocumentDB"
}

variable "db_password" {
  type        = string
  description = "Master password for DocumentDB"
  sensitive   = true # This hides the password from your terminal logs
}

variable "db_instance_count" {
  type    = number
  default = 1
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.medium"
}