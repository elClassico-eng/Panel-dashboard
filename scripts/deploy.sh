#!/bin/bash

# Panel Dashboard Deployment Script

echo "🚀 Starting Panel Dashboard deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Set Docker Compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

print_status "Using Docker Compose command: $DOCKER_COMPOSE"

# Stop existing containers
print_status "Stopping existing containers..."
$DOCKER_COMPOSE down

# Remove old images (optional - uncomment if you want to force rebuild)
# print_status "Removing old images..."
# docker image prune -f

# Build and start containers
print_status "Building and starting containers..."
$DOCKER_COMPOSE up --build -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 10

# Check if services are running
if $DOCKER_COMPOSE ps | grep -q "Up"; then
    print_status "✅ Deployment successful!"
    print_status "🌐 Application is running at: http://localhost:3001"
    print_status "🗄️  MongoDB is running at: mongodb://localhost:27017"
    
    echo ""
    print_warning "📝 Next steps:"
    echo "1. Update your production environment variables"
    echo "2. Configure your domain and SSL certificates"
    echo "3. Set up monitoring and logging"
    echo "4. Configure database backups"
else
    print_error "❌ Deployment failed. Check logs with: $DOCKER_COMPOSE logs"
    exit 1
fi

# Show running containers
echo ""
print_status "Running containers:"
$DOCKER_COMPOSE ps