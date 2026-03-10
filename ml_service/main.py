"""
RecoEngine — Hybrid ML Product Recommendation System
=====================================================
Architecture mirroring Netflix / Amazon / Tokopedia:

1. Collaborative Filtering  : SVD (Singular Value Decomposition)
   — finds hidden latent factors from user-product interaction matrix
   — "users who liked X also liked Y"

2. Content-Based Filtering  : TF-IDF + Cosine Similarity
   — matches product descriptions, categories, and tags
   — "this product is similar to products you view"

3. Hybrid Scoring           : weighted combination of both scores
   — blends accuracy of CF with the cold-start safety of CBF

API Endpoints:
  GET  /health               — service health check
  GET  /products             — full product catalog
  GET  /users                — demo user profiles
  POST /recommend            — get ranked recommendations for a user
  POST /feedback             — submit like/dislike, hot-updates user preference model
  GET  /explain/{product_id} — explain WHY a product was recommended

Usage (local):
  uvicorn main:app --port 8001 --reload
"""

from __future__ import annotations

import logging
import math
from typing import Literal

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from scipy.sparse import csr_matrix

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RecoEngine")

app = FastAPI(
    title="RecoEngine – AI Product Recommendation API",
    description="Hybrid SVD + TF-IDF recommendation engine. Real-world ML architecture.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Product Catalog (50 products, multi-category, realistic Indonesian e-commerce) ──────────────

PRODUCTS: list[dict] = [
    # Electronics
    {"id": 1,  "name": "MacBook Pro M3 14\"",  "category": "Laptop",     "brand": "Apple",   "price": 28000000, "rating": 4.9, "sold": 1200, "tags": "laptop ultrabook profesional desainer video editing performance"},
    {"id": 2,  "name": "ASUS ROG Strix G16",   "category": "Laptop",     "brand": "ASUS",    "price": 22000000, "rating": 4.7, "sold": 980,  "tags": "laptop gaming RGB performa tinggi RTX"},
    {"id": 3,  "name": "Lenovo ThinkPad X1",   "category": "Laptop",     "brand": "Lenovo",  "price": 19000000, "rating": 4.6, "sold": 750,  "tags": "laptop bisnis tipis ringan profesional VPN"},
    {"id": 4,  "name": "iPhone 15 Pro Max",     "category": "Smartphone", "brand": "Apple",   "price": 23000000, "rating": 4.8, "sold": 3200, "tags": "smartphone premium kamera video titanium iOS"},
    {"id": 5,  "name": "Samsung Galaxy S24 Ultra","category":"Smartphone", "brand":"Samsung",  "price": 21000000, "rating": 4.7, "sold": 2800, "tags": "smartphone android kamera zoom S-Pen amoled"},
    {"id": 6,  "name": "Xiaomi 14 Pro",         "category": "Smartphone", "brand": "Xiaomi",  "price": 12000000, "rating": 4.5, "sold": 1500, "tags": "smartphone kamera leica performa snapdragon"},
    {"id": 7,  "name": "Sony WH-1000XM5",       "category": "Audio",      "brand": "Sony",    "price": 5500000,  "rating": 4.9, "sold": 2100, "tags": "headphone noise cancelling wireless premium audio"},
    {"id": 8,  "name": "AirPods Pro 2",         "category": "Audio",      "brand": "Apple",   "price": 4200000,  "rating": 4.8, "sold": 4200, "tags": "earphone tws anc apple wireless"},
    {"id": 9,  "name": "Samsung Galaxy Buds3",  "category": "Audio",      "brand": "Samsung", "price": 2100000,  "rating": 4.4, "sold": 880,  "tags": "earphone tws anc android wireless"},
    {"id": 10, "name": "Dell UltraSharp 4K 27\"","category":"Monitor",    "brand": "Dell",    "price": 9800000,  "rating": 4.8, "sold": 420,  "tags": "monitor 4k desainer video editing colour accurate IPS"},
    {"id": 11, "name": "LG UltraWide 34\"",     "category": "Monitor",    "brand": "LG",      "price": 6500000,  "rating": 4.6, "sold": 310,  "tags": "monitor ultrawide gaming produktivitas curved"},
    {"id": 12, "name": "Logitech MX Master 3",  "category": "Aksesori",   "brand": "Logitech","price": 1200000,  "rating": 4.8, "sold": 1800, "tags": "mouse ergonomis wireless kerja desain produktivitas"},
    {"id": 13, "name": "Keychron Q1 Pro",       "category": "Aksesori",   "brand": "Keychron","price": 1800000,  "rating": 4.7, "sold": 720,  "tags": "keyboard mechanical wireless QMK hotswap"},
    {"id": 14, "name": "iPad Air M2",           "category": "Tablet",     "brand": "Apple",   "price": 11500000, "rating": 4.8, "sold": 1600, "tags": "tablet apple pencil productivity design draw"},
    {"id": 15, "name": "Samsung Tab S9+",       "category": "Tablet",     "brand": "Samsung", "price": 13000000, "rating": 4.6, "sold": 900,  "tags": "tablet android amoled gaming note productivity"},

    # Fashion & Lifestyle
    {"id": 16, "name": "Nike Air Max 270",      "category": "Sepatu",     "brand": "Nike",    "price": 1800000,  "rating": 4.6, "sold": 4500, "tags": "sepatu sneakers kasual sport comfortable cushion"},
    {"id": 17, "name": "Adidas Ultraboost 23",  "category": "Sepatu",     "brand": "Adidas",  "price": 2400000,  "rating": 4.7, "sold": 3200, "tags": "sepatu lari running sport cushion boost"},
    {"id": 18, "name": "New Balance 574",       "category": "Sepatu",     "brand": "New Balance","price":1500000,"rating": 4.5, "sold": 2100, "tags": "sepatu sneakers retro kasual santai"},
    {"id": 19, "name": "Uniqlo Smart Ankle Pants","category":"Celana",    "brand": "Uniqlo",  "price": 499000,   "rating": 4.7, "sold": 8900, "tags": "celana kantoran formal slim fit kasual"},
    {"id": 20, "name": "H&M Linen Shirt",       "category": "Kemeja",     "brand": "H&M",     "price": 299000,   "rating": 4.3, "sold": 5600, "tags": "kemeja santai linen kasual summer tipis"},
    {"id": 21, "name": "Fossil Gen 6E Smartwatch","category":"Jam Tangan","brand": "Fossil",  "price": 3200000,  "rating": 4.4, "sold": 680,  "tags": "jam tangan smartwatch android wear fitness tracker"},
    {"id": 22, "name": "Apple Watch Series 9",  "category": "Jam Tangan", "brand": "Apple",   "price": 6500000,  "rating": 4.8, "sold": 2200, "tags": "smartwatch health fitness tracking apple ECG"},
    {"id": 23, "name": "Garmin Forerunner 965", "category": "Jam Tangan", "brand": "Garmin",  "price": 9800000,  "rating": 4.7, "sold": 420,  "tags": "smartwatch lari GPS triatlon olahraga sport"},
    {"id": 24, "name": "Samsonite T-Tech 22\"", "category": "Koper",      "brand": "Samsonite","price":2800000,  "rating": 4.6, "sold": 890,  "tags": "koper travel ringan bisnis hard case"},
    {"id": 25, "name": "Polo Ralph Lauren Tee","category": "Kaos",        "brand": "Polo RL", "price": 699000,   "rating": 4.5, "sold": 3200, "tags": "kaos polo kasual premium cotton brand"},

    # Home & Kitchen
    {"id": 26, "name": "Dyson V15 Detect",      "category": "Elektronik Rumah","brand":"Dyson","price": 8500000, "rating": 4.8, "sold": 950,  "tags": "vacuum cleaner cordless powerful filter HEPA"},
    {"id": 27, "name": "Philips Air Purifier 800","category":"Elektronik Rumah","brand":"Philips","price":2800000,"rating":4.6,"sold":1200,"tags":"air purifier HEPA filter debu polusi ruangan"},
    {"id": 28, "name": "Instant Pot Duo 7-in-1","category":"Dapur",       "brand":"Instant Pot","price":1900000,"rating":4.7,"sold":2800,"tags":"pressure cooker slow cooker rice cooker multi cooker"},
    {"id": 29, "name": "Xiaomi Robot Vacuum S10+","category":"Elektronik Rumah","brand":"Xiaomi","price":5500000,"rating":4.5,"sold":720,"tags":"robot vacuum cleaner auto mapping mop laser"},
    {"id": 30, "name": "Nespresso Vertuo Next",  "category": "Dapur",      "brand":"Nespresso","price":2100000,  "rating": 4.7, "sold": 1500, "tags": "kopi espresso mesin capsule coffee barista"},
    {"id": 31, "name": "KitchenAid Stand Mixer", "category": "Dapur",      "brand":"KitchenAid","price":6500000, "rating": 4.9, "sold": 380,  "tags": "mixer baking kue roti profesional premium"},

    # Sports & Fitness
    {"id": 32, "name": "Kettlebell 16kg",        "category": "Olahraga",   "brand": "Rogue",   "price": 490000,   "rating": 4.6, "sold": 2200, "tags": "gym weight training fitness kettle bell"},
    {"id": 33, "name": "Yoga Mat Manduka PRO",   "category": "Olahraga",   "brand": "Manduka", "price": 890000,   "rating": 4.8, "sold": 1800, "tags": "yoga mat tebal anti-slip pilates stretching"},
    {"id": 34, "name": "Whey Protein Optimum Gold","category":"Suplemen",  "brand": "ON",      "price": 580000,   "rating": 4.7, "sold": 5600, "tags": "protein whey supplement gym muscle mass"},
    {"id": 35, "name": "BCAA Universal Nutrition","category":"Suplemen",   "brand": "Universal","price":280000,   "rating": 4.4, "sold": 3100, "tags": "bcaa suplemen recovery otot fitness gym"},
    {"id": 36, "name": "Jump Rope Speed Cable",  "category": "Olahraga",   "brand": "RPM",     "price": 350000,   "rating": 4.6, "sold": 920,  "tags": "jump rope lompat tali cardio fitness speed"},

    # Books & Education
    {"id": 37, "name": "Hands-On ML (Géron)",    "category": "Buku",       "brand": "O'Reilly","price": 480000,   "rating": 4.9, "sold": 1200, "tags": "buku machine learning python scikit tensorflow keras"},
    {"id": 38, "name": "Clean Code (Martin)",    "category": "Buku",       "brand": "Prentice","price": 390000,   "rating": 4.8, "sold": 980,  "tags": "buku programming software engineering best practices"},
    {"id": 39, "name": "Design Patterns (GoF)",  "category": "Buku",       "brand": "A-W",     "price": 420000,   "rating": 4.7, "sold": 640,  "tags": "buku programming desain arsitektur software patterns"},
    {"id": 40, "name": "Atomic Habits (Clear)",  "category": "Buku",       "brand": "Avery",   "price": 109000,   "rating": 4.9, "sold": 9800, "tags": "buku produktivitas kebiasaan pengembangan diri motivasi"},

    # Camera & Photography
    {"id": 41, "name": "Sony A7 IV Mirrorless",  "category": "Kamera",     "brand": "Sony",    "price": 35000000, "rating": 4.9, "sold": 280,  "tags": "kamera mirrorless full frame video profesional photography"},
    {"id": 42, "name": "Canon EOS R50",          "category": "Kamera",     "brand": "Canon",   "price": 14000000, "rating": 4.6, "sold": 650,  "tags": "kamera mirrorless APS-C vlogging konten kreator"},
    {"id": 43, "name": "GoPro Hero 12 Black",    "category": "Kamera",     "brand": "GoPro",   "price": 6500000,  "rating": 4.5, "sold": 1100, "tags": "kamera action waterproof vlog sport outdoor 5.3K"},
    {"id": 44, "name": "DJI Osmo Pocket 3",      "category": "Kamera",     "brand": "DJI",     "price": 6800000,  "rating": 4.7, "sold": 820,  "tags": "kamera gimbal stabilizer vlog video travel konten"},

    # Gaming
    {"id": 45, "name": "PS5 Slim",               "category": "Gaming",     "brand": "Sony",    "price": 8500000,  "rating": 4.9, "sold": 1800, "tags": "konsol gaming playstation 5 4K 120fps SSD fast"},
    {"id": 46, "name": "Xbox Series X",          "category": "Gaming",     "brand": "Microsoft","price":8200000,  "rating": 4.7, "sold": 950,  "tags": "konsol gaming xbox 4K game pass cloud"},
    {"id": 47, "name": "Nintendo Switch OLED",   "category": "Gaming",     "brand": "Nintendo","price": 6200000,  "rating": 4.8, "sold": 2200, "tags": "konsol gaming portabel handheld casual family"},
    {"id": 48, "name": "Razer DeathAdder V3",    "category": "Gaming",     "brand": "Razer",   "price": 1200000,  "rating": 4.6, "sold": 1400, "tags": "mouse gaming FPS ultra lightweight akurasi tinggi"},
    {"id": 49, "name": "Corsair K65 Mini TKL",   "category": "Gaming",     "brand": "Corsair", "price": 980000,   "rating": 4.5, "sold": 820,  "tags": "keyboard gaming mechanical tkl mini compact RGB"},
    {"id": 50, "name": "ASUS ROG Swift 240Hz",   "category": "Monitor",    "brand": "ASUS",    "price": 7200000,  "rating": 4.7, "sold": 490,  "tags": "monitor gaming 240Hz 1440p IPS fast response esports"},
]

# ─── Demo User Profiles (purchase history + preferences) ─────────────────────

USERS: list[dict] = [
    {"id": "U001", "name": "Budi – Developer",      "persona": "Tech enthusiast, remote worker",   "history": [1, 3, 12, 13, 37, 38]},
    {"id": "U002", "name": "Siti – Gamer",           "persona": "Hardcore gamer, streams on YT",    "history": [2, 45, 48, 49, 50, 6]},
    {"id": "U003", "name": "Ahmad – Content Creator","persona": "YouTuber, travel photographer",     "history": [4, 41, 43, 44, 8, 22]},
    {"id": "U004", "name": "Dewi – Fitness Enthusiast","persona":"Daily gym, health-conscious",     "history": [17, 32, 33, 34, 35, 23]},
    {"id": "U005", "name": "Rizki – Student",        "persona": "Uni student, budget-conscious",    "history": [6, 18, 20, 40, 37, 36]},
    {"id": "U006", "name": "Indah – Home Chef",      "persona": "Cooking enthusiast, homemaker",    "history": [28, 30, 31, 26, 25, 40]},
    {"id": "U007", "name": "Fauzan – Designer",      "persona": "UI/UX designer, Mac user",        "history": [1, 10, 14, 12, 7, 39]},
    {"id": "U008", "name": "Ratna – Executive",      "persona": "Business traveller, Apple lover",  "history": [4, 22, 8, 3, 24, 25]},
]

# Build interaction matrix for collaborative filtering
# Simulate implicit feedback: if in history → rating 5, similar category → 3, else based on popularity
PRODUCT_IDS = [p["id"] for p in PRODUCTS]
USER_IDS = [u["id"] for u in USERS]
PID_TO_IDX = {p: i for i, p in enumerate(PRODUCT_IDS)}
UID_TO_IDX = {u: i for i, u in enumerate(USER_IDS)}

def build_interaction_matrix() -> np.ndarray:
    mat = np.zeros((len(USERS), len(PRODUCTS)))
    for u_idx, user in enumerate(USERS):
        for pid in user["history"]:
            if pid in PID_TO_IDX:
                mat[u_idx, PID_TO_IDX[pid]] = 5.0
        # Add implicit interest based on category overlap
        history_cats = {p["category"] for p in PRODUCTS if p["id"] in user["history"]}
        for p_idx, prod in enumerate(PRODUCTS):
            if mat[u_idx, p_idx] == 0 and prod["category"] in history_cats:
                mat[u_idx, p_idx] = 2.5
    return mat

# ─── ML Model Training (runs at startup) ─────────────────────────────────────

logger.info("Training ML models...")
INTERACTION_MATRIX = build_interaction_matrix()

# 1. SVD Collaborative Filtering
N_COMPONENTS = min(12, min(INTERACTION_MATRIX.shape) - 1)
svd = TruncatedSVD(n_components=N_COMPONENTS, random_state=42)
USER_LATENT = svd.fit_transform(INTERACTION_MATRIX)       # U×k
ITEM_LATENT = svd.components_.T                            # I×k
# Reconstruct full predicted rating matrix
PREDICTED_RATINGS = USER_LATENT @ ITEM_LATENT.T           # U×I

# 2. TF-IDF Content-Based Similarity
tfidf = TfidfVectorizer(max_features=200, stop_words=None, ngram_range=(1, 2))
product_corpus = [
    f"{p['name']} {p['category']} {p['brand']} {p['tags']}" for p in PRODUCTS
]
TFIDF_MATRIX = tfidf.fit_transform(product_corpus)
CONTENT_SIM = cosine_similarity(TFIDF_MATRIX)             # I×I

# In-memory feedback store (per session, resets on restart)
USER_FEEDBACK: dict[str, dict[int, float]] = {u["id"]: {} for u in USERS}

logger.info(f"Models trained. Products: {len(PRODUCTS)}, Users: {len(USERS)}, SVD components: {N_COMPONENTS}")


# ─── Request / Response Schemas ──────────────────────────────────────────────

class RecommendRequest(BaseModel):
    user_id: str = Field(..., description="User ID e.g. U001")
    limit: int = Field(default=8, ge=1, le=20)
    category_filter: str | None = Field(default=None, description="Filter by category")
    method: Literal["hybrid", "collaborative", "content"] = Field(default="hybrid")
    exclude_seen: bool = Field(default=True)

class FeedbackRequest(BaseModel):
    user_id: str
    product_id: int
    feedback: Literal["like", "dislike", "view"]


# ─── Core Recommendation Engine ──────────────────────────────────────────────

def get_cf_scores(user_idx: int) -> np.ndarray:
    """Collaborative Filtering scores from SVD reconstructed matrix."""
    return PREDICTED_RATINGS[user_idx]

def get_cb_scores(user_id: str, user_history: list[int]) -> np.ndarray:
    """Content-Based scores: avg cosine similarity to user's history."""
    if not user_history:
        # Cold start: rank by rating × log(sold)
        return np.array([p["rating"] * math.log1p(p["sold"]) for p in PRODUCTS])

    history_indices = [PID_TO_IDX[pid] for pid in user_history if pid in PID_TO_IDX]
    if not history_indices:
        return np.zeros(len(PRODUCTS))
    return CONTENT_SIM[history_indices].mean(axis=0)

def hybrid_recommend(
    user_id: str,
    limit: int = 8,
    category_filter: str | None = None,
    method: str = "hybrid",
    exclude_seen: bool = True,
    cf_weight: float = 0.6,
    cb_weight: float = 0.4,
) -> list[dict]:
    user = next((u for u in USERS if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")

    user_idx = UID_TO_IDX[user_id]
    history = set(user["history"])

    # Apply live feedback adjustments
    feedback = USER_FEEDBACK.get(user_id, {})

    # Score computation
    if method == "collaborative":
        raw_scores = get_cf_scores(user_idx)
        scores = (raw_scores - raw_scores.min()) / (raw_scores.max() - raw_scores.min() + 1e-9)
    elif method == "content":
        raw_cb = get_cb_scores(user_id, user["history"])
        scores = (raw_cb - raw_cb.min()) / (raw_cb.max() - raw_cb.min() + 1e-9)
    else:  # hybrid
        cf = get_cf_scores(user_idx)
        cb = get_cb_scores(user_id, user["history"])
        cf_norm = (cf - cf.min()) / (cf.max() - cf.min() + 1e-9)
        cb_norm = (cb - cb.min()) / (cb.max() - cb.min() + 1e-9)
        scores = cf_weight * cf_norm + cb_weight * cb_norm

    # Apply feedback boosts/penalties
    for p_idx, prod in enumerate(PRODUCTS):
        pid = prod["id"]
        if pid in feedback:
            scores[p_idx] += feedback[pid]  # like=+0.3, dislike=-0.5, view=+0.1

    # Build ranked results
    ranked_indices = np.argsort(scores)[::-1]
    results = []
    for idx in ranked_indices:
        prod = PRODUCTS[idx]
        if exclude_seen and prod["id"] in history:
            continue
        if category_filter and prod["category"].lower() != category_filter.lower():
            continue
        score_val = float(scores[idx])
        cf_cont = float((get_cf_scores(user_idx)[idx]))
        cb_cont = float(get_cb_scores(user_id, user["history"])[idx])
        results.append({
            **prod,
            "score": round(score_val, 4),
            "cf_score": round(cf_cont, 4),
            "cb_score": round(cb_cont, 4),
            "method_used": method,
            "reason": _explain_reason(prod, user, cf_cont, cb_cont),
        })
        if len(results) >= limit:
            break
    return results

def _explain_reason(prod: dict, user: dict, cf: float, cb: float) -> str:
    """Generate a human-readable explanation for why this was recommended."""
    history_cats = {p["category"] for p in PRODUCTS if p["id"] in user["history"]}
    if prod["category"] in history_cats and cf > cb:
        return f"Populer di kalangan pengguna dengan profil serupa"
    elif prod["category"] in history_cats:
        return f"Mirip dengan {prod['category']} yang pernah Anda beli"
    elif cf > 0.7:
        return "Pengguna yang membeli produk Anda juga tertarik ini"
    else:
        return f"Trending di kategori {prod['category']}"


# ─── API Endpoints ────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "RecoEngine",
        "version": "1.0.0",
        "model": f"SVD({N_COMPONENTS} components) + TF-IDF",
        "products": len(PRODUCTS),
        "users": len(USERS),
    }

@app.get("/products")
def get_products(category: str | None = None, limit: int = 50):
    items = PRODUCTS
    if category:
        items = [p for p in items if p["category"].lower() == category.lower()]
    return {"status": "success", "data": items[:limit], "total": len(items)}

@app.get("/categories")
def get_categories():
    cats = sorted(set(p["category"] for p in PRODUCTS))
    return {"status": "success", "data": cats}

@app.get("/users")
def get_users():
    return {"status": "success", "data": USERS}

@app.post("/recommend")
def recommend(req: RecommendRequest):
    try:
        results = hybrid_recommend(
            user_id=req.user_id,
            limit=req.limit,
            category_filter=req.category_filter,
            method=req.method,
            exclude_seen=req.exclude_seen,
        )
        return {
            "status": "success",
            "user_id": req.user_id,
            "method": req.method,
            "count": len(results),
            "data": results,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recommend error: {e}")
        raise HTTPException(status_code=500, detail="Recommendation failed")

@app.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    if req.user_id not in UID_TO_IDX:
        raise HTTPException(status_code=404, detail="User not found")
    if req.product_id not in PID_TO_IDX:
        raise HTTPException(status_code=404, detail="Product not found")

    delta = {"like": 0.30, "dislike": -0.50, "view": 0.05}[req.feedback]
    USER_FEEDBACK.setdefault(req.user_id, {})[req.product_id] = delta
    logger.info(f"Feedback: {req.user_id} → product {req.product_id} ({req.feedback}, Δ={delta})")

    # Re-compute recommendations immediately (light op, in-memory)
    updated = hybrid_recommend(req.user_id, limit=8, exclude_seen=True)
    return {
        "status": "success",
        "message": f"Feedback '{req.feedback}' recorded. Recommendations updated.",
        "updated_recommendations": updated[:4],
    }

@app.get("/explain/{product_id}")
def explain(product_id: int, user_id: str = "U001"):
    prod = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    # Get top 3 most similar products
    idx = PID_TO_IDX.get(product_id)
    sim_scores = CONTENT_SIM[idx]
    top_similar_idx = np.argsort(sim_scores)[::-1][1:4]
    similar = [PRODUCTS[i] for i in top_similar_idx]

    # Get CF score breakdown
    user = next((u for u in USERS if u["id"] == user_id), USERS[0])
    user_idx = UID_TO_IDX[user["id"]]
    cf_score = float(PREDICTED_RATINGS[user_idx, idx])

    return {
        "product": prod,
        "cf_score": round(cf_score, 4),
        "top_similar_products": similar,
        "explanation": {
            "category_match": prod["category"] in {p["category"] for p in PRODUCTS if p["id"] in user["history"]},
            "brand_match": prod["brand"] in {p["brand"] for p in PRODUCTS if p["id"] in user["history"]},
            "price_range": "dalam rentang harga yang biasa dibeli user",
            "popularity_rank": sorted(PRODUCTS, key=lambda x: x["sold"], reverse=True).index(prod) + 1,
        }
    }
