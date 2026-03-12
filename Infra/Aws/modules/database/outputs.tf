output "db_endpoint" {
  description = "The DNS endpoint for the DocumentDB cluster"
  value       = aws_docdb_cluster.mongodb.endpoint
}

output "db_cluster_endpoint" {
  description = "The DNS endpoint for the DocumentDB cluster"
  value       = aws_docdb_cluster.mongodb.endpoint
}

output "db_cluster_port" {
  description = "The port the database is listening on"
  value       = aws_docdb_cluster.mongodb.port
}

output "db_connection_string" {
  description = "A helper connection string for your app (password excluded)"
  value       = "mongodb://${var.db_username}:<PASSWORD>@${aws_docdb_cluster.mongodb.endpoint}:${aws_docdb_cluster.mongodb.port}"
}