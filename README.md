# NurdiansyahLabs — Personal Technology & Software Engineering Platform

A modern, high-performance web platform built with **React 18 + Vite (PWA)** frontend and a **Python 3.13.15 + Flask 3.1.3 Modular Monolith** backend backed by **PostgreSQL 13**.

Deployed on CloudLinux / LiteSpeed via Phusion Passenger Native WSGI.

---

## Architecture Overview

```text
                       CLIENT / BROWSER
                              │
                              ▼
                     React 18 + Vite PWA
                              │
                              ▼  (HTTPS /api/v1/*)
                    LiteSpeed Web Server
                              │
                              ▼  (WSGI)
                 Phusion Passenger Application
                              │
               ┌──────────────┴──────────────┐
               │  Flask 3.1.3 Modular Monolith│
               │  Python 3.13.15 Runtime      │
               └──────────────┬──────────────┘
                              │
                              ▼  (SQLAlchemy 2.0 + Psycopg 3)
                       PostgreSQL 13
```

---

## Directory Structure

```text
├── backend/
│   ├── app/
│   │   ├── core/               # Infrastructure, DB, Security, Errors, Config
│   │   └── modules/
│   │       ├── auth/           # Authentication, Token Verification, Security
│   │       ├── posts/          # Articles, Slugs, FAQ, SEO
│   │       ├── projects/       # Portfolio Projects, Tech Stack, Live Demos
│   │       ├── products/       # App Showcase & Commercial Products
│   │       ├── leads/          # Contact Enquiries & Inbound Leads
│   │       ├── analytics/      # Privacy-Friendly Telemetry & Ingestion
│   │       ├── media/          # Secure Uploads with Magic-Byte Sanitization
│   │       ├── trends/         # Multi-Provider AI (Groq/OpenAI) Automation
│   │       ├── primatera/      # Independent Poultry ERP Domain
│   │       └── admin/          # Unified Admin Orchestration
│   ├── migrations/             # Alembic Database Migrations
│   ├── tests/                  # Pytest Comprehensive Test Suite
│   ├── wsgi.py                 # Passenger WSGI Entrypoint with SCRIPT_NAME normalization
│   └── requirements.txt        # Python Dependencies
├── src/                        # React 18 + Vite Frontend Application
│   ├── components/             # Reusable UI & Security Guard Components
│   ├── pages/                  # Top-Level Route Views & Dashboards
│   └── showcases/              # Embedded Interactive Showcase Apps
```

---

## API Endpoints (`/api/v1/*`)

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/health` | GET | Public | Application & PostgreSQL health probe |
| `/api/v1/auth/login` | POST | Public | Admin login, returns cryptographic token |
| `/api/v1/auth/verify` | GET | Token | Validates admin session token |
| `/api/v1/posts` | GET, POST | Read Public, Write Admin | Article management with slug routing |
| `/api/v1/projects` | GET, POST | Read Public, Write Admin | Portfolio project catalog |
| `/api/v1/products` | GET, POST | Read Public, Write Admin | App & service product showcase |
| `/api/v1/leads` | POST, GET | Create Public, List Admin | Inbound lead capture & SMTP dispatch |
| `/api/v1/analytics/track` | POST | Public | Telemetry ingestion (views, duration) |
| `/api/v1/media/upload` | POST | Admin | Magic-byte verified asset upload |
| `/api/v1/trends` | GET | Public | AI industry trend data |
| `/api/v1/trends/auto_post` | GET, POST | Cron Key | Scheduled automated AI article generation |
| `/api/v1/primatera/*` | Various | Modular | ERP records, flock metrics, inventory |

---

## Running Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
pytest -v
python wsgi.py
```

### Frontend
```bash
npm install
npm run dev
```

---

## Production Deployment & WSGI

- Application Root: `/home/uygpuazs/nurdiansyahlabs-python`
- Virtual Environment: `/home/uygpuazs/virtualenv/nurdiansyahlabs-python/3.13`
- Web DocumentRoot: `/home/uygpuazs/public_html`
- Restart trigger: `touch /home/uygpuazs/nurdiansyahlabs-python/tmp/restart.txt`
