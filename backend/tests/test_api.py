import pytest
import io
from app import create_app
from app.core.config import Config
from app.core.database import db
from app.core.security import hash_password
from app.modules.auth.models import AdminUser
from app.modules.primatera.models import PrimateraUser

class TestConfig(Config):
    TESTING = True
    DATABASE_URL = "sqlite:///:memory:"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}

@pytest.fixture
def client():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        admin = AdminUser(
            username="testadmin",
            password_hash=hash_password("adminpass123"),
            email="admin@example.com"
        )
        db.session.add(admin)

        p_user = PrimateraUser(
            username="userdemo1",
            password_hash=hash_password("password123"),
            name="Demo User 1",
            role="viewer"
        )
        db.session.add(p_user)
        db.session.commit()

        yield app.test_client()
        db.drop_all()

# --- Health & Basic ---
def test_health_check(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["status"] == "ok"
    assert data["data"]["database"] == "ok"

# --- Auth Module ---
def test_auth_login_and_verify_success(client):
    res = client.post("/api/v1/auth/login", json={
        "username": "testadmin",
        "password": "adminpass123"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    token = data["token"]
    assert len(token) > 20

    v_res = client.get("/api/v1/auth/verify", headers={"X-Admin-Token": token})
    assert v_res.status_code == 200
    v_data = v_res.get_json()
    assert v_data["valid"] is True
    assert v_data["user"]["username"] == "testadmin"

def test_auth_login_invalid_credentials(client):
    res = client.post("/api/v1/auth/login", json={
        "username": "testadmin",
        "password": "wrongpassword"
    })
    assert res.status_code == 401
    assert res.get_json()["success"] is False

def test_auth_verify_unauthorized(client):
    res = client.get("/api/v1/auth/verify", headers={"X-Admin-Token": "invalid-token-12345"})
    assert res.status_code == 401
    assert res.get_json()["success"] is False

def test_auth_verify_missing_token(client):
    res = client.get("/api/v1/auth/verify")
    assert res.status_code == 401

# --- Posts Module ---
def test_posts_lifecycle(client):
    login_res = client.post("/api/v1/auth/login", json={"username": "testadmin", "password": "adminpass123"})
    token = login_res.get_json()["token"]

    post_payload = {
        "title": "Uji Coba Post Python",
        "slug": "uji-coba-post-python",
        "description": "Deskripsi artikel pengujian",
        "service": "Web Development",
        "content": "<p>Konten lengkap artikel pengujian.</p>",
        "faqs": [{"q": "Pertanyaan 1?", "a": "Jawaban 1."}]
    }
    # Unauthenticated create should fail
    unauth_res = client.post("/api/v1/posts", json=post_payload)
    assert unauth_res.status_code == 401

    # Authenticated create
    create_res = client.post("/api/v1/posts", json=post_payload, headers={"X-Admin-Token": token})
    assert create_res.status_code == 201

    # Duplicate slug should fail (409)
    dup_res = client.post("/api/v1/posts", json=post_payload, headers={"X-Admin-Token": token})
    assert dup_res.status_code == 409

    # Read post by slug
    read_res = client.get("/api/v1/posts/uji-coba-post-python")
    assert read_res.status_code == 200
    assert read_res.get_json()["title"] == "Uji Coba Post Python"

    # Read all posts
    all_res = client.get("/api/v1/posts")
    assert all_res.status_code == 200
    assert len(all_res.get_json()) == 1

    # Update post
    update_res = client.put("/api/v1/posts/uji-coba-post-python", json={"title": "Uji Coba Updated"}, headers={"X-Admin-Token": token})
    assert update_res.status_code == 200
    assert update_res.get_json()["data"]["title"] == "Uji Coba Updated"

    # Delete post
    del_res = client.delete("/api/v1/posts/uji-coba-post-python", headers={"X-Admin-Token": token})
    assert del_res.status_code == 200

    # Read post after deletion should 404
    after_res = client.get("/api/v1/posts/uji-coba-post-python")
    assert after_res.status_code == 404

# --- Leads Module ---
def test_leads_submission_and_management(client):
    login_res = client.post("/api/v1/auth/login", json={"username": "testadmin", "password": "adminpass123"})
    token = login_res.get_json()["token"]

    lead_payload = {
        "name": "Budi Santoso",
        "contact": "081234567890",
        "service": "Mobile Apps",
        "message": "Halo, saya butuh konsultasi pembuatan aplikasi."
    }
    res = client.post("/api/v1/leads", json=lead_payload)
    assert res.status_code == 201
    assert res.get_json()["success"] is True

    # Leads validation failure
    invalid_lead = client.post("/api/v1/leads", json={"name": ""})
    assert invalid_lead.status_code == 400

    # Get leads as admin
    leads_res = client.get("/api/v1/leads", headers={"X-Admin-Token": token})
    assert leads_res.status_code == 200
    leads = leads_res.get_json()["leads"]
    assert len(leads) == 1
    assert leads[0]["name"] == "Budi Santoso"

    # Delete lead
    lead_id = leads[0]["id"]
    del_lead = client.delete(f"/api/v1/leads/{lead_id}", headers={"X-Admin-Token": token})
    assert del_lead.status_code == 200

# --- Products Module ---
def test_products_endpoint(client):
    token = client.post("/api/v1/auth/login", json={"username": "testadmin", "password": "adminpass123"}).get_json()["token"]

    p_payload = {
        "app_id": "batam-rental-mobil",
        "name": "Toyota Fortuner",
        "price": 850000,
        "description": "SUV premium untuk perjalanan bisnis",
        "category": "SUV"
    }
    c_res = client.post("/api/v1/products", json=p_payload, headers={"X-Admin-Token": token})
    assert c_res.status_code == 201

    g_res = client.get("/api/v1/products?app=batam-rental-mobil")
    assert g_res.status_code == 200
    data = g_res.get_json()["data"]
    assert len(data) == 1
    assert data[0]["name"] == "Toyota Fortuner"

    # Filter for non-existent app should return empty array
    empty_res = client.get("/api/v1/products?app=non-existent-app")
    assert empty_res.status_code == 200
    assert len(empty_res.get_json()["data"]) == 0

# --- Analytics Module ---
def test_analytics_tracking(client):
    res = client.post("/api/v1/analytics/track", json={
        "visitorId": "visitor-abc-123",
        "type": "pageview",
        "path": "/services/ai-solutions",
        "duration": 45
    })
    assert res.status_code == 201
    assert res.get_json()["success"] is True

# --- Media Upload Module ---
def test_media_upload_validation(client):
    token = client.post("/api/v1/auth/login", json={"username": "testadmin", "password": "adminpass123"}).get_json()["token"]

    # Missing file
    res = client.post("/api/v1/media/upload", headers={"X-Admin-Token": token})
    assert res.status_code == 400

    # Invalid extension (e.g. php executable)
    data = {'file': (io.BytesIO(b"<?php echo 1; ?>"), 'malicious.php')}
    res = client.post("/api/v1/media/upload", headers={"X-Admin-Token": token}, data=data, content_type='multipart/form-data')
    assert res.status_code == 400
    assert res.get_json()["error"]["code"] == "INVALID_FILE_TYPE"

# --- Trends Module ---
def test_trends_endpoints(client):
    # Public GET
    res = client.get("/api/v1/trends")
    assert res.status_code == 200

    # Auto-post unauthorized
    res = client.get("/api/v1/trends/auto_post?key=wrongkey")
    assert res.status_code == 401

# --- Primatera ERP Module ---
def test_primatera_auth_and_records(client):
    # Valid login
    res = client.post("/api/v1/primatera/auth", json={
        "username": "userdemo1",
        "password": "password123"
    })
    assert res.status_code == 200
    assert res.get_json()["success"] is True

    # Invalid login
    bad_res = client.post("/api/v1/primatera/auth", json={
        "username": "userdemo1",
        "password": "wrong"
    })
    assert bad_res.status_code == 401

    # Add record
    rec_res = client.post("/api/v1/primatera/records", json={
        "date": "2026-09-05",
        "flock_id": "Flock-A1",
        "feed_consumed_kg": 150.5,
        "mortality_count": 2,
        "body_weight_grams": 1800
    })
    assert rec_res.status_code == 201

    # Get records
    list_res = client.get("/api/v1/primatera/records")
    assert list_res.status_code == 200
    records = list_res.get_json()["records"]
    assert len(records) == 1
    assert records[0]["flock_id"] == "Flock-A1"
