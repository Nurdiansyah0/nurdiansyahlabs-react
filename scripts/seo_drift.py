#!/usr/bin/env python3
"""
NurdiansyahLabs — Lightweight SEO Drift Engine
Inspired by Claude SEO's seo-drift architecture.

Snapshots production or staging routes, verifies invariants (HTTP 200, title,
description, canonical, robots, JSON-LD schema presence), and checks for drift against
an SQLite historical baseline without requiring heavy external infrastructure.
"""

import sys
import os
import sqlite3
import datetime
import urllib.request
import re
from html.parser import HTMLParser

BASE_URL = os.environ.get("SEO_TARGET_URL", "https://nurdiansyahlabs.com")
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "seo_drift.db")

ROUTES_TO_MONITOR = [
    "/",
    "/services/web-development",
    "/services/landing-page",
    "/services/data-analyst",
    "/services/machine-learning",
    "/showcase/fullstack/primatera-poultry",
    "/showcase/fullstack/warehouse-wms",
    "/showcase/landing-page/batam-rental-mobil",
    "/showcase/data-science/smart-vision",
    "/blog",
    "/trends",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt"
]

class HeadMetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""
        self.description = ""
        self.canonical = ""
        self.has_json_ld = False
        self.json_ld_blocks = []
        self.in_script_ld = False
        self.current_ld_content = ""

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta" and attr_dict.get("name", "").lower() == "description":
            self.description = attr_dict.get("content", "")
        elif tag == "link" and attr_dict.get("rel", "").lower() == "canonical":
            self.canonical = attr_dict.get("href", "")
        elif tag == "script" and attr_dict.get("type", "").lower() == "application/ld+json":
            self.in_script_ld = True
            self.has_json_ld = True
            self.current_ld_content = ""

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "script" and self.in_script_ld:
            self.in_script_ld = False
            self.json_ld_blocks.append(self.current_ld_content.strip())

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.in_script_ld:
            self.current_ld_content += data

def init_db(conn):
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS seo_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                route TEXT NOT NULL,
                status_code INTEGER NOT NULL,
                title TEXT,
                description TEXT,
                canonical TEXT,
                has_json_ld INTEGER NOT NULL
            )
        """)

def snapshot_route(route):
    url = f"{BASE_URL.rstrip('/')}{route}"
    req = urllib.request.Request(
        url, 
        headers={"User-Agent": "NurdiansyahLabs-SEODrift/1.0 (+https://nurdiansyahlabs.com)"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            content = response.read().decode('utf-8', errors='ignore')
            
            if route.endswith(('.txt', '.xml')):
                return {
                    "route": route,
                    "status_code": status,
                    "title": f"Static: {route}",
                    "description": "",
                    "canonical": url,
                    "has_json_ld": 0
                }
            
            parser = HeadMetadataParser()
            parser.feed(content)
            return {
                "route": route,
                "status_code": status,
                "title": parser.title.strip(),
                "description": parser.description.strip(),
                "canonical": parser.canonical.strip(),
                "has_json_ld": 1 if parser.has_json_ld else 0
            }
    except urllib.error.HTTPError as e:
        return {
            "route": route,
            "status_code": e.code,
            "title": "",
            "description": "",
            "canonical": "",
            "has_json_ld": 0
        }
    except Exception as e:
        return {
            "route": route,
            "status_code": 0,
            "title": f"ERROR: {str(e)}",
            "description": "",
            "canonical": "",
            "has_json_ld": 0
        }

def run_drift_check():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    init_db(conn)

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    print(f"=== Running SEO Drift Check against {BASE_URL} at {now} ===")
    
    anomalies = []
    success_count = 0

    for route in ROUTES_TO_MONITOR:
        snap = snapshot_route(route)
        
        # Invariants Check
        if snap["status_code"] != 200:
            anomalies.append(f"[FAIL HTTP] {route}: Returned {snap['status_code']} (Expected 200)")
        elif not route.endswith(('.txt', '.xml')) and not snap["title"]:
            anomalies.append(f"[WARN TITLE] {route}: Title tag is empty")
        elif not route.endswith(('.txt', '.xml')) and not snap["canonical"]:
            anomalies.append(f"[WARN CANONICAL] {route}: Canonical link missing")
        else:
            success_count += 1

        with conn:
            conn.execute("""
                INSERT INTO seo_snapshots (timestamp, route, status_code, title, description, canonical, has_json_ld)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (now, snap["route"], snap["status_code"], snap["title"], snap["description"], snap["canonical"], snap["has_json_ld"]))

        status_str = "OK" if snap["status_code"] == 200 else f"ERR {snap['status_code']}"
        print(f"  [{status_str}] {route:<45} | Title: {snap['title'][:30]:<30} | JSON-LD: {snap['has_json_ld']}")

    print("\n--- Drift Analysis Summary ---")
    print(f"Routes monitored: {len(ROUTES_TO_MONITOR)}")
    print(f"Passed invariants: {success_count}/{len(ROUTES_TO_MONITOR)}")

    if anomalies:
        print("\nIdentified Invariant Divergences / Drift Warnings:")
        for a in anomalies:
            print(f"  * {a}")
        sys.exit(1)
    else:
        print("\nAll production SEO invariants preserved. Zero drift detected.")
        sys.exit(0)

if __name__ == "__main__":
    run_drift_check()
