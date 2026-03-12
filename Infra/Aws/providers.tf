terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # TEMPORARILY DISABLED - Will re-enable after fixing state
  # Backend configuration for S3 remote state
  /*
  backend "s3" {
    bucket       = "ecommerce-terraform-state-bucket"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true  # 2026 standard: native S3 locking
  }
  */
}

provider "aws" {
  region = var.aws_region
}