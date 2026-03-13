terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration for S3 remote state
  backend "s3" {
    bucket       = "ecommerce-tf-state-457713535842"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true  # 2026 standard: native S3 locking
  }
}

provider "aws" {
  region = var.aws_region
}