#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
# NurdiansyahLabs — Production Deployment Package Preparation Script
# ════════════════════════════════════════════════════════════════════════════
#
# Packages the built React frontend in dist/ with:
# 1. Root routing & A/B testing .htaccess
# 2. Deployment manifest file
#
# Note: Backend API is handled separately by Python 3.13 Flask Modular Monolith
# (/home/uygpuazs/nurdiansyahlabs-python) via Passenger WSGI on /api/v1/*.
#
# Usage:
#   bash scripts/prepare_deploy_package.sh
# ════════════════════════════════════════════════════════════════════════════

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

if [ ! -d "dist" ]; then
  echo "❌ Error: Folder 'dist' tidak ditemukan. Harap jalankan build terlebih dahulu."
  exit 1
fi

echo "🌐 [1/2] Menyalin .htaccess utama..."
if [ -f public/.htaccess ]; then
  cp public/.htaccess dist/.htaccess
  echo "✅ .htaccess (A/B + SPA fallback) disalin dari public/."
fi

echo "📋 [2/2] Menghasilkan Deploy Manifest..."
COMMIT_HASH="${GIT_COMMIT:-$(git rev-parse HEAD 2>/dev/null || echo "unknown")}"
BRANCH_NAME="${GIT_BRANCH:-$(git branch --show-current 2>/dev/null || echo "unknown")}"
TRIGGER_ACTOR="${TRIGGERED_BY:-$(whoami)}"

cat > dist/deploy_manifest.txt << EOF
NurdiansyahLabs — Production Deploy Manifest
=================================================
Stack     : React 18 (Vite) + Python 3.13 Flask (PostgreSQL)
Timestamp : $(date -u '+%Y-%m-%d %H:%M:%S UTC')
Git Commit: ${COMMIT_HASH}
Git Branch: ${BRANCH_NAME}
Triggered : ${TRIGGER_ACTOR}
Node      : $(node --version 2>/dev/null || echo "N/A")
NPM       : $(npm --version 2>/dev/null || echo "N/A")
EOF
echo "✅ Manifest digenerate di dist/deploy_manifest.txt."
echo "🎉 Package frontend deployment siap di ./dist!"
