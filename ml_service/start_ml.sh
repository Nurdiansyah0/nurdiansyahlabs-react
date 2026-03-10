#!/bin/bash
# ============================================================
# ml_service/start_ml.sh — RecoEngine Python Service Launcher
# ============================================================
# Usage:  chmod +x start_ml.sh && ./start_ml.sh
# ============================================================

set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  RecoEngine – ML Recommendation Service      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Check Python 3 ──────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+ first."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "🐍 Python $PYTHON_VERSION detected"

# ── Create virtual environment if not present ───────────────
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

# ── Install / upgrade dependencies ──────────────────────────
echo "📦 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "  ✅ Dependencies ready."
echo ""

# ── Start FastAPI service ────────────────────────────────────
echo "🚀 Starting RecoEngine on http://localhost:8001"
echo "   Docs: http://localhost:8001/docs"
echo "   Health: http://localhost:8001/health"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

uvicorn main:app \
    --host 0.0.0.0 \
    --port 8001 \
    --reload \
    --log-level info
