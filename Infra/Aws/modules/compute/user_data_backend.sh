#!/bin/bash
# User data script for backend EC2 instance
set -e

# Start SSM agent as early as possible for faster registration
systemctl enable amazon-ssm-agent || true
systemctl start amazon-ssm-agent || true
if ! systemctl is-active --quiet amazon-ssm-agent; then
	yum install -y amazon-ssm-agent
	systemctl enable amazon-ssm-agent
	systemctl start amazon-ssm-agent
fi

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install MongoDB (Community Edition)
cat <<EOF > /etc/yum.repos.d/mongodb-org-7.0.repo
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

yum install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Configure MongoDB to accept connections from localhost
sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf
systemctl restart mongod

# Set environment variable for database endpoint
echo "DB_ENDPOINT=localhost:27017" >> /etc/environment
echo "MONGODB_URI=mongodb://localhost:27017/ecommerce" >> /etc/environment

# Install Node.js (needed for backend)
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Pull and run backend container (adjust image name as needed)
# docker pull your-backend-image:latest
# docker run -d -p 3000:3000 -e MONGODB_URI=mongodb://localhost:27017/ecommerce your-backend-image:latest
