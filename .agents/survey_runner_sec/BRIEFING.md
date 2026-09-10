# BRIEFING — 2026-09-08T11:35:00Z

## Mission
Survey requirements R1 (Unified Test Runner) and R4 (Security & Secret Hygiene Scanner) for the NurdiansyahLabs automated test suite.

## 🔒 My Identity
- Archetype: explorer
- Roles: Security and Runner Explorer
- Working directory: /home/nurdiansyah/dev/Personal_project/.agents/survey_runner_sec
- Original parent: a4d3b1f3-0d7c-4f48-8f97-2fc4a7bf699e
- Milestone: survey_runner_and_security

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Write only to .agents/survey_runner_sec/
- Do not modify or write any source code files

## Current Parent
- Conversation ID: a4d3b1f3-0d7c-4f48-8f97-2fc4a7bf699e
- Updated: not yet

## Investigation State
- **Explored paths**:
  - Root: `.gitignore`, `package.json`, `deploy.sh`, `deploy_cpanel_ssh.sh`, `id_rsa`, `connection`, `postgre-env`, `uygpuazs_nurdiansyahlabs_db.sql`, `init.sql`, `vite.config.js`
  - Backend: `backend/app/core/config.py`, `backend/app/core/security.py`, `backend/requirements.txt`, `backend/tests/test_api.py`, `backend/migrate_data.py`, `backend/venv`
  - Database: `database/db.php`, `database/setup_mysql.php`, `database/admin_users.sql`, `database/schema.sql`, `database/products.sql`
  - Scripts: `scripts/prerender.js`, `scripts/seo_drift.py`, `scripts/capture_screenshots.js`
- **Key findings**:
  - R4 Security:
    1. Active tracked OpenSSH private key: `id_rsa` tracked in Git index.
    2. Active tracked production DB dump: `uygpuazs_nurdiansyahlabs_db.sql` (737 KB phpMyAdmin dump containing admin users, leads, analytics) tracked in Git index.
    3. Active tracked SQLite cache: `api/cache/ai_cache.sqlite` tracked in Git index.
    4. Active tracked seeders with credentials: `database/admin_users.sql` (Admin bcrypt hash & email) and `init.sql` (demo user hashes).
    5. Hardcoded credentials in source code: `backend/migrate_data.py` (mysql_pass = "Nurdiansyah@024"), `database/db.php` ('Nurdiansyah@024' fallback), `database/setup_mysql.php` ('Nurdiansyah@024').
    6. Gitignore gaps: `.gitignore` ignores `.env.*` without exempting `.env.example`, blocks `dump.sql`/`backup.sql` only under `/database/` not repo root, lacks rules for `id_rsa`/`id_*`/`*.pem`/`*.key`.
  - R1 Unified Runner:
    1. Proposed architecture: Python runner (`scripts/run_tests.py`) invoked directly or via `npm test` (`package.json`).
    2. 3 verification tiers: Tier 1 (Security Scanner, ~0.3s), Tier 2 (Backend Pytest, ~2.6s), Tier 3 (Frontend Build & Prerender, ~20.8s). Total ~23.8s.
    3. Auto-discovers Python venv (`backend/venv/bin/pytest`) and Node environment.
    4. Enforces isolated SQLite in-memory test DB, captures wall-clock duration with `perf_counter`, formats console summary table, and enforces exit code 0 on all pass / non-zero on failure.
- **Unexplored areas**: None for R1 and R4 survey.

## Key Decisions Made
- Recommend Python for both runner (`scripts/run_tests.py`) and scanner (`scripts/security_scanner.py`) due to native subprocess isolation, cross-platform compatibility, zero third-party dependencies, and direct alignment with pytest backend.
- Aliasing runner into `package.json` under `"scripts": { "test": "python3 scripts/run_tests.py" }` provides unified DX for both frontend and backend devs.
- Detailed remediation steps specified for implementer agents to untrack sensitive assets and patch `.gitignore`.

## Artifact Index
- DISPATCH.md — incoming dispatch prompt
- BRIEFING.md — working memory and identity
- progress.md — liveness heartbeat
- handoff.md — 5-component survey and architecture report
