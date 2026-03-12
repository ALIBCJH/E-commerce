# Subnet Group: Tells DocumentDB which subnet to use for the cluster
resource "aws_docdb_subnet_group" "main" {
  name       = "${var.project_name}-docdb-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-docdb-subnet-group"
  }
}

# The Cluster: The documentDB cluster itself
resource "aws_docdb_cluster" "mongodb" {
  cluster_identifier      = "${var.project_name}-docdb-cluster"
  engine                  = "docdb"
  master_username         = var.db_username
  master_password         = var.db_password
  backup_retention_period = 1 # Minimum value (no automated backups for free tier)
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_docdb_subnet_group.main.name
  vpc_security_group_ids  = [var.db_security_group_id]

  tags = {
    Name = "${var.project_name}-docdb-cluster"
  }
}

# Cluster Instance: The actual compute instance for the DB
resource "aws_docdb_cluster_instance" "cluster_instance" {
  count              = var.db_instance_count
  identifier         = "${var.project_name}-instance-${count.index}"
  cluster_identifier = aws_docdb_cluster.mongodb.id
  instance_class     = var.db_instance_class
}

