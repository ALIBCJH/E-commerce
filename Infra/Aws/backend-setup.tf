# S3 Backend Setup Resources
# Creates S3 bucket and DynamoDB table for Terraform state management

# Get current AWS account ID for unique bucket naming
data "aws_caller_identity" "current" {}

# S3 Bucket for Terraform State
resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.project_name}-tf-state-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "${var.project_name}-terraform-state"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Enable versioning for state file history
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable encryption for state file security
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access to the state bucket
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Outputs for backend configuration
output "s3_bucket_name" {
  description = "S3 bucket name for Terraform state"
  value       = aws_s3_bucket.terraform_state.id
}

output "backend_config" {
  description = "Backend configuration instructions"
  value       = <<-EOT
    S3 Backend Configuration (without locking):
    
    Bucket: ${aws_s3_bucket.terraform_state.id}
    
    The S3 bucket has been created.
    Backend is already configured in providers.tf.
    
    To migrate your local state to S3:
    1. Run: terraform init -migrate-state
    2. Confirm the migration when prompted
    
    WARNING: State locking is disabled. Only run Terraform from one location at a time.
  EOT
}
