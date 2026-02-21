#!/bin/bash
# deploy-git.sh - Builds the React app and force-pushes 'dist' to the 'deploy' branch.
set -e

echo "🔨 Building React app..."
npm run build

echo "📄 Copying .htaccess and backend files..."
cp backend-php/.htaccess dist/.htaccess
mkdir -p dist/api
cp backend-php/api/trends.php dist/api/trends.php
mkdir -p dist/cache
echo "# Cache dir" > dist/cache/.gitkeep

echo "🖥️  Copying Node.js server files for cPanel..."
cp server.js dist/server.js
cp server-package.json dist/package.json

echo "🚀 Pushing to 'deploy' branch on GitHub..."
cd dist
rm -rf .git
git init
git checkout -b deploy
git add .
git commit -m "Deploy to cPanel: $(date +"%Y-%m-%d %H:%M:%S")"

# Force push to the deploy branch on origin
git push -f git@github.com:Nurdiansyah0/nurdiansyahlabs-react.git deploy
cd ..

echo "✅ Finished. Open cPanel Git Version Control to pull changes."
