# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for building and deploying the e-commerce application.

## Workflows

### 1. Frontend Build (`frontend-build.yml`)
Builds and pushes the frontend container to AWS ECR.

**Triggers:**
- Push to `main` or `develop` branches (when Frontend/ changes)
- Pull requests to `main`
- Manual workflow dispatch

**What it does:**
- Builds the React frontend using multi-stage Docker build
- Pushes image to AWS ECR
- Tags images with branch name, SHA, and `latest`

### 2. Backend Build (`backend-build.yml`)
Builds and pushes the backend container to AWS ECR.

**Triggers:**
- Push to `main` or `develop` branches (when E-commerce-Backend/ changes)
- Pull requests to `main`
- Manual workflow dispatch

**What it does:**
- Builds the Node.js backend API
- Pushes image to AWS ECR
- Tags images with branch name, SHA, and `latest`

## Setup Instructions

### Prerequisites

1. **AWS ECR Repositories**: Create two ECR repositories in your AWS account:
   ```bash
   aws ecr create-repository --repository-name ecommerce-frontend --region us-east-1
   aws ecr create-repository --repository-name ecommerce-backend --region us-east-1
   ```

2. **IAM Role for GitHub Actions**: Create an IAM role with OIDC trust for GitHub Actions:
   - Trust relationship for `repo:your-org/your-repo:*`
   - Permissions: ECR read/write access

3. **GitHub Secrets**: Add the following secret to your GitHub repository:
   - `AWS_ROLE_ARN`: The ARN of the IAM role created above

### GitHub Secret Configuration

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

```
Name: AWS_ROLE_ARN
Value: arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsECRRole
```

### Environment Variables

You can customize these in the workflow files:

- `AWS_REGION`: AWS region for ECR (default: us-east-1)
- `ECR_REPOSITORY`: ECR repository name
- `IMAGE_TAG`: Image tag strategy

## Workflow Features

### Security
- Uses OIDC authentication (no long-lived credentials)
- Minimal permissions with `id-token: write` and `contents: read`
- AWS IAM role assumption

### Performance
- Docker Buildx for efficient builds
- GitHub Actions cache for Docker layers
- Multi-stage builds (frontend) for smaller images
- Path-based triggers to avoid unnecessary builds

### Flexibility
- Manual workflow dispatch available
- Multiple tag strategies (branch, SHA, latest)
- Separate workflows for frontend and backend

## Usage

### Automatic Builds

Simply push your changes:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

The appropriate workflow will trigger automatically based on which files changed.

### Manual Builds

1. Go to Actions tab in GitHub
2. Select the workflow (Frontend or Backend)
3. Click "Run workflow"
4. Select branch and run

## Monitoring

- View workflow runs in the "Actions" tab of your repository
- Each workflow shows:
  - Build status
  - Image tags created
  - ECR repository URL
  - Build logs

## Troubleshooting

### Authentication Issues
- Verify `AWS_ROLE_ARN` secret is set correctly
- Check IAM role trust relationship includes your repository
- Ensure IAM role has ECR permissions

### Build Failures
- Check Dockerfile syntax
- Verify all dependencies are in package.json
- Review build logs in Actions tab

### ECR Push Failures
- Verify ECR repositories exist
- Check AWS region matches
- Ensure IAM role has `ecr:PutImage` permission

## Next Steps

After images are built and pushed to ECR:
1. Update your Terraform compute module to pull from ECR
2. Update EC2 user data scripts to use the ECR images
3. Consider adding a deployment workflow to update running instances
4. Set up Amazon ECS/EKS for container orchestration (recommended)
