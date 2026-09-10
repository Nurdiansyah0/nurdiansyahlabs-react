import sys
import os
import json
import tempfile
import io

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.core.config import Config
from app.core.database import db
from app.core.security import hash_password
from app.modules.auth.models import AdminUser
from app.modules.primatera.models import PrimateraUser

# Isolated temporary upload dir
temp_upload_dir = tempfile.mkdtemp(prefix="test_uploads_")

class TestProbeConfig(Config):
    TESTING = True
    DATABASE_URL = "sqlite:///:memory:"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}
    UPLOAD_FOLDER = temp_upload_dir

app = create_app(TestProbeConfig)

results = []

def probe(name, method, path, headers=None, json_data=None, data=None, content_type=None):
    with app.test_client() as client:
        kwargs = {}
        if headers:
            kwargs["headers"] = headers
        if json_data is not None:
            kwargs["json"] = json_data
        if data is not None:
            kwargs["data"] = data
        if content_type:
            kwargs["content_type"] = content_type

        func = getattr(client, method.lower())
        res = func(path, **kwargs)
        try:
            body = res.get_json()
        except Exception:
            body = res.get_data(as_text=True)

        results.append({
            "name": name,
            "method": method,
            "path": path,
            "status_code": res.status_code,
            "response": body
        })
        return res, body

