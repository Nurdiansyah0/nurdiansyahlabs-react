#!/bin/bash
# deploy-git.sh - Builds the React app and force-pushes 'dist' to the 'deploy' branch.
set -e

echo "🔨 Building React app..."
npm run build

echo "⚡ Inlining CSS into index.html to fix render-blocking PSI issue..."
node -e "
const fs = require('fs');
const glob = require('glob');
const htmlPath = 'dist/index.html';
const cssFiles = glob.sync('dist/assets/*.css');
if (cssFiles.length > 0) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    const cssContent = fs.readFileSync(cssFiles[0], 'utf8');
    // Replace the <link rel=\"stylesheet\" href=\"/assets/index-*.css\"> with an inline <style> tag
    html = html.replace(/<link rel=\"stylesheet\" crossorigin href=\"\/assets\/[^\"]+\.css\">/, '<style>' + cssContent + '</style>');
    fs.writeFileSync(htmlPath, html);
    // Remove the unused CSS file so it doesn't get deployed or requested
    fs.unlinkSync(cssFiles[0]);
    console.log('✅ Inlined CSS and removed original file:', cssFiles[0]);
}
"

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
