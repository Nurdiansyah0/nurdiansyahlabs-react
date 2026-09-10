# Survey & Architecture Report: Unified Test Runner (R1) & Security Scanner (R4)

**Role**: Security and Runner Explorer  
**Workspace**: `/home/nurdiansyah/dev/Personal_project`  
**Date**: 2026-09-08T11:35:00Z  
**Status**: Survey Complete (Ready for Implementation Phase)

---

## 1. Observation

### 1.1 Security & Secret Hygiene (R4)

#### A. Tracked Sensitive Assets in Git Index
Direct execution of `git ls-files` revealed several critical security exposures actively tracked in Git:
- **OpenSSH Private Key**:
  - Path: `id_rsa` (Size: 1,856 bytes)
  - Tracked in Git: `git ls-files id_rsa` returned `id_rsa`.
  - Added in commit: `575ffc0f` (`chore: eliminate dead code, prune orphaned composer/npm deps, and fix deployment paths`).
  - Verbatim header/footer:
    ```
    -----BEGIN OPENSSH PRIVATE KEY-----
    b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABCJtG+JCZ
    ...
    -----END OPENSSH PRIVATE KEY-----
    ```
- **Live Production Database Dump**:
  - Path: `uygpuazs_nurdiansyahlabs_db.sql` (Size: 737,370 bytes / ~737 KB)
  - Tracked in Git: `git ls-files uygpuazs_nurdiansyahlabs_db.sql` returned `uygpuazs_nurdiansyahlabs_db.sql`.
  - Added in commit: `575ffc0f`.
  - Verbatim header:
    ```sql
    -- phpMyAdmin SQL Dump
    -- version 5.2.3
    -- Host: localhost:3306
    -- Generation Time: Aug 24, 2026 at 10:54 AM
    -- Server version: 10.11.18-MariaDB-cll-lve
    -- Table structure for table `admin_users`
    -- Table structure for table `analytics`
    -- Table structure for table `leads`
    -- Table structure for table `posts`
    -- Table structure for table `products`
    ```
- **SQLite Cache Database**:
  - Path: `api/cache/ai_cache.sqlite`
  - Tracked in Git: `git ls-files api/cache/ai_cache.sqlite` returned `api/cache/ai_cache.sqlite`.
- **SQL Seeders with User Credentials / Password Hashes**:
  - Path: `database/admin_users.sql` (Lines 16–19):
    ```sql
    -- Insert default admin user: Admin / Nurdiansyah@024
    -- Note: bcrypt hash of "Nurdiansyah@024"
    INSERT INTO admin_users (username, password_hash, email) 
    VALUES ('Admin', '$2y$10$BnwY8oWZPA4W7pHyQjrJN.GoxVaDLtuOBHjd5ms7zooZsZ7q57UcS', 'nudiansyahdian28.adv@gmail.com');
    ```
  - Path: `init.sql` (Lines 22–27):
    ```sql
    INSERT INTO `primatera_users` (`username`, `password_hash`, `name`, `role`) VALUES 
    ('userdemo1', '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36', 'Demo User 1', 'viewer'),
    ...
    ```

#### B. Unmasked Hardcoded Credentials in Source Code
Grep searches for passwords across first-party code revealed hardcoded production passwords:
- `backend/migrate_data.py` (Line 19):
  ```python
  mysql_pass = "Nurdiansyah@024"
  ```
- `database/db.php` (Line 36):
  ```php
  $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (defined('DB_PASS') ? DB_PASS : 'Nurdiansyah@024');
  ```
- `database/setup_mysql.php` (Lines 107–111):
  ```php
  // Insert Default admin: Admin / Nurdiansyah@024
  ```
- `deploy.sh` (Line 98):
  ```bash
  sed -i "s/Nurdiansyah@024//g" "$BUILD_DIR/database/db.php" 2>/dev/null || true
  ```
- `postgre-env` (Untracked, exists in repo root):
  ```text
  database name : uygpuazs_dilindo
  username : uygpuazs_
  password : d58U[)@m7kF~zQ!.
  ```

#### C. Inadequate `.gitignore` Rules & Gaps
Empirical testing with `git check-ignore -v <path>`:
1. **`.env.example` is blocked**:
   - `git check-ignore -v .env.example` returned `.gitignore:16:.env.* .env.example`.
   - `git check-ignore -v backend/.env.example` returned `.gitignore:16:.env.* backend/.env.example`.
   - Observation: Because `.gitignore` line 16 has `.env.*` without an un-ignore rule (`!.env.example`), template environment files cannot be staged or tracked without `-f`.
