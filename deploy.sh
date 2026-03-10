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
API_SRC="api"
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  NurdiansyahLabs — cPanel Deploy Script    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ── Pre-flight checks ─────────────────────────────────────────────────────────

# Check 1: ensure .user.ini (DB credentials) is set and will NOT be deployed
echo "🔍 Pre-flight check: environment credentials..."
if [ -f ".user.ini" ]; then
    if grep -q "DB_PASS" ".user.ini" || grep -q "SMTP_PASS" ".user.ini"; then
        echo "  ✅ .user.ini found with credentials (will NOT be included in zip)"
    else
        echo "  ⚠️  WARNING: .user.ini found but DB_PASS / SMTP_PASS not set."
        echo "       Set them before deploying:"
        echo "       echo 'DB_PASS=your_password' >> .user.ini"
    fi
else
    echo "  ⚠️  WARNING: .user.ini not found. Set cPanel env vars via .htaccess or cPanel ENV manager."
fi

# Check 2: verify no hardcoded passwords in PHP source files
echo "🔍 Pre-flight check: no hardcoded secrets in PHP..."
if grep -rn "display_errors = 1" api/ database/ 2>/dev/null; then
    echo "  ❌ ERROR: display_errors=1 found. Must be removed before deploy."
    exit 1
fi
PASS_LEAK=$(grep -rn "'[A-Za-z@0-9]{8,}'" api/ database/ 2>/dev/null | grep -v "vendor/" | grep -v "\.lock" | wc -l)
if [ "$PASS_LEAK" -gt 0 ]; then
    echo "  ⚠️  WARNING: Possible hardcoded credential-like strings found. Review before deploying."
fi
echo "  ✅ Security pre-flight passed."
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
if [ -f "$API_SRC/.htaccess" ]; then
    cp "$API_SRC/.htaccess" "$BUILD_DIR/.htaccess"
fi

# Step 4: Copy Backend files into dist/ (Excluding sensitive setup/migration scripts)
echo "🐘 Adding PHP Backend (API & Database)..."
mkdir -p "$BUILD_DIR/api"
mkdir -p "$BUILD_DIR/database"

# Copy API files — strip any diagnostic / debug files
cp -r "$API_SRC"/* "$BUILD_DIR/api/"
rm -f "$BUILD_DIR/api/diagnose_env.php" \
      "$BUILD_DIR/api/truncate_db.php"

# SECURITY: strip display_errors from all copied PHP files in dist/
echo "🔐 Stripping debug flags from deployed PHP..."
find "$BUILD_DIR/api" -name "*.php" -exec sed -i \
    's/ini_set.*display_errors.*1.*/ini_set("display_errors", 0);/g' {} \;
find "$BUILD_DIR/api" -name "*.php" -exec sed -i \
    's/error_reporting(E_ALL)/error_reporting(0)/g' {} \;
echo "  ✅ PHP hardened for production."

# Copy database schema only (no migration scripts)
cp database/schema.sql "$BUILD_DIR/database/"
cp database/db.php "$BUILD_DIR/database/"
cp database/.htaccess "$BUILD_DIR/database/" 2>/dev/null || true

# SECURITY: remove hardcoded credentials from db.php in the build
# (they should already be removed, but this is a safety net)
sed -i "s/Nurdiansyah@024//g" "$BUILD_DIR/database/db.php" 2>/dev/null || true

# Create the cache directory (empty, writable on server)
mkdir -p "$BUILD_DIR/cache"
echo "# Cache dir — writable by PHP (set chmod 755 in cPanel)" > "$BUILD_DIR/cache/.gitkeep"

# Step 5: Gzip pre-compress JS, CSS, and HTML for faster serving
echo "🗜️  Pre-compressing assets (gzip)..."
find "$BUILD_DIR/assets" -name "*.js" -o -name "*.css" 2>/dev/null | while read f; do
    gzip -9 -k "$f" 2>/dev/null && echo "  📦 $f.gz"
done
find "$BUILD_DIR" -maxdepth 1 -name "*.html" 2>/dev/null | while read f; do
    gzip -9 -k "$f" 2>/dev/null
done
echo "  ✅ Gzip pre-compression done."

# Step 6: Generate deploy manifest for auditability
echo "📋 Generating deploy_manifest.txt..."
cat > "$BUILD_DIR/deploy_manifest.txt" <<EOF
NurdiansyahLabs Deploy Manifest
================================
Timestamp : $TIMESTAMP
Git Commit: $GIT_HASH
Node      : $(node --version 2>/dev/null || echo "unknown")
NPM       : $(npm --version 2>/dev/null || echo "unknown")

Files included:
EOF
find "$BUILD_DIR" -type f | sort >> "$BUILD_DIR/deploy_manifest.txt"
echo "  ✅ Manifest written."

# Step 7: Sitemap and robots.txt (auto-included from public/ by Vite)
echo "🗺️  sitemap.xml and robots.txt are included from public/..."

# Step 8: Zip everything (exclude source control, OS junk, dev files)
echo ""
echo "🗜️  Creating deployment zip: $ZIP_NAME"
cd "$BUILD_DIR" && zip -r "../$ZIP_NAME" . \
    -x "*.git*" \
    -x "*.github*" \
    -x "*.DS_Store" \
    -x "__MACOSX/*" \
    -x "*.map"   # strip sourcemaps from production  
cd ..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ DEPLOY PACKAGE READY                   ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "  File   : $ZIP_NAME"
echo "  Size   : $(du -sh $ZIP_NAME | cut -f1)"
echo "  Commit : $GIT_HASH"
echo ""
echo "  UPLOAD STEPS:"
echo "  1. Login to cPanel → Files → File Manager → public_html/"
echo "  2. Delete old files (or keep — .htaccess will override routing)"
echo "  3. Upload $ZIP_NAME and Extract Here"
echo "  4. Set cache/ folder permissions to 755 (Right-click → Change Permissions)"
echo "  5. Set cPanel ENV vars: DB_HOST, DB_USER, DB_PASS, DB_NAME, SMTP_USER, SMTP_PASS"
echo ""
echo "  🌐 Site: https://nurdiansyahlabs.com"
echo ""
