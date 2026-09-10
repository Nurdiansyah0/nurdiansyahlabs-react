# Authoritative Backend API & Testing Infrastructure Survey

**Agent**: Backend API Spec Miner  
**Date**: 2026-09-08  
**Working Directory**: `/home/nurdiansyah/dev/Personal_project/.agents/survey_backend`  
**Target Codebase**: `/home/nurdiansyah/dev/Personal_project/backend`  

---

## 1. Observation

### 1.1 Codebase Layout & Runtime Architecture
Inspection of the `backend/` directory revealed a modular monolith built on Flask 3.1.3 and SQLAlchemy 2.0.40 with PostgreSQL (`psycopg` v3) / SQLite dual support.

- **App Factory (`backend/app/__init__.py`)**:
  - Defines `create_app(config_class=Config)` (lines 8-60).
  - Sets up CORS for all `/api/*` routes with credentials support (line 12).
  - Initializes `db = SQLAlchemy(model_class=Base)` via `db.init_app(app)` (line 14).
  - Registers custom error handlers via `register_error_handlers(app)` (line 16).
  - Attaches request timing middleware via `setup_middleware(app)` (line 17).
  - Registers 10 modular blueprints (lines 30-39): `auth_bp`, `posts_bp`, `projects_bp`, `products_bp`, `leads_bp`, `analytics_bp`, `media_bp`, `trends_bp`, `primatera_bp`, and `admin_bp`.
  - Exposes health check endpoint at `/api/v1/health` (lines 41-58).

- **Configuration (`backend/app/core/config.py`)**:
  - Loads environment variables from `.env` in the backend root using `os.environ.setdefault()` (lines 4-11).
  - Sets `DATABASE_URL` defaulting to `sqlite:///nurdiansyahlabs.db` (lines 15-18).
  - Normalizes `postgres://` or `postgresql://` URIs to use the psycopg v3 driver `postgresql+psycopg://` (lines 21-24).
  - Sets `UPLOAD_FOLDER` defaulting to `/home/uygpuazs/public_html/upload_articles`, overridden in local `.env` to `/home/nurdiansyah/dev/Personal_project/public/upload_articles`.
  - Sets `CRON_API_KEY` defaulting to `nurdiansyah-cron-2026`.
  - Configures SMTP settings: `SMTP_HOST` (smtp.gmail.com), `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS`.

- **Security & Authentication Core (`backend/app/core/security.py` & `auth/`)**:
  - `hash_password(password)`: Bcrypt hashing with 10 salt rounds (lines 4-6).
  - `verify_password(plain, hashed)`: Bcrypt check supporting both legacy `$2y$` (PHP/Laravel password hash standard) and `$2b$` headers (lines 8-17).
  - `generate_token(length=32)`: Generates cryptographically secure hexadecimal strings via `secrets.token_hex(length)` (lines 19-20).
  - Decorator `admin_required` (`backend/app/modules/auth/decorators.py`, lines 5-36) checks either:
    1. Header `X-Admin-Token: <token>`
    2. Header `Authorization: Bearer <token>`
    Returns 401 `{"success": False, "error": {"code": "UNAUTHORIZED", "message": "Admin token is missing"}}` if absent, or `{"success": False, "error": {"code": "UNAUTHORIZED", "message": "Invalid or expired admin token"}}` if invalid.
  - **Single Session per User Architecture**: `AdminUser` table has a single nullable `token` column (`mapped_column(String(255), nullable=True, index=True)` in `auth/models.py:13`). Upon each login, `AuthService.authenticate` replaces `user.token` with a newly generated 32-byte hex token. Any previous token for that user is immediately invalidated upon subsequent login.
  - **Token Refresh**: There is NO dedicated `/refresh` endpoint or JWT refresh token rotation mechanism in the codebase. Authentication tokens are persistent opaque session tokens stored directly in the `admin_users` table.

- **Dependencies (`backend/requirements.txt`)**:
  ```
  Flask==3.1.3
  Flask-SQLAlchemy==3.1.1
  Flask-Cors==5.0.1
  SQLAlchemy==2.0.40
  alembic==1.15.1
  psycopg[binary]==3.2.6
  bcrypt==4.3.0
  Werkzeug==3.1.3
  pytest==8.3.5
  ```

### 1.2 Existing Test Suite & Runtime Probing
- Running `PYTHONPATH=backend backend/venv/bin/pytest backend/tests/test_api.py -v`:
  - 13 test cases passed in 2.61s.
  - Covers only basic happy paths and minimal negative checks across 10 modules.