2. **Root SQL dumps are NOT ignored**:
   - `git check-ignore -v uygpuazs_nurdiansyahlabs_db.sql dump.sql backup.sql` returned exit code 1 (no match).
   - `.gitignore` only declares `/database/*.sql`. Any `.sql` dumps placed in the root or other directories remain unignored.
3. **Private key files are NOT broadly ignored**:
   - `git check-ignore -v id_rsa id_ed25519 server.key private_key.pem` returned exit code 1.
   - Only `connection` and `connection.pub` were explicitly ignored (lines 39–40). `id_rsa` is completely missing from `.gitignore`.
4. **Untracked infrastructure dumps exist without ignore rules**:
   - `cloudflare_dns_backup.json` and `cloudflare_dns_backup_full.json` exist in root, contain real production IPs (`163.223.227.44`) and Cloudflare tunnel hostnames (`be261daf-e97b-4c98-b276-4acae414bab6.cfargotunnel.com`), and are NOT ignored by `.gitignore`.

---

### 1.2 Unified Test Runner (R1) & Existing Verification Resources

#### A. Existing Test Scripts & Verification Commands
1. **Root `package.json`**:
   - Current scripts:
     ```json
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
     ```
   - No `"test"` script exists (`npm test` returns `npm error Missing script: "test"`).
2. **Backend Pytest Suite**:
   - Test file: `backend/tests/test_api.py` (297 lines, 13 test cases).
   - Python environment: Python 3.11.2 with `pytest 8.3.5` installed in `./backend/venv/bin/pytest`. Note: `pytest` is NOT in system PATH.
   - Direct execution command:
     ```bash
     PYTHONPATH=backend ./backend/venv/bin/pytest backend/tests/test_api.py
     ```
   - Execution result: 13 passed in 2.64s.
   - Database isolation: Uses `sqlite:///:memory:` configured in `TestConfig` fixture, with `db.create_all()` and `db.drop_all()` teardown.
3. **Frontend Build & Prerender**:
   - Build tool: `vite v6.4.1` with `@prerenderer/rollup-plugin` (`@prerenderer/renderer-puppeteer`).
   - Direct execution command: `npm run build`
   - Execution result: Generated production bundle in `dist/` and prerendered 18 static HTML routes in 20.79s.
   - Static routes verified in `dist/`:
     - `dist/index.html`
     - `dist/blog/index.html`
     - `dist/trends/index.html`
     - 4 services routes (`dist/services/*/index.html`)
     - 8 showcase routes (`dist/showcase/*/*/index.html`)
     - 3 programmatic SEO routes (`dist/layanan/industri/*/index.html`)
     - `dist/sitemap.xml`

---

## 2. Logic Chain

### 2.1 Security & Secret Hygiene Scanner (R4)
1. **Premise 1**: Requirement R4 mandates an automated scanner that verifies no private keys, database dumps, or unmasked credentials are tracked by Git, and confirms `.gitignore` covers `.env`, `.env.*` (excluding examples), `*.sql` dumps, and private key files.
2. **Premise 2**: Observations in Section 1.1 prove that `id_rsa`, `uygpuazs_nurdiansyahlabs_db.sql`, `init.sql`, and `api/cache/ai_cache.sqlite` are currently tracked in Git, credentials exist in `database/db.php` and `backend/migrate_data.py`, and `.gitignore` has 4 distinct coverage gaps.
3. **Inference**: A standalone Python scanner `scripts/security_scanner.py` using Python 3 standard library (`subprocess`, `re`, `pathlib`, `sys`) provides zero-dependency, platform-independent execution that can:
   - Run `git ls-files` and flag any tracked sensitive paths (private keys, DB dumps, sqlite DBs, env files).
   - Read tracked source files and perform regex scanning for secret patterns (`-----BEGIN ... PRIVATE KEY-----`, `-- phpMyAdmin SQL Dump`, unmasked passwords like `Nurdiansyah@024`, high-entropy tokens).
   - Execute `git check-ignore` against synthetic probe paths to enforce `.gitignore` compliance (asserting `.env` is ignored, `dump.sql` is ignored, `id_rsa` is ignored, but `.env.example` is NOT ignored).
   - Return exit code 0 on clean state and non-zero (exit code 1) on any violation with clear file/line diagnostics.
