# AWS Secrets Manager Setup Guide

## Overview
This project uses AWS Secrets Manager to securely store and retrieve sensitive credentials like database passwords. This eliminates the need to manually enter passwords during `terraform plan` or `apply`.

## Initial Setup

### Step 1: Create the Secret in AWS Secrets Manager

You have two options:

#### Option A: Using AWS CLI (Recommended)
```bash
# Create the secret with a secure password
aws secretsmanager create-secret \
  --name ecommerce-db-password \
  --description "DocumentDB master password for ecommerce project" \
  --secret-string '{"password":"YourSecurePassword123!"}' \
  --region us-east-1

# Verify the secret was created
aws secretsmanager describe-secret \
  --secret-id ecommerce-db-password \
  --region us-east-1
```

#### Option B: Using AWS Console
1. Go to AWS Secrets Manager in the AWS Console
2. Click "Store a new secret"
3. Select "Other type of secret"
4. Add a key-value pair:
   - Key: `password`
   - Value: `YourSecurePassword123!` (use a strong password)
5. Click "Next"
6. Enter secret name: `ecommerce-db-password`
7. Add description: "DocumentDB master password for ecommerce project"
8. Click "Next" through the remaining steps
9. Click "Store"

#### Option C: Let Terraform Create the Secret (Advanced)
If you want Terraform to manage the secret creation:

1. Uncomment the resource blocks in `secrets.tf`
2. Run: `terraform apply -var="db_password=YourSecurePassword123!"`
3. After initial creation, the password is stored in Secrets Manager
4. You can rotate it directly in AWS Secrets Manager without Terraform

### Step 2: Verify IAM Permissions

Ensure your AWS credentials have permissions to read from Secrets Manager:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:ecommerce-db-password-*"
    }
  ]
}
```

### Step 3: Run Terraform

Now you can run Terraform without being prompted for passwords:

```bash
cd /home/simonjuma/Desktop/projects_254/e-commerce/Infra/Aws

# Initialize (if not already done)
terraform init

# Plan without password prompts
terraform plan

# Apply without password prompts
terraform apply
```

## Password Management

### Rotating the Password

To rotate the database password:

1. **Update the secret in AWS Secrets Manager:**
   ```bash
   aws secretsmanager update-secret \
     --secret-id ecommerce-db-password \
     --secret-string '{"password":"NewSecurePassword456!"}' \
     --region us-east-1
   ```

2. **Update the database:**
   ```bash
   terraform apply
   ```
   Terraform will detect the password change and update DocumentDB.

### Viewing the Password (if needed)

```bash
# Retrieve the password
aws secretsmanager get-secret-value \
  --secret-id ecommerce-db-password \
  --region us-east-1 \
  --query SecretString \
  --output text | jq -r '.password'
```

### Using a Different Secret Name

If you want to use a different secret name:

1. Create the secret with your preferred name
2. Update the `name` in `secrets.tf`:
   ```terraform
   data "aws_secretsmanager_secret" "db_password" {
     name = "your-custom-secret-name"
   }
   ```

## Security Best Practices

1. **Use Strong Passwords**: Minimum 16 characters with uppercase, lowercase, numbers, and special characters
2. **Enable Automatic Rotation**: Consider enabling AWS Secrets Manager automatic rotation
3. **Restrict Access**: Use IAM policies to limit who can read the secrets
4. **Enable CloudTrail**: Monitor access to secrets via CloudTrail logs
5. **Use VPC Endpoints**: For enhanced security, use VPC endpoints for Secrets Manager

## Troubleshooting

### Error: "The security token included in the request is invalid"
- Check that your AWS credentials are configured correctly
- Run: `aws configure` or set environment variables

### Error: "ResourceNotFoundException: Secrets Manager can't find the specified secret"
- Verify the secret exists: `aws secretsmanager list-secrets --region us-east-1`
- Ensure the secret name matches: `ecommerce-db-password`
- Check you're in the correct AWS region

### Error: "AccessDeniedException"
- Your IAM user/role needs `secretsmanager:GetSecretValue` permission
- Contact your AWS administrator to grant the necessary permissions

## Cost Considerations

AWS Secrets Manager pricing:
- $0.40 per secret per month
- $0.05 per 10,000 API calls

For this project (1 secret with minimal API calls), expect ~$0.50/month.

## Migration from Manual Password Entry

If you previously used manual password entry:

1. The secret value in Secrets Manager becomes the source of truth
2. The `db_password` variable in `variable.tf` is now optional (has a null default)
3. Old `terraform.tfvars` or `-var` flags are no longer needed (unless creating the secret via Terraform)

## Additional Secrets

To add more secrets (e.g., API keys, JWT secrets):

1. Create the secret in AWS Secrets Manager
2. Add a data source in `secrets.tf`:
   ```terraform
   data "aws_secretsmanager_secret_version" "api_key" {
     secret_id = "ecommerce-api-key"
   }
   ```
3. Reference it using: `data.aws_secretsmanager_secret_version.api_key.secret_string`