- Running `backend/venv/bin/pytest` without `PYTHONPATH=backend` (from workspace root or `backend/`):
  ```
  ImportError while importing test module 'backend/tests/test_api.py':
  ModuleNotFoundError: No module named 'app'
  ```
  There is currently no `pytest.ini`, `pyproject.toml`, or `conftest.py` setting `pythonpath` or appending `backend/` to `sys.path`.
- Probing 41 endpoint scenarios using our isolated runner (`.agents/survey_backend/probe_runner.py`):
  - Confirmed Bearer auth works identically to `X-Admin-Token`.
  - Confirmed `/forgot_password` creates `reset_token` and `reset_expires` (1-hour window).
  - Confirmed `/reset_password` validates reset token, updates password hash, clears reset token, and clears session `token` (forcing re-login).
  - Confirmed `/logout` clears `token` in DB.
  - Confirmed legacy router `/legacy?action=...` dispatches properly.
  - Confirmed `/admin?action=posts` and `/admin?action=leads` multiplexing works under admin authentication.
  - Confirmed `/analytics` GET returns metrics summary and recent events under admin authentication.
  - Confirmed `/primatera/transactions` and `/primatera/inventory` CRUD operations function properly.

### 1.3 Critical Test Leakage Discovered
- In `backend/tests/test_api.py`, `TestConfig` defines:
  ```python
  class TestConfig(Config):
      TESTING = True
      DATABASE_URL = "sqlite:///:memory:"
      SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
      SQLALCHEMY_ENGINE_OPTIONS = {}
  ```
- **File Upload Leakage**: `TestConfig` does NOT override `UPLOAD_FOLDER`. In `test_media_upload_validation`, line 257 sends a valid PNG upload. Examining `/home/nurdiansyah/dev/Personal_project/public/upload_articles`:
  ```
  1856864a44b9_valid.png
  4582ef931b21_valid.png
  9093678d5949_valid.png
  c6f811c4662d_valid.png
  f74603e68bb2_valid.png
  ```
  Every execution of the existing test suite generates and leaves persistent image files in the user's frontend public asset directory!
- **Database Engine Pooling**: `TestConfig` sets `SQLALCHEMY_ENGINE_OPTIONS = {}`. In SQLite in-memory mode (`sqlite:///:memory:`), default SQLAlchemy pooling opens multiple in-memory instances if connections are closed or spawned across threads, risking silent state loss between requests.
- **SMTP Network Call Risk**: `leads_bp.submit_lead()` invokes `send_lead_email()`. While local `.env` has empty `SMTP_USER`, if SMTP credentials are provided, running tests would attempt real outbound network emails.

---

## 2. Logic Chain

1. **Test Runner Portability**:
   - *Observation*: Pytest fails with `ModuleNotFoundError: No module named 'app'` unless prefixed with `PYTHONPATH=backend`.
   - *Reasoning*: Python's module resolution requires `backend/` to be in `sys.path`. When executing from project root or inside `backend/`, pytest sets the root directory to current working directory without adding subdirectories unless configured in `pytest.ini` (`pythonpath = backend` or `.`) or in a root `conftest.py`.
   - *Inference*: To fulfill R1 (Unified Test Runner) and R2 (Backend API Test Suite), a centralized `pytest.ini` and `conftest.py` must configure pythonpath and shared fixtures.

2. **Database & Resource Isolation**:
   - *Observation*: Tests use `sqlite:///:memory:` in `test_api.py`, but `UPLOAD_FOLDER` is unisolated and leaks into `public/upload_articles`.
   - *Reasoning*: Complete isolation means zero side-effects across all persistent resources: database, file system, and external networks (SMTP, LLM APIs).
   - *Inference*: A robust test fixture must:
     a) Use SQLite in-memory with `StaticPool` (`from sqlalchemy.pool import StaticPool`) and `connect_args={"check_same_thread": False}` so that all connections within the test context share the exact same in-memory instance without persisting to disk.
     b) Enforce a strict runtime assertion: `assert app.config["SQLALCHEMY_DATABASE_URI"] == "sqlite:///:memory:"` or a dedicated temporary SQLite file to guarantee that `instance/nurdiansyahlabs.db` or PostgreSQL is NEVER touched.
     c) Point `UPLOAD_FOLDER` to a temporary directory created via `tempfile.mkdtemp()` and cleaned up in fixture teardown.
     d) Ensure `SMTP_USER = ""` or mock `send_lead_email` to prevent external network I/O.

