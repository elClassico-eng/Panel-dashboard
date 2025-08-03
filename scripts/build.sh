#!/bin/bash

# Panel Dashboard Build Script

echo "🔨 Building Panel Dashboard..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Install root dependencies
print_status "Installing root dependencies..."
npm ci

# Build client
print_status "Building client application..."
cd client
npm ci
npm run lint
npm run build

if [ $? -ne 0 ]; then
    print_error "Client build failed"
    exit 1
fi

print_status "✅ Client build successful"
cd ..

# Install server dependencies
print_status "Installing server dependencies..."
cd server
npm ci

if [ $? -ne 0 ]; then
    print_error "Server dependency installation failed"
    exit 1
fi

print_status "✅ Server dependencies installed"
cd ..

# Copy client build to server public directory (for production)
print_status "Preparing production build..."
rm -rf server/public
cp -r client/dist server/public

print_status "✅ Build process completed successfully!"

echo ""
print_warning "📝 To deploy:"
echo "1. For Docker: Run './scripts/deploy.sh'"
echo "2. For manual: Set environment variables and run 'npm start' in server directory"
echo "3. For cloud: Use the Dockerfile or deploy the server/public directory"