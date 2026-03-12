# S3 Backend Setup Resources
# With 2026 S3 native locking (use_lockfile = true), DynamoDB is no longer needed!
# This file creates the S3 bucket for remote state storage only

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
    ✅ 2026 Standard: S3 native locking enabled (no DynamoDB needed)
    
    Your backend is already configured in providers.tf with:
    - bucket: ${aws_s3_bucket.terraform_state.id}
    - key: prod/terraform.tfstate
    - region: ${var.aws_region}
    - encrypt: true
    - use_lockfile: true  # New 2026 native S3 locking!
    
    The S3 bucket has been created. To start using remote state:
    1. Run: terraform init -migrate-state
    2. Confirm the migration when prompted
  EOT
}
