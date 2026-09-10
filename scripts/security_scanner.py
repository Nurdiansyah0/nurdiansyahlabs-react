#!/usr/bin/env python3
"""
NurdiansyahLabs — Security & Secret Hygiene Scanner (R4)

A standalone static security scanner that inspects the repository workspace to:
1. Detect tracked private keys, database dumps, or credentials in Git.
2. Verify .gitignore coverage for sensitive file patterns.
3. Scan source files for hardcoded passwords and secrets.

Usage:
    python3 scripts/security_scanner.py [--project-dir /path/to/project]

Exit code 0 = clean, non-zero = findings detected.
"""

import os
import sys
import re
import subprocess
import argparse
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Finding:
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    category: str
    file: str
    line: Optional[int]
    description: str


@dataclass
class ScanReport:
    findings: list = field(default_factory=list)
    checks_passed: int = 0
    checks_failed: int = 0
    checks_total: int = 0

    def add_finding(self, finding: Finding):
        self.findings.append(finding)
        self.checks_failed += 1
        self.checks_total += 1

    def mark_pass(self):
        self.checks_passed += 1
        self.checks_total += 1


# ─── Configuration ────────────────────────────────────────────────────────────

# File patterns that should NEVER be tracked by Git
DANGEROUS_TRACKED_PATTERNS = [
    ("id_rsa", "SSH private key"),
    ("id_ed25519", "SSH private key (Ed25519)"),
    ("*.pem", "PEM certificate/key file"),
    ("*.key", "Private key file"),
]

DANGEROUS_TRACKED_EXTENSIONS = {
    ".pem": "PEM certificate/key",
    ".key": "Private key",
    ".pfx": "PKCS12 certificate",
    ".p12": "PKCS12 certificate",
}

# SQL dump files that contain production data
DANGEROUS_SQL_PATTERNS = [
    re.compile(r"^(?!database/schema\.sql).*\.sql$"),  # Any .sql except schema.sql
]

# Hardcoded credential patterns in source code
CREDENTIAL_PATTERNS = [
    (re.compile(r"""['"]Nurdiansyah@024['"]"""), "Hardcoded database password"),
    (re.compile(r"""password\s*=\s*['"][^'"]{6,}['"]""", re.IGNORECASE), "Possible hardcoded password"),
    (re.compile(r"""mysql_pass\s*=\s*['"][^'"]+['"]"""), "Hardcoded MySQL password"),
    (re.compile(r"""api_key\s*=\s*['"][a-zA-Z0-9_\-]{20,}['"]""", re.IGNORECASE), "Possible hardcoded API key"),
]

# Known false positives (vendor files, test fixtures, config examples)
FALSE_POSITIVE_PATHS = [
    "api/vendor/",
    "venv/",
    "backend/venv/",
    "node_modules/",
    ".env.example",
    "backend/.env.example",
]

# .gitignore patterns that MUST exist for security
REQUIRED_GITIGNORE_PATTERNS = [
    (".env", "Environment files with secrets"),
    (".env.*", "Environment variant files"),
    ("id_rsa", "SSH private key"),
    ("*.pem", "PEM key/certificate files"),
]

# Files that should be gitignored
FILES_THAT_SHOULD_BE_IGNORED = [
    "id_rsa",
    "uygpuazs_nurdiansyahlabs_db.sql",
    "cloudflare_dns_backup.json",
    "cloudflare_dns_backup_full.json",
]


