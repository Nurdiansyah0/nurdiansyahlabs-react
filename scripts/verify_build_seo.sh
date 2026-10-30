#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
# NurdiansyahLabs — Built Artifact SEO Drift Verification Runner
# ════════════════════════════════════════════════════════════════════════════
#
# Starts a temporary static server against dist/, runs seo_drift.py,
# and guarantees the temporary server process is killed upon completion.
#
# Usage:
#   bash scripts/verify_build_seo.sh
# ════════════════════════════════════════════════════════════════════════════

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

if [ ! -d "dist" ]; then
  echo "❌ Error: Folder 'dist' tidak ditemukan. Harap build frontend terlebih dahulu."
  exit 1
fi

PORT="${TEST_PORT:-3000}"
echo "🚀 [SEO Audit] Menjalankan server static lokal pada port ${PORT}..."

# Start local server to serve dist
python3 -m http.server "${PORT}" --bind 127.0.0.1 --directory dist >/dev/null 2>&1 &
SERVE_PID=$!

# Ensure server process is terminated on script exit
cleanup() {
  echo "🧹 [SEO Audit] Mematikan server static lokal (PID: ${SERVE_PID})..."
  pkill -P "${SERVE_PID}" 2>/dev/null || true
  kill "${SERVE_PID}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Wait for server ready (max 10 seconds)
READY=false
for i in {1..20}; do
  if curl -s -o /dev/null "http://127.0.0.1:${PORT}" 2>/dev/null; then
    READY=true
    break
  fi
  sleep 0.5
done

if [ "$READY" != "true" ]; then
  echo "❌ Error: Server static lokal gagal merespon pada port ${PORT}."
  exit 1
fi

echo "🔍 [SEO Audit] Menjalankan analisis SEO Invariants & Drift..."
export SEO_TARGET_URL="http://127.0.0.1:${PORT}"
python3 scripts/seo_drift.py

echo "✅ [SEO Audit] Semua invariant SEO lulus tanpa drift!"
