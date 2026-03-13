#!/bin/bash
# Script to import existing AWS resources into Terraform state
# Run this locally before pushing to GitHub Actions

set -e

echo "Importing existing AWS resources into Terraform state..."

# Import OIDC Provider if it exists
OIDC_ARN=$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text)
if [ -n "$OIDC_ARN" ]; then
  echo "Importing OIDC Provider: $OIDC_ARN"
  terraform import aws_iam_openid_connect_provider.github "$OIDC_ARN" || echo "Already imported or failed"
fi

# Import EC2 SSM Role if it exists
if aws iam get-role --role-name ecommerce-ec2-ssm-role &>/dev/null; then
  echo "Importing IAM Role: ecommerce-ec2-ssm-role"
  terraform import module.compute.aws_iam_role.ec2_ssm_role ecommerce-ec2-ssm-role || echo "Already imported or failed"
fi

# Import Key Pair if it exists
if aws ec2 describe-key-pairs --key-names ecommerce-key &>/dev/null; then
  echo "Importing Key Pair: ecommerce-key"
  terraform import module.compute.aws_key_pair.main ecommerce-key || echo "Already imported or failed"
fi

echo "Import complete! You can now run terraform plan/apply"
