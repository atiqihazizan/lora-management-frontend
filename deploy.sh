#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error handling
set -e
trap 'echo -e "${RED}Error: Command failed${NC}"; exit 1' ERR

# Function to print status
print_status() {
    echo -e "${YELLOW}$1...${NC}"
}

# Check if we have uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_status "Found uncommitted changes"
    git add .
    git commit -m "Update: $(date +%Y-%m-%d)"
    print_status "Changes committed"
fi

# Pull latest changes
print_status "Pulling latest changes"
git pull origin main

# Install dependencies if needed
if [[ -n $(git diff HEAD@{1} HEAD -- package.json) ]]; then
    print_status "Package.json changed, installing dependencies"
    npm install
fi

# Build the project
print_status "Building project"
npm run build

# Deploy to server
print_status "Deploying to server"
rsync -avz --delete dist/ root@178.128.48.114:/var/www/loramesh/nodejs/public

# Push changes if any
if [[ -n $(git status -s) ]]; then
    print_status "Pushing changes to remote"
    git push origin main
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"