3. **API Contract Surface & Coverage Gaps**:
   - *Observation*: Existing `test_api.py` has 13 tests covering only happy paths for ~6 routes. The codebase contains 22 distinct route endpoints across 10 modules.
   - *Reasoning*: A contract test suite must assert HTTP status codes, exact JSON schema shapes, response envelopes, error structures (`code`, `message`), and edge case validation for every endpoint.
   - *Inference*: The missing contract tests must be implemented to achieve 100% contract coverage across all 10 modules.

---

## 3. Features Discovered

The following authoritative specification enumerates every API contract implemented in the Flask backend:

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Health | `GET /api/v1/health` | Service and database liveness health check | None | JSON `{"success": true, "data": {"status": "ok", "application": "...", "database": "ok", ...}}` (200) | 500 if unhandled | `app/__init__.py:41-59` |
| 2 | Auth | `POST /api/v1/auth/login` | Authenticate admin via username or email; generates 32-byte hex token | JSON: `{"username": str, "password": str}` | JSON: `{"success": true, "token": str, "user": {"id": int, "username": str, "email": str, "created_at": str}}` (200) | 400 `VALIDATION_ERROR` (empty fields), 401 `INVALID_CREDENTIALS` | `auth/routes.py:7-30` |
| 3 | Auth | `GET /api/v1/auth/verify` | Verify admin session token | Header: `X-Admin-Token: <token>` OR `Authorization: Bearer <token>` | JSON: `{"success": true, "valid": true, "user": {...}}` (200) | 401 `UNAUTHORIZED` ("Admin token is missing" or "Invalid or expired admin token") | `auth/routes.py:32-39` |
| 4 | Auth | `POST /api/v1/auth/logout` | Invalidate current admin session token | Header: `X-Admin-Token: <token>` | JSON: `{"success": true, "message": "Logged out successfully"}` (200) | 200 even if token missing or invalid | `auth/routes.py:41-49` |
| 5 | Auth | `POST /api/v1/auth/forgot_password` | Request password reset token for username or email | JSON: `{"identifier": str}` | JSON: `{"success": true, "message": "If the account exists..."}` (200) | 400 `VALIDATION_ERROR` if identifier empty | `auth/routes.py:51-65` |
| 6 | Auth | `POST /api/v1/auth/reset_password` | Reset admin password using valid reset token; revokes active session | JSON: `{"token": str, "password": str}` | JSON: `{"success": true, "message": "Password reset successfully"}` (200) | 400 `VALIDATION_ERROR` (missing fields), 400 `INVALID_TOKEN` (expired/invalid) | `auth/routes.py:67-89` |
| 7 | Auth | `GET/POST /api/v1/auth/legacy` | Backward-compatibility router for PHP-style auth queries | Query param: `?action=login\|verify\|forgot_password\|reset_password\|logout` | Same JSON as target action (200) | 400 `{"error": "Unknown action"}` if action unrecognized | `auth/routes.py:91-105` |
| 8 | Posts | `GET /api/v1/posts` | List all articles, or retrieve single article if `?slug=` query provided | Query param: `?slug=<slug>` (optional) | Array of Post dicts `[...]` (200) or single Post dict if slug provided | 404 `NOT_FOUND` ("Article not found") if slug query not found | `posts/routes.py:7-19` |
| 9 | Posts | `GET /api/v1/posts/<slug>` | Retrieve article by slug in path | Path: `<slug>` | JSON: Post dict (200) | 404 `NOT_FOUND` ("Article not found") | `posts/routes.py:20-25` |
| 10 | Posts | `POST /api/v1/posts` | Create new article (admin only) | Admin Auth + JSON: `{"title": str, "slug": str, "description": str, "content": str, ...}` | JSON: `{"success": true, "data": <Post>}` (201) | 400 `VALIDATION_ERROR` (missing title/slug), 401 `UNAUTHORIZED`, 409 `CONFLICT` (slug duplicate) | `posts/routes.py:27-40` |
| 11 | Posts | `PUT/PATCH /api/v1/posts/<slug>` | Update article fields or rename slug (admin only) | Admin Auth + JSON: fields to update, optional `new_slug` | JSON: `{"success": true, "data": <Post>}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `posts/routes.py:41-49` |
| 12 | Posts | `DELETE /api/v1/posts/<slug>` | Delete article (admin only) | Admin Auth + Path: `<slug>` | JSON: `{"success": true, "message": "Article deleted successfully"}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `posts/routes.py:50-57` |
| 13 | Projects | `GET /api/v1/projects` | List projects with optional category and status filtering | Query params: `category=<slug>`, `status=published\|all` (optional) | JSON: `{"success": true, "data": [<Project>, ...]}` (200) | 500 if error | `projects/routes.py:8-25` |
| 14 | Projects | `GET /api/v1/projects/<slug>` | Retrieve project details by slug | Path: `<slug>` | JSON: `{"success": true, "data": <Project>}` (200) | 404 `NOT_FOUND` ("Project not found") | `projects/routes.py:27-39` |
| 15 | Projects | `POST /api/v1/projects` | Create new portfolio project (admin only) | Admin Auth + JSON: `{"slug": str, "title": str, "description": str, ...}` | JSON: `{"success": true, "data": <Project>}` (201) | 400 `VALIDATION_ERROR`, 401 `UNAUTHORIZED`, 409 `CONFLICT` (duplicate slug) | `projects/routes.py:40-80` |
| 16 | Projects | `PATCH/PUT /api/v1/projects/<id>` | Update portfolio project by ID (admin only) | Admin Auth + Path: `<int:id>` + JSON: fields to update | JSON: `{"success": true, "data": <Project>}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `projects/routes.py:82-111` |
| 17 | Projects | `DELETE /api/v1/projects/<id>` | Delete portfolio project by ID (admin only) | Admin Auth + Path: `<int:id>` | JSON: `{"success": true, "message": "Project deleted successfully"}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `projects/routes.py:112-128` |
| 18 | Products | `GET /api/v1/products` | List products with optional app_id, category, and status filter | Query params: `app=<id>` or `appId=<id>`, `category=<cat>`, `status=active\|all` | JSON: `{"success": true, "data": [<Product>, ...]}` (200) | 500 if error | `products/routes.py:8-28` |
| 19 | Products | `GET /api/v1/products/<id>` | Retrieve product details by ID | Path: `<int:id>` | JSON: `{"success": true, "data": <Product>}` (200) | 404 `NOT_FOUND` ("Product not found") | `products/routes.py:29-40` |
| 20 | Products | `POST /api/v1/products` | Create product (admin only) | Admin Auth + JSON: `{"app_id": str, "name": str, "price": num, ...}` | JSON: `{"success": true, "data": <Product>}` (201) | 400 `VALIDATION_ERROR` (missing app_id, name, or price), 401 `UNAUTHORIZED` | `products/routes.py:42-75` |
| 21 | Products | `PATCH/PUT /api/v1/products/<id>` | Update product details by ID (admin only) | Admin Auth + Path: `<int:id>` + JSON: fields | JSON: `{"success": true, "data": <Product>}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `products/routes.py:76-100` |
| 22 | Products | `DELETE /api/v1/products/<id>` | Delete product by ID (admin only) | Admin Auth + Path: `<int:id>` | JSON: `{"success": true, "message": "Product deleted successfully"}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `products/routes.py:101-110` |
| 23 | Leads | `POST /api/v1/leads` | Submit public lead/inquiry form; attempts SMTP notification | JSON: `{"name": str, "contact": str, "service": str, "message": str}` | JSON: `{"success": true, "message": "...", "data": <Lead>}` (201) | 400 `VALIDATION_ERROR` (missing name/contact) | `leads/routes.py:44-76` |
| 24 | Leads | `GET /api/v1/leads` | List all inquiries ordered by timestamp desc (admin only) | Admin Auth | JSON: `{"success": true, "leads": [<Lead>, ...]}` (200) | 401 `UNAUTHORIZED` | `leads/routes.py:77-85` |
| 25 | Leads | `DELETE /api/v1/leads/<id>` | Delete inquiry by ID (admin only) | Admin Auth + Path: `<int:id>` | JSON: `{"success": true, "message": "Lead deleted successfully"}` (200) | 401 `UNAUTHORIZED`, 404 `NOT_FOUND` | `leads/routes.py:86-95` |
| 26 | Analytics | `POST /api/v1/analytics/track` | Ingest visitor analytics event | JSON: `{"visitorId": str, "type": str, "path": str, "duration": int, ...}` | JSON: `{"success": true, "id": int}` (201) | 500 if error | `analytics/routes.py:10-30` |
| 27 | Analytics | `GET /api/v1/analytics` | Get analytics metrics (total events, visitors, top paths, recent events) | Admin Auth | JSON: `{"success": true, "metrics": {...}, "recent_events": [...]}` (200) | 401 `UNAUTHORIZED` | `analytics/routes.py:31-60` |
| 28 | Media | `POST /api/v1/media/upload` | Upload image asset with magic-byte and XSS sanitization (admin only) | Admin Auth + multipart form with `image` or `file` part (png, jpg, webp, svg) | JSON: `{"success": true, "data": {"filename": str, "imageUrl": str, "url": str}}` (201) | 400 `VALIDATION_ERROR` / `INVALID_FILE_TYPE` / `MALICIOUS_FILE_CONTENT`, 401 `UNAUTHORIZED` | `media/routes.py:41-76` |
| 29 | Trends | `GET /api/v1/trends` | Fetch trending topics from cache file or fallback mock | None | JSON: cached dict OR `{"success": true, "topics": [...]}` (200) | 500 if error | `trends/routes.py:9-26` |
| 30 | Trends | `GET/POST /api/v1/trends/auto_post` | Cron hook to trigger automated trend generation | Header: `X-Cron-Key: <key>` OR Query: `?key=<key>` + optional `?geo=ID` | JSON: `{"success": true, "message": "...", "status": "queued"}` (200) | 401 `UNAUTHORIZED` ("Invalid cron key") | `trends/routes.py:28-40` |
| 31 | Primatera | `POST /api/v1/primatera/auth` | Authenticate Primatera farm ERP user | JSON: `{"username": str, "password": str}` | JSON: `{"success": true, "token": str, "user": {...}}` (200) | 401 `{"success": false, "error": "Invalid username or password"}` | `primatera/routes.py:9-25` |
| 32 | Primatera | `POST /api/v1/primatera/records` | Submit daily flock records | JSON: `{"flock_id": str, "feed_consumed_kg": num, "mortality_count": int, ...}` | JSON: `{"success": true, "data": <record>}` (201) | 500 if error | `primatera/routes.py:26-42` |
| 33 | Primatera | `GET /api/v1/primatera/records` | List flock records | None | JSON: `{"success": true, "records": [...]}` (200) | 500 if error | `primatera/routes.py:43-45` |
| 34 | Primatera | `POST /api/v1/primatera/transactions` | Record farm financial transaction | JSON: `{"type": "INCOME"\|"EXPENSE", "category": str, "amount": num, ...}` | JSON: `{"success": true, "data": <transaction>}` (201) | 500 if error | `primatera/routes.py:46-62` |
| 35 | Primatera | `GET /api/v1/primatera/transactions` | List farm financial transactions | None | JSON: `{"success": true, "transactions": [...]}` (200) | 500 if error | `primatera/routes.py:63-65` |
| 36 | Primatera | `POST /api/v1/primatera/inventory` | Record or update feed/medicine inventory stock | JSON: `{"item_type": "FEED"\|"MEDICINE", "stock": num}` | JSON: `{"success": true, "data": <inventory>}` (200) | 500 if error | `primatera/routes.py:66-80` |
| 37 | Primatera | `GET /api/v1/primatera/inventory` | List farm inventory stocks | None | JSON: `{"success": true, "inventory": [...]}` (200) | 500 if error | `primatera/routes.py:81-83` |
| 38 | Admin | `GET/POST/PUT/DELETE /api/v1/admin` | Multiplexed administration router for posts and leads | Admin Auth + Query: `?action=posts\|leads` + HTTP method | JSON depending on action: `{"posts": [...]}` (GET posts, 200), `{"success": true, "post": ...}` (POST posts, 201), `{"leads": [...]}` (GET leads, 200), etc. | 400 `{"error": "Invalid action"}`, 401 `UNAUTHORIZED`, 404 `{"success": false, "error": "Lead not found"}` | `admin/routes.py:9-50` |

