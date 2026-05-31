#!/bin/bash
# ============================================================
# deploy_cpanel_ssh.sh — Direct SSH/Rsync Deploy to cPanel
# ============================================================
# Zero-downtime, fast deployment using Rsync over SSH.
# No need to manually upload ZIP files anymore!
# ============================================================

set -e

# --- Configuration ---
SSH_USER="uygpuazs"
SSH_HOST="waguri.kawaiihost.net"
SSH_PORT="7822" # Port SSH telah disesuaikan dengan server Kawaiihost
REMOTE_DIR="/home/uygpuazs/public_html/"
# ---------------------

BUILD_DIR="dist"
API_SRC="api"

echo "🚀 Starting Automated Deployment to $SSH_USER@$SSH_HOST..."

# 1. Build React App
echo "🔨 Building React app..."
npm install
npm run build

# 2. Prepare API and Backend files
echo "🐘 Preparing PHP Backend..."
mkdir -p "$BUILD_DIR/api"
cp -r "$API_SRC"/* "$BUILD_DIR/api/" 2>/dev/null || true
mkdir -p "$BUILD_DIR/database"
cp database/schema.sql "$BUILD_DIR/database/" 2>/dev/null || true
cp database/db.php "$BUILD_DIR/database/" 2>/dev/null || true
mkdir -p "$BUILD_DIR/cache"

# 3. Security Hardening (Strip error reporting)
echo "🔐 Hardening PHP files..."
find "$BUILD_DIR/api" -name "*.php" -exec sed -i 's/ini_set.*display_errors.*1.*/ini_set("display_errors", 0);/g' {} \;
find "$BUILD_DIR/api" -name "*.php" -exec sed -i 's/error_reporting(E_ALL)/error_reporting(0)/g' {} \;

# 4. Rsync to cPanel
echo "⚡ Syncing files to cPanel via Rsync..."
echo "Menghubungkan ke $SSH_HOST..."
# Menggunakan rsync dengan opsi:
# -a: archive mode (mempertahankan permission, symlink, dll)
# -v: verbose
# -z: compress file data during transfer
# --delete: menghapus file di server yang sudah tidak ada di lokal (menjaga server tetap bersih)
# --exclude: mengabaikan file tertentu

rsync -avz -e "ssh -p $SSH_PORT" --delete \
    --exclude '.env' \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude 'deploy*' \
    "$BUILD_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR"

echo "✅ Deploy Complete! Website is live at $SSH_HOST."
