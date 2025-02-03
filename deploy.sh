#!/bin/bash
echo "Building..."
npm run build

echo "Uplading files to server..."
#scp -r dist/* root@178.128.48.114:/var/www/loramesh/nodejs/public
rsync -av --delete dist/ root@178.128.48.114:/var/www/loramesh/nodejs/public

echo "Deployment completed"