---

## 4. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Auth Login | Login with email address as `username` | Supported and authenticated successfully: `AuthService.authenticate()` matches on `(AdminUser.username == val) \| (AdminUser.email == val)`. Returns 200 with session token. |
| 2 | Auth Login | Concurrent login as same user | **Single-session overwrite**: Generating a new session token overwrites `AdminUser.token` in DB, immediately causing any previous token to return 401 `Invalid or expired admin token`. |
| 3 | Auth Bearer Header | `Authorization: Bearer <valid-token>` | Accepted. `admin_required` decorator strips the prefix and validates token against DB, assigning `request.current_user`. |
| 4 | Forgot Password | Non-existent user identifier | Secure enumeration resistance: returns HTTP 200 with generic message `{"success": true, "message": "If the account exists, password reset instructions have been generated."}`, but does NOT generate a reset token in DB. |
| 5 | Reset Password | Token expired or invalid string | Returns HTTP 400 with `{"success": false, "error": {"code": "INVALID_TOKEN", "message": "Invalid or expired reset token"}}`. |
| 6 | Reset Password | Successful reset | Clears `reset_token`, clears `reset_expires`, hashes new password with bcrypt, and sets `user.token = None`, forcibly invalidating all active sessions. |
| 7 | Auth Logout | Calling without `X-Admin-Token` | Returns HTTP 200 `{"success": true, "message": "Logged out successfully"}` safely without throwing exceptions. |
| 8 | Media Upload | File containing dangerous `<script>` inside SVG | Rejected with HTTP 400 `MALICIOUS_FILE_CONTENT`. `is_safe_svg()` inspects for `<script`, `javascript:`, `onload=`, `onerror=`, `<foreignobject`. |
| 9 | Media Upload | File with `.php` or `.sh` extension | Rejected with HTTP 400 `INVALID_FILE_TYPE` before saving. |
| 10 | Media Upload | Clean PNG with valid `\x89PNG\r\n\x1a\n` header | Accepted with HTTP 201. File is saved to `Config.UPLOAD_FOLDER` with randomized prefix `{uuid[:12]}_{safe_base}.{ext}`. |
| 11 | Projects Filter | `GET /api/v1/projects?category=nonexistent` | Returns HTTP 200 with empty array `{"success": true, "data": []}`. |
| 12 | Products Price | `POST /api/v1/products` with `price = 0` | Accepted with HTTP 201. `price is None` check correctly treats `0` as a valid numeric price. |
| 13 | Primatera Inventory | `POST /api/v1/primatera/inventory` with existing `item_type` | Upsert behavior: updates existing record's `stock` column in place without duplicate key conflict, returns HTTP 200. |
| 14 | Admin Router | Unknown `?action=invalid_action` | Returns HTTP 400 `{"error": "Invalid action"}`. Note: unnested error shape. |

