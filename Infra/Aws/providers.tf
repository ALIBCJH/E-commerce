terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration for S3 remote state (without locking)
  # WARNING: No state locking - ensure only one terraform operation runs at a time
  backend "s3" {
    bucket  = "ecommerce-tf-state-457713535842"
    key     = "prod/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
    # skip_requesting_account_id prevents validation errors
    skip_requesting_account_id = true
  }
}

provider "aws" {
  region = var.aws_region
}