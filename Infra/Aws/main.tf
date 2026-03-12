# 1. Network Module: Creates VPC, Subnets, and Internet Gateway
module "networks" {
  source       = "./modules/networks"
  project_name = var.project_name
  vpc_cidr     = "10.0.0.0/16"
}

# Security Module: Create the security Groups
module "security" {
  source             = "./modules/security"
  project_name       = var.project_name
  vpc_id             = module.networks.vpc_id # Getting the ID from network output
  admin_ip           = var.admin_ip
  public_subnet_ids  = module.networks.public_subnet_ids
  private_subnet_ids = module.networks.private_subnet_ids
}

# Database Module: DocumentDB (NOT FREE TIER ELIGIBLE)
# DocumentDB is not available in AWS free tier. Options:
# 1. Install MongoDB directly on the backend EC2 instance (recommended for dev/testing)
# 2. Use a separate t2.micro EC2 instance with MongoDB installed
# 3. Use MongoDB Atlas free tier (external service)
# 4. Upgrade AWS account to use DocumentDB

# COMMENTED OUT - DocumentDB not free tier compatible
/*
module "database" {
  source               = "./modules/database"
  project_name         = var.project_name
  private_subnet_ids   = module.networks.private_subnet_ids
  db_security_group_id = module.security.db_sg_id
  db_username          = var.db_username
  db_password          = local.db_password_from_secrets_manager
  db_instance_class    = var.db_instance_class
  db_instance_count    = var.db_instance_count
}
*/

# Compute Module: Creates the Workers (EC2 , ALB)
module "compute" {
  source                 = "./modules/compute"
  project_name           = var.project_name
  vpc_id                 = module.networks.vpc_id
  public_subnet_ids      = module.networks.public_subnet_ids
  private_subnet_ids     = module.networks.private_subnet_ids
  alb_sg_id              = module.security.alb_sg_id
  frontend_sg_id         = module.security.frontend_sg_id
  backend_sg_id          = module.security.backend_sg_id
  ssh_public_key         = local.ssh_public_key
  frontend_instance_type = var.frontend_instance_type
  backend_instance_type  = var.backend_instance_type
  github_repo            = var.github_repo
  # MongoDB will be installed on the backend instance or use MongoDB Atlas
  db_endpoint            = "localhost:27017" # Install MongoDB on backend EC2
}

