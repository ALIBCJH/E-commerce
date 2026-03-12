# AWS Secrets Manager Configuration
# This file manages sensitive credentials using AWS Secrets Manager

# OPTIONAL: Secret for MongoDB password (not required for local MongoDB installation)
# Uncomment if you need to store database credentials
/*
resource "aws_secretsmanager_secret" "db_password" {
  name        = "${var.project_name}-db-password"
  description = "MongoDB password for ${var.project_name}"
  
  recovery_window_in_days = 7 # Days before permanent deletion

  tags = {
    Name        = "${var.project_name}-db-password"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    password = var.db_password
  })
  
  lifecycle {
    ignore_changes = [secret_string] # Ignore changes after initial creation
  }
}
*/

# Local variables for SSH key
locals {
  # Dynamically load SSH public key from file, or use provided variable
  ssh_public_key = var.ssh_public_key != "" ? var.ssh_public_key : file(pathexpand("~/.ssh/id_ed25519.pub"))
}
