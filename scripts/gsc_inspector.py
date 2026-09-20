#!/usr/bin/env python3
"""
NurdiansyahLabs — Google Search Console Inspector & Error Monitor

Inspects URL indexing status, crawl coverage, and Rich Results / Structured Data
(schema & citation issues) using the official Google Search Console API.
"""

import sys
import os
import argparse
import json
from typing import List, Dict, Any, Optional

DEFAULT_SITE_URL = os.environ.get("GSC_SITE_URL", "https://nurdiansyahlabs.com")

def find_default_credentials() -> str:
    env_cred = os.environ.get("GSC_CREDENTIALS_FILE")
    if env_cred and os.path.exists(env_cred):
        return env_cred
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    for name in ["gsc-credential.json", "gsc-credentials.json", "credentials/gsc-credential.json", "credentials/gsc-credentials.json"]:
        p = os.path.join(root_dir, name)
        if os.path.exists(p):
            return p
    return os.path.join(root_dir, "gsc-credential.json")

DEFAULT_CREDENTIALS = find_default_credentials()

# Standard project routes to monitor (excluding non-HTML static files like robots.txt)
DEFAULT_ROUTES = [
    "/",
    "/blog",
    "/trends",
    "/services/web-development",
    "/services/landing-page",
    "/services/data-analyst",
    "/services/machine-learning",
    "/showcase/fullstack/primatera-poultry",
    "/showcase/fullstack/warehouse-wms",
    "/showcase/landing-page/batam-rental-mobil",
    "/showcase/data-science/smart-vision",
]

# ANSI colors for terminal output
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
BOLD = "\033[1m"
RESET = "\033[0m"


def check_dependencies():
    """Checks if google-api-python-client and google-auth are available."""
    try:
        import google.oauth2.service_account  # noqa
        import googleapiclient.discovery  # noqa
        return True
    except ImportError:
        print(f"{RED}{BOLD}[Error] Missing required Google API libraries.{RESET}")
        print("\nSilakan install library berikut terlebih dahulu:")
        print(f"{BOLD}  pip install google-api-python-client google-auth{RESET}")
        print("atau jika menggunakan virtualenv:")
        print(f"{BOLD}  python3 -m pip install google-api-python-client google-auth{RESET}\n")
        return False


