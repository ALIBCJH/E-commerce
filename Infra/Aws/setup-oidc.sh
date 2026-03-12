#!/bin/bash
# Quick Setup Script for GitHub OIDC Authentication
# Run this after: terraform apply

set -e

echo "🔐 AWS OIDC Configuration for GitHub Actions"
echo "=============================================="
echo ""

# Get Terraform outputs
echo "📋 Step 1: Getting your AWS Role ARN..."
ROLE_ARN=$(terraform output -raw github_actions_role_arn 2>/dev/null || echo "Run 'terraform apply' first")
GITHUB_OIDC=$(terraform output -raw github_oidc_provider_arn 2>/dev/null || echo "Run 'terraform apply' first")
FRONTEND_ID=$(terraform output -raw frontend_instance_id 2>/dev/null || echo "N/A")
BACKEND_ID=$(terraform output -raw backend_instance_id 2>/dev/null || echo "N/A")

echo "✅ GitHub Actions Role ARN:"
echo "   $ROLE_ARN"
echo ""
echo "✅ OIDC Provider ARN:"
echo "   $GITHUB_OIDC"
echo ""
echo "✅ Frontend Instance ID: $FRONTEND_ID"
echo "✅ Backend Instance ID: $BACKEND_ID"
echo ""

# GitHub setup instructions
echo "📝 Step 2: Configure GitHub Repository"
echo "========================================"
echo ""
echo "1. Go to your GitHub repository"
echo "2. Navigate to: Settings → Secrets and variables → Actions → Variables tab"
echo "3. Click 'New repository variable'"
echo "4. Add the following variable:"
echo ""
echo "   Name:  AWS_DEPLOY_ROLE_ARN"
echo "   Value: $ROLE_ARN"
echo ""
echo "5. Click 'Add variable'"
echo ""

# Security reminder
echo "🔒 Step 3: Restrict Repository Access (Important!)"
echo "===================================================="
echo ""
echo "For better security, update your Terraform configuration:"
echo ""
echo "Edit: Infra/Aws/variable.tf"
echo ""
echo "Change:"
echo "  variable \"github_repo\" {"
echo "    default = \"*/*\"  # ❌ Too permissive!"
echo "  }"
echo ""
echo "To:"
echo "  variable \"github_repo\" {"
echo "    default = \"YOUR_USERNAME/e-commerce\"  # ✅ Specific repo only"
echo "  }"
echo ""
echo "Then run: terraform apply"
echo ""

# Test instructions
echo "🧪 Step 4: Test Your Setup"
echo "==========================="
echo ""
echo "1. Update your workflows (already done! ✅)"
echo "2. Commit and push to trigger a workflow:"
echo ""
echo "   git add .github/workflows/"
echo "   git commit -m \"feat: configure OIDC for AWS authentication\""
echo "   git push origin main"
echo ""
echo "3. Watch the Actions tab in GitHub"
echo "4. The workflow should authenticate without any secrets!"
echo ""

# Cleanup old secrets
echo "🧹 Step 5: Clean Up Old Secrets"
echo "================================"
echo ""
echo "After confirming OIDC works, delete old AWS secrets:"
echo ""
echo "1. Go to: Settings → Secrets and variables → Actions → Secrets tab"
echo "2. Delete these secrets (if they exist):"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - AWS_ROLE_ARN (moved to Variables)"
echo ""

# Summary
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Your infrastructure now uses OIDC for secure, keyless authentication."
echo "No long-lived credentials needed! 🎉"
echo ""
echo "📚 For detailed documentation, see: Infra/Aws/OIDC_SETUP.md"
echo ""

# Validation check
echo "🔍 Validation Checks"
echo "===================="
echo ""

if [[ "$ROLE_ARN" == *"arn:aws:iam"* ]]; then
  echo "✅ GitHub Actions Role exists"
else
  echo "❌ GitHub Actions Role not found - run 'terraform apply'"
fi

if [[ "$GITHUB_OIDC" == *"arn:aws:iam"* ]]; then
  echo "✅ OIDC Provider exists"
else
  echo "❌ OIDC Provider not found - run 'terraform apply'"
fi

if [[ -f ".github/workflows/frontend-build.yml" ]]; then
  if grep -q "vars.AWS_DEPLOY_ROLE_ARN" .github/workflows/frontend-build.yml; then
    echo "✅ Frontend build workflow configured for OIDC"
  else
    echo "⚠️  Frontend build workflow needs OIDC update"
  fi
fi

if [[ -f ".github/workflows/backend-build.yml" ]]; then
  if grep -q "vars.AWS_DEPLOY_ROLE_ARN" .github/workflows/backend-build.yml; then
    echo "✅ Backend build workflow configured for OIDC"
  else
    echo "⚠️  Backend build workflow needs OIDC update"
  fi
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Set AWS_DEPLOY_ROLE_ARN variable in GitHub"
echo "2. Update github_repo variable in Terraform"
echo "3. Push code to trigger workflows"
echo "4. Delete old AWS credentials from GitHub secrets"
echo ""