with app.app_context():
    db.create_all()
    # Seed admin and primatera user
    admin = AdminUser(
        username="testadmin",
        password_hash=hash_password("adminpass123"),
        email="admin@example.com"
    )
    db.session.add(admin)
    p_user = PrimateraUser(
        username="puser",
        password_hash=hash_password("ppass123"),
        name="Primatera User",
        role="admin"
    )
    db.session.add(p_user)
    db.session.commit()

    with app.test_client() as client:
        # 1. Login with username
        res, body = probe("Login with username", "POST", "/api/v1/auth/login", json_data={"username": "testadmin", "password": "adminpass123"})
        token = body.get("token")

        # 2. Login with email
        probe("Login with email", "POST", "/api/v1/auth/login", json_data={"username": "admin@example.com", "password": "adminpass123"})

        # 3. Login with empty payload
        probe("Login empty payload", "POST", "/api/v1/auth/login", json_data={})

        # 4. Verify with Bearer token
        probe("Verify with Authorization Bearer", "GET", "/api/v1/auth/verify", headers={"Authorization": f"Bearer {token}"})

        # 5. Forgot password existing user
        probe("Forgot password existing user", "POST", "/api/v1/auth/forgot_password", json_data={"identifier": "testadmin"})
        # Check reset_token in DB
        admin_refreshed = db.session.scalar(db.select(AdminUser).where(AdminUser.username == "testadmin"))
        reset_token = admin_refreshed.reset_token

        # 6. Forgot password non-existing user
        probe("Forgot password non-existent user", "POST", "/api/v1/auth/forgot_password", json_data={"identifier": "nonexistent@user.com"})

        # 7. Reset password invalid token
        probe("Reset password invalid token", "POST", "/api/v1/auth/reset_password", json_data={"token": "bad-token", "password": "newpassword123"})

        # 8. Reset password valid token
        probe("Reset password valid token", "POST", "/api/v1/auth/reset_password", json_data={"token": reset_token, "password": "newpassword123"})

        # 9. Verify session invalidation after reset
        probe("Verify session invalidation after reset", "GET", "/api/v1/auth/verify", headers={"X-Admin-Token": token})

        # 10. Login with new password
        res, body = probe("Login with new password", "POST", "/api/v1/auth/login", json_data={"username": "testadmin", "password": "newpassword123"})
        new_token = body.get("token")

        # 11. Logout
        probe("Logout with X-Admin-Token", "POST", "/api/v1/auth/logout", headers={"X-Admin-Token": new_token})
        probe("Verify after logout", "GET", "/api/v1/auth/verify", headers={"X-Admin-Token": new_token})

        # Log back in for remaining tests
        res, body = probe("Login re-auth", "POST", "/api/v1/auth/login", json_data={"username": "testadmin", "password": "newpassword123"})
        auth_token = body.get("token")
        auth_headers = {"X-Admin-Token": auth_token}

        # 12. Legacy auth endpoints
        leg_res, leg_body = probe("Legacy auth login", "POST", "/api/v1/auth/legacy?action=login", json_data={"username": "testadmin", "password": "newpassword123"})
        auth_token = leg_body.get("token")
        auth_headers = {"X-Admin-Token": auth_token}
        probe("Legacy auth unknown", "GET", "/api/v1/auth/legacy?action=invalid")

        # 13. Products full CRUD
        prod_res, prod_body = probe("Create Product", "POST", "/api/v1/products", headers=auth_headers, json_data={
            "app_id": "pos-resto",
            "name": "Point of Sale",
            "price": 1500000,
            "category": "SaaS"
        })
        prod_id = prod_body["data"]["id"]
        probe("Get Product Detail", "GET", f"/api/v1/products/{prod_id}")
        probe("Update Product", "PATCH", f"/api/v1/products/{prod_id}", headers=auth_headers, json_data={"name": "POS Resto Pro"})
        probe("Delete Product", "DELETE", f"/api/v1/products/{prod_id}", headers=auth_headers)
        probe("Get Deleted Product 404", "GET", f"/api/v1/products/{prod_id}")

        # 14. Projects category and status filtering
        probe("Create Project", "POST", "/api/v1/projects", headers=auth_headers, json_data={
            "slug": "sample-project",
            "title": "Sample Project",
            "description": "A sample project",
            "category": "Fullstack",
            "categorySlug": "fullstack",
            "status": "published"
        })
        probe("Filter Projects category match", "GET", "/api/v1/projects?category=fullstack")
        probe("Filter Projects category mismatch", "GET", "/api/v1/projects?category=mobile")
        probe("Filter Projects status", "GET", "/api/v1/projects?status=archived")

        # 15. Analytics GET summary
        probe("Get Analytics summary unauth 401", "GET", "/api/v1/analytics")
        probe("Get Analytics summary auth 200", "GET", "/api/v1/analytics", headers=auth_headers)

        # 16. Media upload to isolated dir
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR' + b'\x00' * 50
        valid_png = {'file': (io.BytesIO(png_data), 'test_probe.png')}
        probe("Media upload auth", "POST", "/api/v1/media/upload", headers=auth_headers, data=valid_png, content_type='multipart/form-data')

        # 17. Trends auto_post with X-Cron-Key
        probe("Trends auto_post header", "POST", "/api/v1/trends/auto_post", headers={"X-Cron-Key": "nurdiansyah-cron-2026"})
        probe("Trends auto_post query key", "GET", "/api/v1/trends/auto_post?key=nurdiansyah-cron-2026&geo=US")

        # 18. Primatera Transactions & Inventory
        probe("Primatera Transaction POST", "POST", "/api/v1/primatera/transactions", json_data={
            "date": "2026-09-08",
            "type": "INCOME",
            "category": "Harvest",
            "amount": 25000000,
            "quantity": 1000,
            "notes": "Penjualan ayam broiler"
        })
        probe("Primatera Transactions GET", "GET", "/api/v1/primatera/transactions")

        probe("Primatera Inventory POST create", "POST", "/api/v1/primatera/inventory", json_data={
            "item_type": "FEED",
            "stock": 500.5
        })
        probe("Primatera Inventory POST update", "POST", "/api/v1/primatera/inventory", json_data={
            "item_type": "FEED",
            "stock": 750.0
        })
        probe("Primatera Inventory GET", "GET", "/api/v1/primatera/inventory")

        # 19. Admin multiplexer (/api/v1/admin)
        probe("Admin router unauth 401", "GET", "/api/v1/admin?action=posts")
        probe("Admin router invalid action 400", "GET", "/api/v1/admin?action=unknown", headers=auth_headers)
        probe("Admin router posts GET", "GET", "/api/v1/admin?action=posts", headers=auth_headers)
        probe("Admin router posts POST", "POST", "/api/v1/admin?action=posts", headers=auth_headers, json_data={
            "slug": "admin-post-1",
            "title": "Admin Created Post"
        })
        probe("Admin router posts PUT", "PUT", "/api/v1/admin?action=posts", headers=auth_headers, json_data={
            "slug": "admin-post-1",
            "title": "Admin Post Updated"
        })
        probe("Admin router posts DELETE", "DELETE", "/api/v1/admin?action=posts&slug=admin-post-1", headers=auth_headers)

        probe("Admin router leads GET", "GET", "/api/v1/admin?action=leads", headers=auth_headers)

    db.drop_all()

# Clean up temp upload dir
import shutil
shutil.rmtree(temp_upload_dir, ignore_errors=True)

with open(os.path.join(os.path.dirname(__file__), "probe_results.json"), "w") as f:
    json.dump(results, f, indent=2)

print(f"Probed {len(results)} endpoint scenarios successfully.")