def get_gsc_service(credentials_path: str):
    """Authenticates using Service Account JSON and returns the Search Console service."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    if not os.path.exists(credentials_path):
        print(f"{RED}{BOLD}[Error] File credentials tidak ditemukan:{RESET} {credentials_path}")
        print_setup_guide()
        return None

    try:
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
        service = build("searchconsole", "v1", credentials=credentials)
        return service
    except Exception as e:
        print(f"{RED}[Error saat inisialisasi Search Console API]:{RESET} {e}")
        return None


def print_setup_guide():
    """Displays setup guide if credentials are missing."""
    print(f"\n{BOLD}=== PANDUAN PENGATURAN SERVICE ACCOUNT GOOGLE SEARCH CONSOLE ==={RESET}")
    print("1. Buka Google Cloud Console: https://console.cloud.google.com/")
    print("2. Aktifkan 'Google Search Console API' di menu 'APIs & Services' > 'Library'.")
    print("3. Buat Service Account di 'APIs & Services' > 'Credentials'.")
    print("4. Download kunci JSON (Add Key > Create New Key > JSON).")
    print(f"5. Simpan file tersebut sebagai: {BOLD}gsc-credentials.json{RESET} di root folder proyek ini.")
    print("6. Buka Google Search Console (https://search.google.com/search-console).")
    print("   Masuk ke Settings > Users and permissions > Add user.")
    print("   Masukkan alamat email Service Account tersebut dengan izin 'Full' atau 'Owner'.\n")


def resolve_site_url(service, requested_url: str) -> str:
    """Auto-detects the exact siteUrl registered in Google Search Console."""
    try:
        sites_res = service.sites().list().execute()
        entries = sites_res.get("siteEntry", [])
        if not entries:
            return requested_url

        # Check for direct match or normalized match
        req_norm = requested_url.rstrip("/").lower()
        for entry in entries:
            reg_url = entry.get("siteUrl", "")
            if reg_url.rstrip("/").lower() == req_norm:
                return reg_url
            if f"sc-domain:{req_norm.replace('https://', '').replace('http://', '')}" == reg_url:
                return reg_url

        # Fallback to the first available property if only one exists
        if len(entries) == 1:
            return entries[0].get("siteUrl", requested_url)

        return entries[0].get("siteUrl", requested_url)
    except Exception:
        return requested_url


def inspect_single_url(service, site_url: str, inspection_url: str) -> Dict[str, Any]:
    """Inspects a single URL via URL Inspection API."""
    request_body = {
        "inspectionUrl": inspection_url,
        "siteUrl": site_url
    }

    try:
        response = service.urlInspection().index().inspect(body=request_body).execute()
        return response.get("inspectionResult", {})
    except Exception as e:
        return {"error": str(e)}



def format_inspection_result(target_url: str, result: Dict[str, Any], json_output: bool = False):
    """Nicely formats and prints the URL inspection outcome."""
    if json_output:
        print(json.dumps({target_url: result}, indent=2))
        return

    if "error" in result:
        print(f"\n{BOLD}URL:{RESET} {target_url}")
        print(f"  {RED}✖ Gagal memeriksa:{RESET} {result['error']}")
        return

    index_status = result.get("indexStatusResult", {})
    coverage = index_status.get("coverageState", "Unknown")
    verdict = index_status.get("verdict", "VERDICT_UNSPECIFIED")
    robots_state = index_status.get("robotsTxtState", "Unknown")
    indexing_state = index_status.get("indexingState", "Unknown")
    last_crawl = index_status.get("lastCrawlTime", "Belum pernah dirayapi")
    google_canonical = index_status.get("googleCanonical", "-")
    user_canonical = index_status.get("userCanonical", "-")

    # Indexing status color
    if verdict == "PASS" or "Submitted and indexed" in coverage:
        v_color = GREEN
        v_icon = "✔"
    elif "Discovered" in coverage or "Crawled - currently not indexed" in coverage:
        v_color = YELLOW
        v_icon = "⚠"
    else:
        v_color = RED
        v_icon = "✖"

    print(f"\n{BOLD}────────────────────────────────────────────────────────────────────{RESET}")
    print(f"{BOLD}URL:{RESET} {target_url}")
    print(f"  {v_color}{v_icon} Status Indexing  :{RESET} {v_color}{coverage}{RESET} (Verdict: {verdict})")
    print(f"  • Robots.txt       : {robots_state}")
    print(f"  • Izin Index       : {indexing_state}")
    print(f"  • Waktu Crawl      : {last_crawl}")
    print(f"  • User Canonical   : {user_canonical}")
    print(f"  • Google Canonical : {google_canonical}")

    # Rich results & Structured Data (citations/schema errors)
    rich_results = result.get("richResultsResult", {})
    if rich_results:
        rr_verdict = rich_results.get("verdict", "NEUTRAL")
        items = rich_results.get("detectedItems", [])

        if rr_verdict == "PASS":
            print(f"  {GREEN}✔ Structured Data  : Valid ({len(items)} tipe terdeteksi){RESET}")
        else:
            print(f"  {RED}✖ Structured Data Issue (Verdict: {rr_verdict}):{RESET}")

        for item in items:
            item_type = item.get("richResultType", "Unknown")
            issues_found = []
            for sub_item in item.get("items", []):
                for issue in sub_item.get("issues", []):
                    issues_found.append(issue)

            if issues_found:
                print(f"    {YELLOW}▸ Tipe: {item_type}{RESET}")
                for issue in issues_found:
                    sev = issue.get("severity", "WARNING")
                    sev_color = RED if sev == "ERROR" else YELLOW
                    print(f"      {sev_color}[{sev}]{RESET} {issue.get('issueMessage')}")
            else:
                print(f"    {GREEN}▸ Tipe: {item_type} (OK){RESET}")
    else:
        print(f"  • Structured Data  : Tidak ada rich results yang terdeteksi.")


def check_sitemaps(service, site_url: str):
    """Fetches sitemap submission status and errors."""
    print(f"\n{BOLD}=== MEMERIKSA STATUS SITEMAP ==={RESET}")
    try:
        response = service.sitemaps().list(siteUrl=site_url).execute()
        sitemaps = response.get("sitemap", [])

        if not sitemaps:
            # Try domain property prefix
            domain_site_url = f"sc-domain:{site_url.replace('https://', '').replace('http://', '').rstrip('/')}"
            try:
                response = service.sitemaps().list(siteUrl=domain_site_url).execute()
                sitemaps = response.get("sitemap", [])
            except Exception:
                pass

        if not sitemaps:
            print(f"{YELLOW}Tidak ada sitemap yang terdaftar di properti ini.{RESET}")
            print(f"Daftarkan sitemap di GSC: {site_url}/sitemap.xml")
            return

        for sm in sitemaps:
            path = sm.get("path")
            last_submitted = sm.get("lastSubmitted", "-")
            last_downloaded = sm.get("lastDownloaded", "-")
            errors = sm.get("errors", 0)
            warnings = sm.get("warnings", 0)
            status = sm.get("isPending", False)

            status_str = f"{YELLOW}Pending{RESET}" if status else f"{GREEN}Success{RESET}"
            if int(errors) > 0:
                status_str = f"{RED}Error ({errors} errors){RESET}"

            print(f"  • Path           : {path}")
            print(f"    Status         : {status_str}")
            print(f"    Last Submitted : {last_submitted}")
            print(f"    Last Downloaded: {last_downloaded}")
            print(f"    Warnings       : {warnings}")
            print(f"    Errors         : {errors}")

    except Exception as e:
        print(f"{RED}[Error saat mengambil sitemap]:{RESET} {e}")


def main():
    parser = argparse.ArgumentParser(description="Google Search Console Inspector & Error Monitor")
    parser.add_argument("--url", type=str, help="URL spesifik yang ingin diinspeksi")
    parser.add_argument("--all", action="store_true", help="Inspeksi seluruh rute utama website")
    parser.add_argument("--sitemap", action="store_true", help="Periksa status sitemap di Search Console")
    parser.add_argument("--credentials", type=str, default=DEFAULT_CREDENTIALS, help="Path ke file credentials JSON")
    parser.add_argument("--site-url", type=str, default=DEFAULT_SITE_URL, help="URL Properti Google Search Console")
    parser.add_argument("--json", action="store_true", help="Output format JSON")

    args = parser.parse_args()

    if not check_dependencies():
        sys.exit(1)

    service = get_gsc_service(args.credentials)
    if not service:
        sys.exit(1)

    site_url = resolve_site_url(service, args.site_url)
    base_web_url = site_url.replace("sc-domain:", "https://").rstrip("/")

    if args.sitemap:
        check_sitemaps(service, site_url)
        return

    # Determine URLs to inspect
    if args.url:
        urls_to_inspect = [args.url]
    elif args.all:
        urls_to_inspect = [f"{base_web_url}{route}" for route in DEFAULT_ROUTES]
    else:
        # Default: inspect homepage and blog
        urls_to_inspect = [f"{base_web_url}/", f"{base_web_url}/blog"]

    print(f"{BOLD}=== GOOGLE SEARCH CONSOLE INSPECTION ==={RESET}")
    print(f"Target Site: {site_url}")
    print(f"Memeriksa {len(urls_to_inspect)} URL...")


    for target_url in urls_to_inspect:
        res = inspect_single_url(service, site_url, target_url)
        format_inspection_result(target_url, res, json_output=args.json)


if __name__ == "__main__":
    main()
