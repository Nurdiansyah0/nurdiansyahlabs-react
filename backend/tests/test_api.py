import pytest
from app import create_app
from app.core.config import Config
from app.core.database import db
from app.core.security import hash_password
from app.modules.auth.models import AdminUser

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
        db.session.commit()

        yield app.test_client()
        db.drop_all()

def test_health_check(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["status"] == "ok"
    assert data["data"]["database"] == "ok"

def test_auth_login_and_verify(client):
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

    bad_res = client.get("/api/v1/auth/verify", headers={"X-Admin-Token": "bad-token"})
    assert bad_res.status_code == 401

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
    create_res = client.post("/api/v1/posts", json=post_payload, headers={"X-Admin-Token": token})
    assert create_res.status_code == 201

    read_res = client.get("/api/v1/posts/uji-coba-post-python")
    assert read_res.status_code == 200
    assert read_res.get_json()["title"] == "Uji Coba Post Python"

    all_res = client.get("/api/v1/posts")
    assert all_res.status_code == 200
    assert len(all_res.get_json()) == 1

def test_leads_submission(client):
    lead_payload = {
        "name": "Budi Santoso",
        "contact": "081234567890",
        "service": "Mobile Apps",
        "message": "Halo, saya butuh konsultasi pembuatan aplikasi."
    }
    res = client.post("/api/v1/leads", json=lead_payload)
    assert res.status_code == 201
    assert res.get_json()["success"] is True

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

def test_analytics_tracking(client):
    res = client.post("/api/v1/analytics/track", json={
        "visitorId": "visitor-abc-123",
        "type": "pageview",
        "path": "/services/ai-solutions",
        "duration": 45
    })
    assert res.status_code == 201
    assert res.get_json()["success"] is True
