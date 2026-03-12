# Fetch AZS for the region defined in teh provider
data "aws_availability_zones" "available" {
state = "available"
}

# The VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

#Internet Gateway (The Bridge Between AWS and the Internet
resource "aws_internet_gateway" "igw" {
vpc_id = aws_vpc.main.id

tags = {
Name = "${var.project_name}-igw"
}
}

# Public Subnets (For ALB and Frontend)
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
  }
}

# Private Subnets (For the Backend and DocumentDB)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
  }
}

#Public Route Table
resource "aws_route_table" "public" {
vpc_id = aws_vpc.main.id
 route  {
 cidr_block = "0.0.0.0/0"
 gateway_id = aws_internet_gateway.igw.id
 }

 tags = {
 Name = "${var.project_name}-public-rt"
 }
 }

 #Association: Link Public Subnets to Public Route Table
 resource "aws_route_table_association" "public" {
 count = 2
 subnet_id = aws_subnet.public[count.index].id
 route_table_id = aws_route_table.public.id
 }
 