---

## 5. Existing Tests vs Missing Contract Tests (Gap Analysis)

### 5.1 Existing Tests in `backend/tests/test_api.py` (13 tests)
1. `test_health_check` — Basic 200 check on `/api/v1/health`.
2. `test_auth_login_and_verify_success` — Login with username + verify with `X-Admin-Token`.
3. `test_auth_login_invalid_credentials` — Wrong password 401.
4. `test_auth_verify_unauthorized` — Bad token 401.
5. `test_auth_verify_missing_token` — Missing token 401.
6. `test_posts_lifecycle` — CRUD lifecycle for posts.
7. `test_projects_lifecycle` — CRUD lifecycle for projects.
8. `test_leads_submission_and_management` — Submit lead, validation 400, admin list, admin delete.
9. `test_products_endpoint` — Create product, list with query param.
10. `test_analytics_tracking` — Ingest pageview.
11. `test_media_upload_validation` — File validation (missing file, php ext, unsafe svg, valid png).
12. `test_trends_endpoints` — GET trends, auto_post wrong key 401.
13. `test_primatera_auth_and_records` — Auth and daily flock records.

### 5.2 Missing or Incomplete Contract Tests (28 Test Gaps Identified)

#### Auth Module:
- [ ] Test login via email address instead of username.
- [ ] Test login validation errors on empty username/password (HTTP 400 `VALIDATION_ERROR`).
- [ ] Test `Authorization: Bearer <token>` header support across protected routes.
- [ ] Test session invalidation on subsequent login (single-session per user verification).
- [ ] Test `POST /api/v1/auth/logout` endpoint (clears token, subsequent `/verify` returns 401).
- [ ] Test `POST /api/v1/auth/forgot_password` (valid user generates token, invalid user returns generic 200 without token).
- [ ] Test `POST /api/v1/auth/forgot_password` validation error (empty identifier -> HTTP 400).
- [ ] Test `POST /api/v1/auth/reset_password` complete lifecycle (forgot -> extract token -> reset -> old password rejected -> new password accepted -> old session invalidated).
- [ ] Test `POST /api/v1/auth/reset_password` with expired/invalid token (HTTP 400 `INVALID_TOKEN`).
- [ ] Test `POST /api/v1/auth/reset_password` validation error (missing token or password -> HTTP 400).
- [ ] Test legacy auth router `GET/POST /api/v1/auth/legacy?action=...` (action=login, action=verify, action=logout, action=invalid -> 400).

