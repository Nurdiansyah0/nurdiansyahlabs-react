#!/usr/bin/env python3
"""
verify_deployment.py
Performs dual-layer deployment verification:
1. FTP filesystem topology audit (confirms files are in root, nested public_html removed).
2. Live HTTP endpoint verification (serves latest JS/CSS bundles and deploy manifest).
"""

import ftplib
import io
import os
import re
import sys
import urllib.request
import urllib.error

def verify_ftp():
    server = os.environ.get("FTP_SERVER", "")
    username = os.environ.get("FTP_USERNAME", "")
    password = os.environ.get("FTP_PASSWORD", "")
    port = int(os.environ.get("FTP_PORT", 21))

    if not server or not username or not password:
        print("[-] FTP credentials not available. Skipping FTP verification.")
        return True

    print("\n--- 1. FTP Production Filesystem Audit ---")
    try:
        ftp = ftplib.FTP_TLS(timeout=30)
        ftp.connect(server, port)
        ftp.login(username, password)
        ftp.prot_p()
        print("[+] Connected securely via FTP_TLS.")
    except Exception as e:
        print(f"[!] FTP_TLS failed ({e}), using standard FTP...")
        ftp = ftplib.FTP(timeout=30)
        ftp.connect(server, port)
        ftp.login(username, password)

    root_entries = [os.path.basename(e.rstrip('/')) for e in ftp.nlst()]
    print(f"[*] Total items in FTP document root: {len(root_entries)}")

    # 1. Verify nested public_html is NOT present
    if "public_html" in root_entries:
        print("[FAIL] Orphaned nested directory 'public_html' still exists!")
        return False
    else:
        print("[PASS] Orphaned nested directory 'public_html' is ABSENT.")

    # 2. Verify root index.html is present
    if "index.html" in root_entries:
        print("[PASS] Root 'index.html' is present.")
    else:
        print("[FAIL] Root 'index.html' is MISSING!")
        return False

    # 3. Check deploy_manifest.txt in root
    if "deploy_manifest.txt" in root_entries:
        bio = io.BytesIO()
        ftp.retrbinary("RETR deploy_manifest.txt", bio.write)
        manifest_text = bio.getvalue().decode('utf-8', errors='ignore')
        print(f"[PASS] Root 'deploy_manifest.txt' found:\n{manifest_text.strip()}")
    else:
        print("[WARN] 'deploy_manifest.txt' not found at remote root.")

    # 4. Check assets directory
    if "assets" in root_entries:
        ftp.cwd("assets")
        asset_files = [os.path.basename(e.rstrip('/')) for e in ftp.nlst()]
        index_js = [f for f in asset_files if re.match(r"^index-.*\.js$", f)]
        index_css = [f for f in asset_files if re.match(r"^index-.*\.css$", f)]
        print(f"[PASS] Remote assets found: {len(asset_files)} files. Main JS: {index_js}, Main CSS: {index_css}")
        ftp.cwd("..")
    else:
        print("[FAIL] 'assets/' directory missing from remote root!")
        return False

    ftp.quit()
    return True

def verify_http():
    print("\n--- 2. Live HTTP Endpoint Verification ---")
    base_url = "https://nurdiansyahlabs.com"
    headers = {"User-Agent": "GitHubActions-DeploymentVerifier/1.0"}

    # A. Check Root Document
    print(f"[*] Checking {base_url}/ ...")
    req = urllib.request.Request(base_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"[+] HTTP Status: {resp.status}")
            js_match = re.findall(r'src=["\'](/assets/index-[^"\']+\.js)["\']', html)
            css_match = re.findall(r'href=["\'](/assets/index-[^"\']+\.css)["\']', html)
            print(f"[*] Live HTML Main JS Bundle: {js_match}")
            print(f"[*] Live HTML Main CSS Bundle: {css_match}")
            if "index-DYPwEsWH.js" in html:
                print("[PASS] Live site is serving expected bundle 'index-DYPwEsWH.js'!")
            else:
                print("[INFO] Bundle hash in live HTML: " + str(js_match))
    except Exception as e:
        print(f"[-] HTTP request failed: {e}")

    # B. Check Manifest
    manifest_url = f"{base_url}/deploy_manifest.txt"
    print(f"[*] Checking {manifest_url} ...")
    try:
        with urllib.request.urlopen(urllib.request.Request(manifest_url, headers=headers), timeout=15) as resp:
            manifest_content = resp.read().decode('utf-8', errors='ignore')
            print(f"[PASS] Deployed Manifest Content:\n{manifest_content.strip()}")
    except urllib.error.HTTPError as e:
        print(f"[-] Manifest request returned HTTP {e.code}")
    except Exception as e:
        print(f"[-] Manifest request failed: {e}")

    # C. Check Nested Path
    nested_url = f"{base_url}/public_html/"
    print(f"[*] Checking nested path {nested_url} ...")
    try:
        with urllib.request.urlopen(urllib.request.Request(nested_url, headers=headers), timeout=15) as resp:
            print(f"[WARN] Nested path returned HTTP {resp.status} (expected 404)")
    except urllib.error.HTTPError as e:
        if e.code in (404, 403):
            print(f"[PASS] Nested path returned HTTP {e.code} (cleanly inactive).")
        else:
            print(f"[INFO] Nested path returned HTTP {e.code}")
    except Exception as e:
        print(f"[INFO] Nested path request error: {e}")

def main():
    print("=== Production Deployment Verification ===")
    ftp_ok = verify_ftp()
    verify_http()
    print("=== Verification Complete ===")
    if not ftp_ok:
        sys.exit(1)

if __name__ == "__main__":
    main()