def run_git(args: list, cwd: str) -> tuple:
    """Run a git command and return (returncode, stdout, stderr)."""
    result = subprocess.run(
        ["git"] + args,
        capture_output=True, text=True, cwd=cwd,
        timeout=30,
    )
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def check_tracked_sensitive_files(project_dir: str, report: ScanReport):
    """Check if sensitive files are tracked by Git."""
    print("\n🔍 Check 1: Tracked sensitive files in Git index...")

    rc, stdout, _ = run_git(["ls-files"], project_dir)
    if rc != 0:
        report.add_finding(Finding("HIGH", "GIT", project_dir, None, "Could not list git tracked files"))
        return

    tracked_files = stdout.splitlines()

    # Check for SSH private keys
    for tracked in tracked_files:
        basename = os.path.basename(tracked)
        if basename in ("id_rsa", "id_ed25519", "id_dsa", "id_ecdsa"):
            report.add_finding(Finding(
                "CRITICAL", "SECRET_TRACKED", tracked, None,
                f"SSH private key '{tracked}' is tracked by Git — MUST be removed from tracking"
            ))
        elif basename.endswith((".key", ".pfx", ".p12")):
            report.add_finding(Finding(
                "CRITICAL", "SECRET_TRACKED", tracked, None,
                f"Private key file '{tracked}' is tracked by Git"
            ))

    # Check for tracked SQL dump files (not schema)
    for tracked in tracked_files:
        for pattern in DANGEROUS_SQL_PATTERNS:
            if pattern.match(tracked) and "schema" not in tracked.lower():
                # Distinguish between small schema-like files and large dumps
                filepath = os.path.join(project_dir, tracked)
                size = os.path.getsize(filepath) if os.path.exists(filepath) else 0
                severity = "CRITICAL" if size > 10000 else "HIGH"
                report.add_finding(Finding(
                    severity, "DATA_TRACKED", tracked, None,
                    f"SQL file '{tracked}' ({size:,} bytes) is tracked by Git — may contain PII/credentials"
                ))

    # Check for tracked venv directory
    venv_files = [f for f in tracked_files if f.startswith("venv/")]
    if venv_files:
        report.add_finding(Finding(
            "MEDIUM", "BLOAT_TRACKED", "venv/", None,
            f"Python virtualenv directory is tracked ({len(venv_files)} files) — should be in .gitignore"
        ))

    if not any(f.severity in ("CRITICAL", "HIGH") for f in report.findings if f.category in ("SECRET_TRACKED", "DATA_TRACKED")):
        report.mark_pass()
        print("  ✅ No critical sensitive files tracked.")
    else:
        critical_count = sum(1 for f in report.findings if f.severity == "CRITICAL")
        print(f"  ❌ Found {critical_count} critical tracked file(s).")


def check_hardcoded_credentials(project_dir: str, report: ScanReport):
    """Scan source files for hardcoded credentials."""
    print("\n🔍 Check 2: Hardcoded credentials in source code...")

    scan_extensions = {".py", ".php", ".js", ".jsx", ".ts", ".tsx", ".sh", ".json"}
    findings_count = 0

    for root, dirs, files in os.walk(project_dir):
        # Skip directories
        dirs[:] = [d for d in dirs if d not in (
            "node_modules", "venv", ".git", "dist", "__pycache__",
            ".pytest_cache", "vendor", ".agents", "backend/venv",
        )]

        rel_root = os.path.relpath(root, project_dir)

        for fname in files:
            filepath = os.path.join(root, fname)
            rel_path = os.path.relpath(filepath, project_dir)

            # Skip false positive paths
            if any(rel_path.startswith(fp) for fp in FALSE_POSITIVE_PATHS):
                continue

            ext = os.path.splitext(fname)[1].lower()
            if ext not in scan_extensions:
                continue

            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    for line_num, line in enumerate(f, 1):
                        for pattern, desc in CREDENTIAL_PATTERNS:
                            if pattern.search(line):
                                # Skip .env.example and comments
                                stripped = line.strip()
                                if stripped.startswith("#") or stripped.startswith("//"):
                                    continue
                                if "CHANGE_ME" in line or "your-" in line:
                                    continue

                                report.add_finding(Finding(
                                    "HIGH", "HARDCODED_SECRET", rel_path, line_num,
                                    f"{desc}: {stripped[:120]}"
                                ))
                                findings_count += 1
            except (OSError, UnicodeDecodeError):
                continue

    if findings_count == 0:
        report.mark_pass()
        print("  ✅ No hardcoded credentials detected.")
    else:
        print(f"  ❌ Found {findings_count} hardcoded credential(s).")