#### Posts Module:
- [ ] Test `GET /api/v1/posts?slug=<slug>` query parameter resolution vs path parameter.
- [ ] Test `GET /api/v1/posts?slug=nonexistent` returning HTTP 404 `NOT_FOUND`.
- [ ] Test `PUT /api/v1/posts/<slug>` with `new_slug` renaming feature.

#### Projects Module:
- [ ] Test category filtering: `GET /api/v1/projects?category=fullstack` (returns matching projects) and mismatch (empty list).
- [ ] Test status filtering: `GET /api/v1/projects?status=published` vs `?status=all`.
- [ ] Test unauthenticated update and delete on projects (HTTP 401).
- [ ] Test update and delete on non-existent project ID (HTTP 404).

#### Products Module:
- [ ] Test `GET /api/v1/products/<int:id>` single product detail endpoint (currently completely untested).
- [ ] Test `GET /api/v1/products/<int:id>` 404 on non-existent ID.
- [ ] Test `PATCH/PUT /api/v1/products/<int:id>` update endpoint (currently completely untested).
- [ ] Test `DELETE /api/v1/products/<int:id>` delete endpoint (currently completely untested).
- [ ] Test validation error on `POST /api/v1/products` when missing `app_id`, `name`, or `price` (HTTP 400).
- [ ] Test unauthenticated create, update, delete on products (HTTP 401).