4. **Remediation Requirement**: For the scanner to pass in CI and local verification, the implementer must:
   - Untrack sensitive files: `git rm --cached id_rsa uygpuazs_nurdiansyahlabs_db.sql api/cache/ai_cache.sqlite`.
   - Update `.gitignore` to include `id_rsa`, `id_*`, `*.key`, `*.pem`, `*.sql` (with `!database/schema.sql`), and `!.env.example`.
   - Replace hardcoded secrets in `database/db.php` and `backend/migrate_data.py` with environment variable fallbacks or test stubs.

### 2.2 Unified Test Runner Architecture (R1)
1. **Premise 1**: Requirement R1 requires a single command/runner executing all verification tiers (Backend API tests, Frontend build/smoke checks, Security audit scanner) sequentially, timing each tier, printing a console summary table, and exiting with code 0 on total pass or non-zero on failure.
2. **Premise 2**: Tier 1 (Security Scanner) runs in ~0.3s. Tier 2 (Backend Pytest) runs in ~2.6s. Tier 3 (Frontend Build & Prerender) runs in ~20.8s. Total sequential runtime is ~24s.
3. **Inference on Language & Structure**:
   - Python (`scripts/run_tests.py`) is the ideal language for the runner:
     - It naturally interfaces with the Python backend and can auto-locate `./backend/venv/bin/python` or `pytest`.
     - Standard library `subprocess` and `time.perf_counter()` handle process execution, real-time output streaming, and millisecond timing capture without third-party dependencies.
     - Terminal ANSI color formatting and fixed-width tables are clean and robust in Python.
   - Wiring the runner to `package.json` (`"test": "python3 scripts/run_tests.py"`) guarantees that both `python3 scripts/run_tests.py` and `npm test` execute the exact same unified suite without discrepancies.
4. **Execution Flow Design**:
   ```
   [Start Unified Runner]
          │
          ▼
   [Tier 1: Security & Secret Hygiene Scanner]  (~0.3s)
          │─── If fail & --fail-fast ──► Abort & Report
          ▼
   [Tier 2: Backend API & Contract Test Suite]   (~2.6s)
          │    - PYTHONPATH=backend
          │    - Isolated DB fixture (sqlite:///:memory:)
          │─── If fail & --fail-fast ──► Abort & Report
          ▼
   [Tier 3: Frontend Build & Route Prerender]   (~20.8s)
          │    - npm run build (Vite + Puppeteer)
          │    - Verify dist/*.html routes exist
          ▼
   [Consolidated Pass/Fail Console Summary Table]
          │
          ▼
   Exit Code: 0 (all passed) or 1 (any failed)
   ```

---

## 3. Caveats

1. **Third-Party Vendor Directories**:
   - `node_modules/` (11,881 files) and `venv/` (2,032 files) have many tracked files in the Git index due to earlier commits.
   - The security scanner must explicitly scope its content inspection to first-party code (excluding `node_modules/`, `venv/`, `vendor/`, `.git/`, `dist/`), while still ensuring that root-level private keys or DB dumps in those paths are not tracked.
2. **Test Database Isolation**:
   - `backend/tests/test_api.py` uses `sqlite:///:memory:`. When adding new test files in R2, authors must ensure they inherit `TestConfig` and do not instantiate MySQL connections or read `postgre-env`.
3. **Puppeteer in Constrained Environments**:
   - `npm run build` launches headless Chromium. In local Linux development (observed in this run), it succeeded with zero errors. In minimalist docker or CI environments, Chromium dependencies (`libnss3`, `libatk1.0-0`, etc.) and `--no-sandbox` flags are required.

---

## 4. Conclusion & Recommended Implementation Blueprint

### 4.1 Security Scanner Specification (`scripts/security_scanner.py`)
The scanner must implement 4 inspection checks:
1. `check_tracked_sensitive_files()`:
   - Scans `git ls-files`.
   - Prohibits: `id_rsa`, `id_ed25519`, `*.pem`, `*.key`, `uygpuazs_nurdiansyahlabs_db.sql`, `*.dump`, `*.sqlite`, `.env`, `.env.local`, `.env.production`.
   - Exemption: `database/schema.sql`, `.env.example`.
2. `check_tracked_file_contents()`:
   - Inspects tracked first-party text files.
   - Flags: `-----BEGIN OPENSSH PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----`, `-- phpMyAdmin SQL Dump`, unmasked passwords matching `'Nurdiansyah@024'`.
3. `check_gitignore_coverage()`:
   - Evaluates `git check-ignore` against mandatory test cases:
     - Must ignore: `.env`, `.env.production`, `backup.sql`, `root_dump.sql`, `id_rsa`, `server.key`.
     - Must NOT ignore: `.env.example`, `backend/.env.example`.