def check_gitignore_coverage(project_dir: str, report: ScanReport):
    """Verify .gitignore has required security patterns."""
    print("\n🔍 Check 3: .gitignore security coverage...")

    gitignore_path = os.path.join(project_dir, ".gitignore")
    if not os.path.exists(gitignore_path):
        report.add_finding(Finding(
            "CRITICAL", "GITIGNORE", ".gitignore", None,
            ".gitignore file not found — repository is unprotected"
        ))
        return

    with open(gitignore_path, "r") as f:
        gitignore_content = f.read()

    gitignore_lines = [
        line.strip() for line in gitignore_content.splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

    # Check required patterns
    missing_patterns = []
    for pattern, desc in REQUIRED_GITIGNORE_PATTERNS:
        if not any(pattern in line or line == pattern for line in gitignore_lines):
            missing_patterns.append((pattern, desc))

    if missing_patterns:
        for pattern, desc in missing_patterns:
            report.add_finding(Finding(
                "HIGH", "GITIGNORE_GAP", ".gitignore", None,
                f"Missing pattern '{pattern}' ({desc})"
            ))
        print(f"  ❌ {len(missing_patterns)} required .gitignore pattern(s) missing.")
    else:
        report.mark_pass()
        print("  ✅ .gitignore has all required security patterns.")

    # Check specific files that should be ignored
    for filename in FILES_THAT_SHOULD_BE_IGNORED:
        filepath = os.path.join(project_dir, filename)
        if os.path.exists(filepath):
            rc, _, _ = run_git(["check-ignore", "-q", filename], project_dir)
            if rc != 0:
                report.add_finding(Finding(
                    "HIGH", "GITIGNORE_GAP", filename, None,
                    f"Sensitive file '{filename}' exists but is NOT covered by .gitignore"
                ))


def check_env_files_not_tracked(project_dir: str, report: ScanReport):
    """Verify that .env files are not tracked by Git."""
    print("\n🔍 Check 4: .env files not tracked by Git...")

    rc, stdout, _ = run_git(["ls-files"], project_dir)
    tracked = stdout.splitlines() if rc == 0 else []

    env_tracked = [f for f in tracked if ".env" in os.path.basename(f) and "example" not in f.lower()]

    if env_tracked:
        for ef in env_tracked:
            report.add_finding(Finding(
                "CRITICAL", "ENV_TRACKED", ef, None,
                f"Environment file '{ef}' is tracked by Git — likely contains secrets"
            ))
        print(f"  ❌ Found {len(env_tracked)} tracked .env file(s).")
    else:
        report.mark_pass()
        print("  ✅ No .env files tracked by Git.")


def check_default_secret_keys(project_dir: str, report: ScanReport):
    """Check for insecure default SECRET_KEY values in configuration."""
    print("\n🔍 Check 5: Default/weak SECRET_KEY values...")

    weak_patterns = [
        re.compile(r"""SECRET_KEY.*?['"]nurdiansyahlabs-secret-key[^'"]*['"]"""),
        re.compile(r"""SECRET_KEY.*?['"]change-me[^'"]*['"]""", re.IGNORECASE),
        re.compile(r"""SECRET_KEY.*?['"]secret['"]""", re.IGNORECASE),
    ]

    config_files = [
        "backend/app/core/config.py",
    ]

    found = False
    for cf in config_files:
        filepath = os.path.join(project_dir, cf)
        if not os.path.exists(filepath):
            continue
        with open(filepath, "r") as f:
            content = f.read()
        for pattern in weak_patterns:
            match = pattern.search(content)
            if match:
                report.add_finding(Finding(
                    "MEDIUM", "WEAK_SECRET", cf, None,
                    f"Weak/default SECRET_KEY fallback detected — should be randomized in production"
                ))
                found = True
                break

    if not found:
        report.mark_pass()
        print("  ✅ No weak SECRET_KEY defaults found.")
    else:
        print("  ⚠️  Weak SECRET_KEY fallback detected.")


def check_cron_api_key_exposed(project_dir: str, report: ScanReport):
    """Check if CRON_API_KEY is hardcoded in frontend-accessible code."""
    print("\n🔍 Check 6: CRON_API_KEY exposure in frontend code...")

    pattern = re.compile(r"nurdiansyah-cron-\d+")
    scan_dirs = ["src/"]

    found = False
    for scan_dir in scan_dirs:
        dir_path = os.path.join(project_dir, scan_dir)
        if not os.path.isdir(dir_path):
            continue
        for root, _, files in os.walk(dir_path):
            for fname in files:
                if fname.endswith((".js", ".jsx", ".ts", ".tsx")):
                    filepath = os.path.join(root, fname)
                    rel_path = os.path.relpath(filepath, project_dir)
                    with open(filepath, "r", errors="ignore") as f:
                        for line_num, line in enumerate(f, 1):
                            if pattern.search(line):
                                report.add_finding(Finding(
                                    "HIGH", "KEY_EXPOSED", rel_path, line_num,
                                    f"CRON_API_KEY hardcoded in frontend code — exposes admin endpoint"
                                ))
                                found = True

    if not found:
        report.mark_pass()
        print("  ✅ No CRON_API_KEY exposure in frontend code.")
    else:
        print("  ❌ CRON_API_KEY exposed in frontend source.")


def print_report(report: ScanReport):
    """Print the final security scan report."""
    print("\n" + "═" * 70)
    print("  NurdiansyahLabs — Security & Secret Hygiene Report")
    print("═" * 70)

    if not report.findings:
        print("\n  ✅ ALL CHECKS PASSED — No security findings detected.")
        print(f"\n  Total checks: {report.checks_total}")
        print(f"  Passed:       {report.checks_passed}")
        print(f"  Failed:       {report.checks_failed}")
        return

    # Group by severity
    by_severity = {}
    for f in report.findings:
        by_severity.setdefault(f.severity, []).append(f)

    severity_order = ["CRITICAL", "HIGH", "MEDIUM", "LOW"]

    for sev in severity_order:
        findings = by_severity.get(sev, [])
        if not findings:
            continue

        icon = {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🔵"}[sev]
        print(f"\n{icon} {sev} ({len(findings)})")
        print("─" * 60)
        for f in findings:
            loc = f.file
            if f.line:
                loc += f":{f.line}"
            print(f"  [{f.category}] {loc}")
            print(f"    → {f.description}")

    print("\n" + "─" * 60)
    print(f"  Total checks: {report.checks_total}")
    print(f"  Passed:       {report.checks_passed}")
    print(f"  Failed:       {report.checks_failed}")
    print(f"  Findings:     {len(report.findings)}")

    critical = len(by_severity.get("CRITICAL", []))
    high = len(by_severity.get("HIGH", []))
    if critical > 0:
        print(f"\n  ❌ VERDICT: {critical} CRITICAL issue(s) — MUST be resolved before any commit.")
    elif high > 0:
        print(f"\n  ⚠️  VERDICT: {high} HIGH issue(s) — should be resolved before production deployment.")
    else:
        print(f"\n  ⚠️  VERDICT: Minor issues found — review recommended.")


def main():
    parser = argparse.ArgumentParser(description="NurdiansyahLabs Security Scanner")
    parser.add_argument("--project-dir", default=None, help="Path to project root")
    args = parser.parse_args()

    project_dir = args.project_dir or os.getcwd()
    project_dir = os.path.abspath(project_dir)

    if not os.path.isdir(os.path.join(project_dir, ".git")):
        print(f"❌ Not a git repository: {project_dir}")
        sys.exit(2)

    print("╔════════════════════════════════════════════╗")
    print("║  NurdiansyahLabs Security Scanner v1.0     ║")
    print("╚════════════════════════════════════════════╝")
    print(f"\n  Scanning: {project_dir}")

    report = ScanReport()

    check_tracked_sensitive_files(project_dir, report)
    check_hardcoded_credentials(project_dir, report)
    check_gitignore_coverage(project_dir, report)
    check_env_files_not_tracked(project_dir, report)
    check_default_secret_keys(project_dir, report)
    check_cron_api_key_exposed(project_dir, report)

    print_report(report)

    sys.exit(1 if report.findings else 0)


if __name__ == "__main__":
    main()