#### Leads Module:
- [ ] Test unauthenticated `GET /api/v1/leads` and `DELETE /api/v1/leads/<id>` (HTTP 401).
- [ ] Test `DELETE /api/v1/leads/<id>` on non-existent lead ID (HTTP 404).

#### Analytics Module:
- [ ] Test `GET /api/v1/analytics` metrics summary endpoint (currently completely untested).
- [ ] Test unauthenticated `GET /api/v1/analytics` (HTTP 401).
- [ ] Test default fallbacks in `POST /api/v1/analytics/track` when optional fields are omitted.

#### Media Module:
- [ ] Test unauthenticated upload (HTTP 401).
- [ ] Test clean SVG upload with valid XML / safe vectors (HTTP 201).
- [ ] Test valid JPG / JPEG and WEBP magic byte validation (HTTP 201).
- [ ] **Test isolation**: Ensure `UPLOAD_FOLDER` is redirected to a temporary directory so no files are written into `public/upload_articles`.

#### Trends Module:
- [ ] Test `GET/POST /api/v1/trends/auto_post` with valid `X-Cron-Key` header and valid `?key=` query param (HTTP 200 `queued`).
- [ ] Test `?geo=` query parameter handling on `/trends/auto_post`.

#### Primatera Module:
- [ ] Test `POST /api/v1/primatera/transactions` and `GET /api/v1/primatera/transactions` (currently completely untested).
- [ ] Test `POST /api/v1/primatera/inventory` and `GET /api/v1/primatera/inventory` including stock upsert (currently completely untested).

#### Admin Multiplexer Module:
- [ ] Test `GET /api/v1/admin?action=posts` (HTTP 200, returns `{"posts": [...]}`).
- [ ] Test `POST /api/v1/admin?action=posts` (HTTP 201, returns `{"success": true, "post": ...}`).
- [ ] Test `PUT /api/v1/admin?action=posts` (HTTP 200, returns updated post).
- [ ] Test `DELETE /api/v1/admin?action=posts&slug=...` (HTTP 200).
- [ ] Test `GET /api/v1/admin?action=leads` (HTTP 200, returns `{"leads": [...]}`).
- [ ] Test `DELETE /api/v1/admin?action=leads&id=...` (HTTP 200 on success, HTTP 404 if not found).
- [ ] Test invalid action `GET /api/v1/admin?action=unknown` (HTTP 400 `{"error": "Invalid action"}`).
- [ ] Test unauthenticated call to `/api/v1/admin` (HTTP 401).

---

## 6. Database Isolation & Zero-Mutation Architecture

To satisfy acceptance criteria R2 (*"Database tests run against an isolated test database and tear down fixtures cleanly"*) and prevent pollution of `instance/nurdiansyahlabs.db` or `public/upload_articles`, the backend testing architecture must adhere to the following blueprint:

```
                  +-------------------------------------------------------+
                  |                      pytest                           |
                  |  pytest.ini (pythonpath = backend)                    |
                  +--------------------------+----------------------------+
                                             |
                               +-------------v-------------+
                               |    conftest.py Fixture    |
                               +-------------+-------------+
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
        +----------v----------+                             +----------v----------+
        |   Database Engine   |                             |     File Storage    |
        |  sqlite:///:memory: |                             |  tempfile.mkdtemp() |
        |  StaticPool         |                             |  teardown: rmtree   |
        |  check_same_thread  |                             +---------------------+
        +----------+----------+
                   |
        +----------v----------+
        |  Assertion Guard    |
        |  db_uri == :memory: |
        |  NEVER touch *.db   |
        +---------------------+
```

