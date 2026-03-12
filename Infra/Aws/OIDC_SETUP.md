# AWS OIDC Setup for GitHub Actions

This guide explains how to use OpenID Connect (OIDC) for secure, keyless authentication between GitHub Actions and AWS - **no secrets needed**!

## 🔐 What is OIDC?

OIDC allows GitHub Actions to request short-lived access tokens directly from AWS. Benefits:
- ✅ No long-lived AWS credentials
- ✅ No secrets to rotate
- ✅ Automatic token expiration
- ✅ Better security posture
- ✅ Built-in audit trail

## 📋 Architecture Overview

```
GitHub Actions → GitHub OIDC Provider → AWS STS → Temporary Credentials → Your AWS Resources
```

## 🚀 Setup Instructions

### Step 1: Deploy the Terraform Configuration

The OIDC provider is already configured in your Terraform code. After running `terraform apply`, you'll get:

1. **GitHub OIDC Provider** - Establishes trust between GitHub and AWS
2. **IAM Roles** - Separate roles for build (ECR push) and deploy (SSM commands)
3. **Instance Profiles** - EC2 instances can pull from ECR and report to SSM

### Step 2: Get the Role ARN

After `terraform apply` completes, get the GitHub Actions role ARN:

```bash
terraform output github_actions_role_arn
```

Example output:
```
arn:aws:iam::457713535842:role/ecommerce-github-actions-ssm-role
```

### Step 3: Configure GitHub Repository Settings

**No secrets needed!** Just set up your workflows to use the role ARN directly.

#### Option A: Use in Workflow (Hardcode - Simple)

In your workflow files, update the role ARN:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::457713535842:role/ecommerce-github-actions-ssm-role
    aws-region: us-east-1
```

#### Option B: Use GitHub Variable (Recommended)

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab
3. Click **New repository variable**
4. Name: `AWS_DEPLOY_ROLE_ARN`
5. Value: `arn:aws:iam::YOUR_ACCOUNT_ID:role/ecommerce-github-actions-ssm-role`

Then in workflows:
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
    aws-region: us-east-1
```

### Step 4: Restrict Repository Access (Security Best Practice)

Update [variable.tf](../variable.tf):

```terraform
variable "github_repo" {
  description = "GitHub repository in format: owner/repo-name"
  type        = string
  default     = "your-username/e-commerce"  # 👈 Change this!
}
```

Run `terraform apply` again to update the trust policy.

## 🔍 How It Works

### 1. GitHub Actions Workflow Starts
When your workflow runs, GitHub generates a unique OIDC token containing:
- Repository name
- Branch name
- Workflow name
- Commit SHA

### 2. AWS Verifies the Token
The OIDC provider validates:
- Token signature (cryptographically secure)
- Token hasn't expired
- Repository matches trust policy
- Audience is `sts.amazonaws.com`

### 3. Temporary Credentials Issued
AWS STS issues temporary credentials (valid for 1 hour):
- Access Key ID
- Secret Access Key
- Session Token

### 4. GitHub Actions Uses Credentials
The workflow can now:
- Push container images to ECR
- Execute SSM commands on EC2 instances
- Access other permitted AWS services

## 📚 Workflow Examples

### Frontend Build & Deploy

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['Frontend/**']

permissions:
  id-token: write    # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials (OIDC - No Secrets!)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
          aws-region: us-east-1
      
      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push
        run: |
          docker build -t ${{ steps.login-ecr.outputs.registry }}/ecommerce-frontend:latest ./Frontend
          docker push ${{ steps.login-ecr.outputs.registry }}/ecommerce-frontend:latest
      
      - name: Deploy via SSM
        run: |
          aws ssm send-command \
            --instance-ids $(terraform output -raw frontend_instance_id) \
            --document-name "AWS-RunShellScript" \
            --parameters commands=["./deploy-frontend.sh"]
```

## 🛡️ Security Features

### Token Validation
The IAM role trust policy validates:
```json
{
  "Condition": {
    "StringLike": {
      "token.actions.githubusercontent.com:sub": "repo:your-org/your-repo:*"
    },
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
    }
  }
}
```

### Principle of Least Privilege
Roles have minimal permissions:
- **Build role**: Only ECR push/pull
- **Deploy role**: Only SSM send-command on tagged instances
- **EC2 role**: Only SSM Core + ECR read

### Automatic Expiration
Credentials expire after 1 hour (default). Can be configured from 15 minutes to 12 hours.

## 🔧 Troubleshooting

### Error: "Not authorized to perform sts:AssumeRoleWithWebIdentity"

**Cause**: GitHub repository doesn't match the trust policy.

**Fix**: Update `github_repo` variable in Terraform:
```terraform
variable "github_repo" {
  default = "your-username/your-repo"  # Exact match required
}
```

### Error: "No OIDC provider found"

**Cause**: OIDC provider not created or wrong account.

**Fix**: 
```bash
terraform state list | grep oidc
terraform apply
```

### Error: "Access Denied" when pushing to ECR

**Cause**: IAM role lacks ECR permissions.

**Fix**: Check [modules/compute/iam.tf](../modules/compute/iam.tf) - verify `ecr_read_policy` is attached.

### Workflow doesn't assume role

**Cause**: Missing `permissions` in workflow.

**Fix**: Add to your workflow:
```yaml
permissions:
  id-token: write
  contents: read
```

## 📊 Audit & Monitoring

### CloudTrail Logs
All OIDC authentications are logged in CloudTrail:
- Event: `AssumeRoleWithWebIdentity`
- User Identity: GitHub Actions workflow
- Source IP: GitHub Actions runner

### View Active Sessions
```bash
aws sts get-caller-identity
```

### Monitor Role Usage
```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRoleWithWebIdentity \
  --max-results 10
```

## 🎯 Migration from Secrets

### Before (Using Secrets ❌)
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
```

### After (Using OIDC ✅)
```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
          aws-region: us-east-1
```

### Migration Steps
1. Deploy Terraform with OIDC provider
2. Update workflows to use OIDC
3. Test workflows
4. Delete old AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY secrets from GitHub
5. Delete the IAM user (if it was created only for GitHub Actions)

## 🔗 References

- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [AWS OIDC for GitHub Actions](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/)
- [configure-aws-credentials Action](https://github.com/aws-actions/configure-aws-credentials)

## ✅ Checklist

- [ ] Deploy Terraform configuration
- [ ] Get GitHub Actions role ARN from outputs
- [ ] Update `github_repo` variable with your repository
- [ ] Add `AWS_DEPLOY_ROLE_ARN` as GitHub repository variable (optional but recommended)
- [ ] Update workflow files with OIDC authentication
- [ ] Add `permissions.id-token: write` to workflows
- [ ] Test workflows
- [ ] Delete old AWS credentials from GitHub secrets
- [ ] Celebrate 🎉 - You're now using secure, keyless authentication!
