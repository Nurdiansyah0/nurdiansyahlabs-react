#!/bin/bash
# ════════════════════════════════════════════════════════════════════════════
# NurdiansyahLabs — Unified Test Runner (R1)
# ════════════════════════════════════════════════════════════════════════════
#
# Runs all verification tiers in sequence:
#   Tier 1: Backend API & Contract Tests (pytest)
#   Tier 2: Frontend Build & Prerender Verification (Node.js)
#   Tier 3: Security & Secret Hygiene Scanner (Python)
#
# Usage:
#   chmod +x scripts/run_tests.sh && ./scripts/run_tests.sh
#   ./scripts/run_tests.sh --skip-build       # Skip frontend build step
#   ./scripts/run_tests.sh --only-backend     # Only run backend tests
#   ./scripts/run_tests.sh --only-security    # Only run security scanner
#
# Exit code: 0 if ALL tiers pass, 1 if ANY tier fails.
# ════════════════════════════════════════════════════════════════════════════

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ─── Argument parsing ─────────────────────────────────────────────────────────
SKIP_BUILD=false
ONLY_BACKEND=false
ONLY_FRONTEND=false
ONLY_SECURITY=false

for arg in "$@"; do
    case $arg in
        --skip-build)   SKIP_BUILD=true ;;
        --only-backend) ONLY_BACKEND=true ;;
        --only-frontend) ONLY_FRONTEND=true ;;
        --only-security) ONLY_SECURITY=true ;;
        -h|--help)
            echo "Usage: $0 [--skip-build] [--only-backend|--only-frontend|--only-security]"
            exit 0
            ;;
    esac
done

# ─── Variables ─────────────────────────────────────────────────────────────────
TIER1_STATUS="SKIP"
TIER2_STATUS="SKIP"
TIER3_STATUS="SKIP"
TIER1_TIME=0
TIER2_TIME=0
TIER3_TIME=0
EXIT_CODE=0

# ─── Helpers ───────────────────────────────────────────────────────────────────
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║  NurdiansyahLabs — Unified Test Runner    ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "  Project: $PROJECT_DIR"
    echo "  Date:    $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
}

run_tier() {
    local tier_name="$1"
    local tier_cmd="$2"
    local start_time end_time duration

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  ▶ $tier_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    start_time=$(date +%s)
    eval "$tier_cmd"
    local rc=$?
    end_time=$(date +%s)
    duration=$((end_time - start_time))

    if [ $rc -eq 0 ]; then
        echo "  ✅ $tier_name: PASSED (${duration}s)"
        echo "$duration PASS"
    else
        echo "  ❌ $tier_name: FAILED (${duration}s)"
        echo "$duration FAIL"
    fi

    return $rc
}

# ─── Main ──────────────────────────────────────────────────────────────────────
print_header

# Tier 1: Backend API Tests
if [ "$ONLY_FRONTEND" = false ] && [ "$ONLY_SECURITY" = false ]; then
    VENV_PYTHON="$PROJECT_DIR/backend/venv/bin/python"

    if [ -f "$VENV_PYTHON" ]; then
        PYTEST_CMD="cd $PROJECT_DIR && PYTHONPATH=backend $VENV_PYTHON -m pytest backend/tests/test_api.py -v --tb=short 2>&1"
    else
        PYTEST_CMD="cd $PROJECT_DIR && PYTHONPATH=backend python3 -m pytest backend/tests/test_api.py -v --tb=short 2>&1"
    fi

    result=$(run_tier "Tier 1: Backend API Tests" "$PYTEST_CMD")
    TIER1_TIME=$(echo "$result" | tail -1 | awk '{print $1}')
    TIER1_STATUS=$(echo "$result" | tail -1 | awk '{print $2}')

    if [ "$TIER1_STATUS" = "FAIL" ]; then
        EXIT_CODE=1
    fi
fi

# Tier 2: Frontend Build & Prerender Verification
if [ "$ONLY_BACKEND" = false ] && [ "$ONLY_SECURITY" = false ]; then
    FRONTEND_CMD="cd $PROJECT_DIR && node scripts/verify_frontend.js"
    if [ "$SKIP_BUILD" = true ]; then
        FRONTEND_CMD="$FRONTEND_CMD --skip-build"
    fi
    FRONTEND_CMD="$FRONTEND_CMD 2>&1"

    result=$(run_tier "Tier 2: Frontend Verification" "$FRONTEND_CMD")
    TIER2_TIME=$(echo "$result" | tail -1 | awk '{print $1}')
    TIER2_STATUS=$(echo "$result" | tail -1 | awk '{print $2}')

    if [ "$TIER2_STATUS" = "FAIL" ]; then
        EXIT_CODE=1
    fi
fi

# Tier 3: Security Scanner
if [ "$ONLY_BACKEND" = false ] && [ "$ONLY_FRONTEND" = false ]; then
    SCANNER_PYTHON="$PROJECT_DIR/backend/venv/bin/python"
    if [ ! -f "$SCANNER_PYTHON" ]; then
        SCANNER_PYTHON="python3"
    fi

    SECURITY_CMD="$SCANNER_PYTHON $PROJECT_DIR/scripts/security_scanner.py --project-dir $PROJECT_DIR 2>&1"

    result=$(run_tier "Tier 3: Security Scanner" "$SECURITY_CMD")
    TIER3_TIME=$(echo "$result" | tail -1 | awk '{print $1}')
    TIER3_STATUS=$(echo "$result" | tail -1 | awk '{print $2}')

    if [ "$TIER3_STATUS" = "FAIL" ]; then
        EXIT_CODE=1
    fi
fi

# ─── Summary ───────────────────────────────────────────────────────────────────
TOTAL_TIME=$((TIER1_TIME + TIER2_TIME + TIER3_TIME))

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              UNIFIED TEST RUNNER — SUMMARY                ║"
echo "╠════════════════════════════════════════════════════════════╣"
printf "║  %-36s  %-8s  %5ss  ║\n" "Tier" "Status" "Time"
echo "╠════════════════════════════════════════════════════════════╣"

format_status() {
    case $1 in
        PASS) echo "  ✅ PASS" ;;
        FAIL) echo "  ❌ FAIL" ;;
        SKIP) echo "  ⏩ SKIP" ;;
    esac
}

printf "║  %-36s  %-8s  %5ss  ║\n" "Backend API Tests" "$(format_status $TIER1_STATUS)" "$TIER1_TIME"
printf "║  %-36s  %-8s  %5ss  ║\n" "Frontend Verification" "$(format_status $TIER2_STATUS)" "$TIER2_TIME"
printf "║  %-36s  %-8s  %5ss  ║\n" "Security Scanner" "$(format_status $TIER3_STATUS)" "$TIER3_TIME"
echo "╠════════════════════════════════════════════════════════════╣"
printf "║  %-36s  %-8s  %5ss  ║\n" "TOTAL" "" "$TOTAL_TIME"
echo "╚════════════════════════════════════════════════════════════╝"

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "  🎉 ALL TIERS PASSED"
    echo ""
else
    echo ""
    echo "  ❌ SOME TIERS FAILED — Review output above."
    echo ""
fi

exit $EXIT_CODE