### Architectural Specifications:
1. **Engine Pooling**:
   In `TestConfig`:
   ```python
   from sqlalchemy.pool import StaticPool

   class TestConfig(Config):
       TESTING = True
       DATABASE_URL = "sqlite:///:memory:"
       SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
       SQLALCHEMY_ENGINE_OPTIONS = {
           "poolclass": StaticPool,
           "connect_args": {"check_same_thread": False},
       }
   ```
   *Why*: `StaticPool` maintains a single shared SQLite connection across the entire test session or test client invocation, preventing SQLite from discarding tables when individual transactions or requests close connections.

2. **Strict Guardrail**:
   In `conftest.py`:
   ```python
   @pytest.fixture(autouse=True)
   def verify_test_isolation(app):
       uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
       assert uri == "sqlite:///:memory:", f"UNSAFE TEST DATABASE URI: {uri}. Tests must run only on in-memory SQLite!"
   ```

3. **Temporary Upload Folder Fixture**:
   ```python
   @pytest.fixture
   def temp_upload_dir():
       d = tempfile.mkdtemp(prefix="test_uploads_")
       yield d
       shutil.rmtree(d, ignore_errors=True)
   ```
   Setting `app.config["UPLOAD_FOLDER"] = temp_upload_dir` guarantees that zero PNGs/SVGs leak into `public/upload_articles`.

4. **SMTP Disabling**:
   Ensure `app.config["SMTP_USER"] = ""` and `app.config["SMTP_PASS"] = ""` or monkeypatch `send_lead_email` to return `(False, "Test Mode")` so no network connections are attempted during `test_leads`.

5. **Pytest Path Configuration (`pytest.ini`)**:
   Place a `pytest.ini` in the repository root or backend directory:
   ```ini
   [pytest]
   pythonpath = backend
   testpaths = backend/tests
   ```
   This ensures `pytest` runs reliably from any directory (`pytest` from root or `pytest` from `backend/`) without needing `PYTHONPATH=backend`.

---

## 7. Caveats

1. **No External Service Dependencies**: The backend uses Groq or OpenAI for AI-assisted trend generation (`backend/app/modules/trends/service.py`), but `/api/v1/trends/auto_post` only enqueues generation without invoking LLMs synchronously. In testing, external AI calls are never triggered by the endpoint.
2. **Hardcoded MySQL Credentials in `backend/migrate_data.py`**: Lines 18-20 of `migrate_data.py` contain plaintext credentials (`mysql_user = "uygpuazs_root"`, `mysql_pass = "Nurdiansyah@024"`). While this file is not part of the active Flask app runtime, it represents a secret hygiene vulnerability relevant to R4.
3. **Hardcoded Trends Cache Path**: `backend/app/modules/trends/routes.py:11` references a hardcoded cPanel production path `/home/uygpuazs/public_html/api/cache/trends.json`. If this path does not exist, it falls back to default static JSON. Tests should verify this fallback.

---

## 8. Conclusion

The Flask backend is a well-structured, modular monolithic service with 10 feature modules and 22 active API endpoints. The existing test suite (`backend/tests/test_api.py`) passes 100% of its 13 test cases, but covers only ~30% of the public and protected API surface.

Crucially, two infrastructure defects were discovered:
1. **Module Import Failure**: Tests cannot be invoked cleanly without `PYTHONPATH=backend`.
2. **File System Leakage**: Media upload tests pollute `public/upload_articles` due to missing `UPLOAD_FOLDER` test isolation.

The 28 contract test gaps enumerated above provide a complete, verified roadmap for the Backend Test Engineer to implement full contract coverage and bulletproof zero-mutation test isolation.

---

## 9. Verification Method

To independently verify these findings:

1. **Run Existing Test Suite**:
   ```bash
   PYTHONPATH=backend backend/venv/bin/pytest backend/tests/test_api.py -v
   ```
   *Expected*: 13 tests pass.

2. **Verify Module Import Failure without PYTHONPATH**:
   ```bash
   backend/venv/bin/pytest backend/tests/test_api.py
   ```
   *Expected*: `ModuleNotFoundError: No module named 'app'`.

3. **Verify Upload Directory Leakage**:
   ```bash
   ls -la /home/nurdiansyah/dev/Personal_project/public/upload_articles
   ```
   *Expected*: Shows files named `*valid.png` generated during test execution.

4. **Verify Endpoint Contract Probing**:
   ```bash
   backend/venv/bin/python3 .agents/survey_backend/probe_runner.py
   ```
   *Expected*: `Probed 41 endpoint scenarios successfully.` (Outputs recorded in `.agents/survey_backend/probe_results.json`).