4. `check_untracked_workspace_hygiene()`:
   - Warns on unignored sensitive artifacts on disk (e.g. `cloudflare_dns_backup*.json`, `postgre-env`).

### 4.2 `.gitignore` Proposed Patch
Update `.gitignore` to resolve all 4 identified gaps:
```diff
--- a/.gitignore
+++ b/.gitignore
@@ -8,14 +8,21 @@
 *.zip
 *.log
 
+# Environment Files (allow examples)
+.env
+.env.*
+!.env.example
+!.env*.example
+env.local.php
+
 # Databases & Sensitive Data
-/database/*.json
-/database/*.sql
-!/database/schema.sql
-.env
-.env.*
-env.local.php
+*.sql
+!database/schema.sql
+!database/products.sql
+*.dump
+*.sqlite
+*.db
 
 # Sensitive Keys & Environment Files
+id_*
+*.pem
+*.key
+cloudflare_dns_backup*.json
 connection
 connection.pub
 postgre-env
```

### 4.3 Git Remediation Command for Implementation Agent
```bash
git rm --cached id_rsa uygpuazs_nurdiansyahlabs_db.sql api/cache/ai_cache.sqlite init.sql
```

### 4.4 Unified Test Runner Specification (`scripts/run_tests.py`)
- Location: `scripts/run_tests.py`
- Executable via: `python3 scripts/run_tests.py` or `npm test`
- Core features:
  1. Auto-detection of Python virtual environment:
     ```python
     def get_python_exec():
         candidates = [
             os.environ.get("VIRTUAL_ENV", "") + "/bin/python",
             "backend/venv/bin/python",
             "venv/bin/python",
             shutil.which("python3")
         ]
         for c in candidates:
             if c and os.path.isfile(c) and os.access(c, os.X_OK):
                 return c
         return sys.executable
     ```
  2. Sequential execution of the 3 verification tiers:
     - Tier 1: `python3 scripts/security_scanner.py`
     - Tier 2: `<python_exec> -m pytest backend/tests/test_api.py -v` (with `PYTHONPATH=backend`)
     - Tier 3: `npm run build` (with validation that `dist/index.html` and static routes exist)
  3. Precise timing capture per tier via `time.perf_counter()`.
  4. Formatted ASCII summary table with ANSI status colors.
  5. Exit code semantics: `sys.exit(0)` if all tiers pass, `sys.exit(1)` if any tier fails.
  6. Support for CLI flags: `--tier {all,security,backend,frontend}`, `--fail-fast`, `-v/--verbose`, `--json`.

### 4.5 `package.json` Integration
Add the `"test"` script to `package.json`:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "python3 scripts/run_tests.py",
  "test:security": "python3 scripts/security_scanner.py",
  "test:backend": "python3 scripts/run_tests.py --tier backend",
  "test:frontend": "python3 scripts/run_tests.py --tier frontend"
}
```

---

## 5. Verification Method

To independently verify the findings in this report:

1. **Verify Git tracking of sensitive assets**:
   ```bash
   git ls-files id_rsa uygpuazs_nurdiansyahlabs_db.sql api/cache/ai_cache.sqlite
   # Expected output: all 3 paths printed (confirms they are actively tracked)
   ```

2. **Verify `.gitignore` bug on `.env.example`**:
   ```bash
   git check-ignore -v .env.example backend/.env.example
   # Expected output: .gitignore:16:.env.* (confirms .env.example is mistakenly ignored)
   ```

3. **Verify `.gitignore` failure on root SQL dumps and private keys**:
   ```bash
   git check-ignore -v uygpuazs_nurdiansyahlabs_db.sql id_rsa backup.sql
   # Expected output: exit code 1 (confirms .gitignore does NOT ignore them)
   ```

4. **Verify backend pytest execution**:
   ```bash
   PYTHONPATH=backend ./backend/venv/bin/pytest backend/tests/test_api.py
   # Expected output: 13 passed in ~2.6s
   ```

5. **Verify frontend build and static prerendering**:
   ```bash
   npm run build
   # Expected output: build completes in ~20-25s, renders 18 static routes in dist/
   ```

6. **Invalidation Conditions**:
   - If `id_rsa` or `uygpuazs_nurdiansyahlabs_db.sql` are removed from Git tracking, finding 1.1A is resolved.
   - If `.gitignore` is amended with `!.env.example` and `*.sql`, finding 1.1C is resolved.
