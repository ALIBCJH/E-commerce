# 🎉 AWS SSM + OIDC Setup Complete!

## What Was Configured

### 1. ✅ AWS Systems Manager (SSM) Agent
**Files Modified:**
- `modules/compute/iam.tf` - Created IAM roles and instance profiles
- `modules/compute/main.tf` - Added SSM agent to EC2 instances
- `modules/compute/user_data_backend.sh` - Added SSM agent installation
- `modules/compute/outputs.tf` - Added instance IDs and role ARN outputs

**What it does:**
- EC2 instances can now be managed remotely via SSM
- GitHub Actions can execute commands on instances without SSH
- Instances can pull Docker images from ECR
- CloudWatch logs integration

### 2. ✅ GitHub OIDC Provider
**Files Created:**
- `github-oidc.tf` - OIDC provider configuration
- `OIDC_SETUP.md` - Comprehensive documentation
- `setup-oidc.sh` - Quick setup script

**What it does:**
- Eliminates need for long-lived AWS credentials
- GitHub Actions authenticates directly with AWS
- Temporary credentials issued for each workflow run
- Better security and audit trail

### 3. ✅ GitHub Actions Workflows
**Files Updated:**
- `.github/workflows/frontend-build.yml` - Build & push frontend to ECR
- `.github/workflows/backend-build.yml` - Build & push backend to ECR
- `.github/workflows/frontend-deploy.yml` - Deploy frontend via SSM
- `.github/workflows/backend-deploy.yml` - Deploy backend via SSM

**What they do:**
- Automatically build Docker images on code changes
- Push images to AWS ECR
- Deploy containers to EC2 instances via SSM
- No SSH keys or long-lived credentials needed

## 🚀 Quick Start

### After `terraform apply`:

```bash
# 1. Run the setup script (from Infra/Aws directory)
bash setup-oidc.sh

# 2. Get your Role ARN
terraform output github_actions_role_ARN

# 3. Add to GitHub Repository Variables:
#    Settings → Secrets and variables → Actions → Variables
#    Name: AWS_DEPLOY_ROLE_ARN
#    Value: <the ARN from step 2>

# 4. Update github_repo in variable.tf to your actual repo
#    variable "github_repo" {
#      default = "your-username/e-commerce"
#    }

# 5. Run terraform apply again
terraform apply

# 6. Push code to trigger workflows!
git add .
git commit -m "feat: enable OIDC and SSM deployment"
git push
```

## 📋 Deployment Flow

### Build Phase (Automatic on code changes)
```
Code Push → GitHub Actions → Build Docker Image → Push to ECR
```

### Deploy Phase (Automatic after build)
```
ECR Image Ready → GitHub Actions → AWS SSM → EC2 Instance → Pull & Run Container
```

## 🔐 Security Features

1. **No Secrets in GitHub** - Uses OIDC tokens (expire after 1 hour)
2. **Least Privilege IAM Roles** - Each component has minimal permissions
3. **Instance Profiles** - EC2 instances authenticate automatically
4. **Audit Trail** - All actions logged in CloudTrail
5. **Repository Restrictions** - Only your GitHub repo can assume the role

## 📊 What Each Role Does

### `ecommerce-ec2-ssm-role` (EC2 Instances)
- Connect to SSM for remote management
- Pull Docker images from ECR
- Send logs to CloudWatch
- Report health status

### `ecommerce-github-actions-ssm-role` (GitHub Actions)
- Push to ECR
- Execute SSM commands on EC2
- Query EC2 instance information
- No direct EC2 access (security!)

## 🎯 Deployment Commands

### Manual Deployment (via SSM)
```bash
# Deploy frontend
aws ssm send-command \
  --instance-ids $(terraform output -raw frontend_instance_id) \
  --document-name "AWS-RunShellScript" \
  --parameters commands=["docker pull <image> && docker run ..."]

# Deploy backend
aws ssm send-command \
  --instance-ids $(terraform output -raw backend_instance_id) \
  --document-name "AWS-RunShellScript" \
  --parameters commands=["docker pull <image> && docker run ..."]
```

### Connect to Instance (via SSM - No SSH!)
```bash
# Frontend
aws ssm start-session --target $(terraform output -raw frontend_instance_id)

# Backend
aws ssm start-session --target $(terraform output -raw backend_instance_id)
```

## 🔍 Monitoring

### Check SSM Agent Status
```bash
aws ssm describe-instance-information \
  --filters "Key=tag:Name,Values=ecommerce-frontend"
```

### View Deployment Logs
```bash
# Get recent command
COMMAND_ID=$(aws ssm list-commands --max-results 1 --query 'Commands[0].CommandId' --output text)

# View output
aws ssm get-command-invocation \
  --command-id $COMMAND_ID \
  --instance-id $(terraform output -raw frontend_instance_id)
```

### GitHub Actions Logs
- Go to repository → Actions tab
- Click on workflow run
- View detailed logs for each step

## 🛠️ Troubleshooting

### SSM Agent Not Connecting
```bash
# Check if SSM agent is running on instance
aws ssm describe-instance-information --query "InstanceInformationList[?InstanceId=='i-xxxxx']"

# SSH into instance and check
ssh ec2-user@<instance-ip>
sudo systemctl status amazon-ssm-agent
```

### OIDC Authentication Fails
1. Verify `github_repo` variable matches your repository exactly
2. Check `permissions.id-token: write` is in workflow
3. Verify OIDC provider exists: `terraform state list | grep oidc`

### Docker Pull Fails on EC2
```bash
# SSH into instance
ssh ec2-user@<instance-ip>

# Test ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

## 📚 Documentation

- **OIDC Setup**: [OIDC_SETUP.md](OIDC_SETUP.md)
- **Workflows README**: [../../.github/workflows/README.md](../../.github/workflows/README.md)
- **AWS SSM Docs**: https://docs.aws.amazon.com/systems-manager/
- **GitHub OIDC Docs**: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

## ✅ Benefits

### Before
- ❌ Long-lived AWS credentials in GitHub secrets
- ❌ SSH keys needed for deployment
- ❌ Manual secret rotation
- ❌ Security risks if secrets leak
- ❌ Complex key management

### After
- ✅ No credentials in GitHub
- ✅ No SSH needed (SSM Session Manager)
- ✅ Automatic credential expiration
- ✅ Short-lived tokens (1 hour)
- ✅ Centralized access control via IAM
- ✅ Full audit trail in CloudTrail
- ✅ Keyless authentication 🎉

## 🎓 Next Steps

1. **Test the setup**: Push code and watch workflows execute
2. **Monitor logs**: Check CloudWatch and GitHub Actions
3. **Secure your repo**: Restrict `github_repo` variable to your actual repository
4. **Add health checks**: Implement `/health` endpoint in your backend
5. **Set up alerts**: Configure CloudWatch alarms for failures
6. **Document your deployments**: Keep track of versions deployed
7. **Celebrate**: You've achieved zero-secrets deployment! 🚀

---

**Need Help?** Check the detailed documentation in [OIDC_SETUP.md](OIDC_SETUP.md)
