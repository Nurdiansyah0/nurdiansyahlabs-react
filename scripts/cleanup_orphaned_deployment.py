#!/usr/bin/env python3
"""
cleanup_orphaned_deployment.py
Safely removes orphaned nested 'public_html/' directory from production cPanel server via FTP.
Idempotent and safe: strictly targets 'public_html' inside the chrooted root.
"""

import ftplib
import os
import sys

def connect_ftp():
    server = os.environ.get("FTP_SERVER", "")
    username = os.environ.get("FTP_USERNAME", "")
    password = os.environ.get("FTP_PASSWORD", "")
    port = int(os.environ.get("FTP_PORT", 21))

    if not server or not username or not password:
        print("[-] FTP credentials not set in environment. Skipping remote cleanup.")
        sys.exit(0)

    print(f"[*] Connecting to FTP server: {server}:{port} as user '{username}'...")
    try:
        ftp = ftplib.FTP_TLS(timeout=30)
        ftp.connect(server, port)
        ftp.login(username, password)
        ftp.prot_p()
        print("[+] Connected securely via FTP_TLS.")
        return ftp
    except Exception as e:
        print(f"[!] FTP_TLS negotiation failed ({e}), falling back to standard FTP...")
        try:
            ftp = ftplib.FTP(timeout=30)
            ftp.connect(server, port)
            ftp.login(username, password)
            print("[+] Connected via standard FTP.")
            return ftp
        except Exception as e_std:
            print(f"[-] FTP connection failed: {e_std}")
            sys.exit(1)

def cleanup_orphaned_nested_dir(ftp, target_name="public_html"):
    if target_name != "public_html":
        raise ValueError(f"Safety restriction: Target must be 'public_html', got '{target_name}'")

    current_dir = ftp.pwd()
    print(f"[*] Current remote directory: {current_dir}")

    # Inspect directory listing
    entries = []
    try:
        entries = ftp.nlst()
    except Exception as e:
        print(f"[-] Unable to list remote directory: {e}")
        return

    cleaned_entries = [os.path.basename(e.rstrip('/')) for e in entries]
    print(f"[*] Remote root entries found: {len(cleaned_entries)}")

    if target_name not in cleaned_entries:
        print(f"[+] Target '{target_name}' not found at remote root. Production server is already clean.")
        return

    print(f"[!] Orphaned nested directory '{target_name}' detected! Beginning recursive removal...")

    def _delete_recursive(dir_path):
        ftp.cwd(dir_path)
        items = []
        try:
            for name, facts in ftp.mlsd():
                if name in ('.', '..'):
                    continue
                items.append((name, facts.get('type', 'file')))
        except Exception:
            for item in ftp.nlst():
                base = os.path.basename(item.rstrip('/'))
                if base in ('.', '..'):
                    continue
                is_sub_dir = False
                try:
                    ftp.cwd(base)
                    ftp.cwd('..')
                    is_sub_dir = True
                except Exception:
                    is_sub_dir = False
                items.append((base, 'dir' if is_sub_dir else 'file'))

        deleted_files = 0
        deleted_dirs = 0

        for name, item_type in items:
            if item_type == 'dir':
                sub_f, sub_d = _delete_recursive(name)
                deleted_files += sub_f
                deleted_dirs += sub_d + 1
            else:
                try:
                    ftp.delete(name)
                    deleted_files += 1
                except Exception as err:
                    print(f"    [-] Warning: Failed to delete file {name}: {err}")

        ftp.cwd('..')
        try:
            ftp.rmd(dir_path)
            print(f"[+] Removed directory: {dir_path}")
        except Exception as err:
            print(f"[-] Warning: Failed to remove directory {dir_path}: {err}")

        return deleted_files, deleted_dirs

    total_files, total_dirs = _delete_recursive(target_name)
    print(f"[+] Cleanup completed: {total_files} files and {total_dirs + 1} directories removed.")

    # Post-cleanup verification
    post_entries = [os.path.basename(e.rstrip('/')) for e in ftp.nlst()]
    if target_name in post_entries:
        print(f"[-] ERROR: '{target_name}' still exists after cleanup attempt!")
        sys.exit(1)
    else:
        print(f"[SUCCESS] Orphaned nested '{target_name}' verified completely eradicated.")

def main():
    print("=== Production Deployment Cleanup Tool ===")
    ftp = connect_ftp()
    try:
        cleanup_orphaned_nested_dir(ftp, "public_html")
    finally:
        try:
            ftp.quit()
        except Exception:
            pass
    print("=== Cleanup Tool Finished ===")

if __name__ == "__main__":
    main()
