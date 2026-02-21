#!/bin/bash
# ============================================================
# deploy.sh — NurdiansyahLabs cPanel Deployment Script
# ============================================================
# Usage:  chmod +x deploy.sh && ./deploy.sh
# Output: deploy_YYYYMMDD_HHMMSS.zip  ← upload to cPanel File Manager
# ============================================================

set -e
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="deploy_${TIMESTAMP}.zip"
BUILD_DIR="dist"
PHP_DIR="backend-php"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  NurdiansyahLabs — cPanel Deploy Script    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Step 1: Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Step 2: Build React app
echo "🔨 Building React app (npm run build)..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build failed! dist/ not found."
    exit 1
fi
echo "✅ Build successful → $BUILD_DIR/"

# Step 3: Copy .htaccess into dist/
echo "📄 Adding .htaccess for React Router..."
cp "$PHP_DIR/.htaccess" "$BUILD_DIR/.htaccess"

# Step 4: Create api/ folder in dist/ and copy PHP backend
echo "🐘 Adding PHP Trends API..."
mkdir -p "$BUILD_DIR/api"
cp "$PHP_DIR/api/trends.php" "$BUILD_DIR/api/trends.php"

# Create the cache directory (empty, writable on server)
mkdir -p "$BUILD_DIR/cache"
echo "# Cache dir — writable by PHP" > "$BUILD_DIR/cache/.gitkeep"

# Step 5: Copy sitemap.xml and robots.txt (already in public/, Vite copies them)
echo "🗺️  sitemap.xml and robots.txt are included from public/..."

# Step 6: Zip everything
echo ""
echo "🗜️  Creating deployment zip: $ZIP_NAME"
cd "$BUILD_DIR" && zip -r "../$ZIP_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ DEPLOY PACKAGE READY                   ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "  File: $ZIP_NAME"
echo "  Size: $(du -sh $ZIP_NAME | cut -f1)"
echo ""
echo "  UPLOAD STEPS:"
echo "  1. Login → https://waguri.kawaiihost.net:2083"
echo "     Username: uygpuazs"
echo "  2. Go to Files → File Manager → public_html/"
echo "  3. Delete old files (or keep — .htaccess will override)"
echo "  4. Upload $ZIP_NAME and Extract Here"
echo "  5. Set cache/ folder permissions to 755:"
echo "     Right-click cache/ → Change Permissions → 755"
echo ""
echo "  🌐 Your site: https://nurdiansyahlabs.com"
echo "  📊 Trends API: https://nurdiansyahlabs.com/api/trends.php"
echo ""
