#!/usr/bin/env python3
"""
ml_compute.py — Standalone RecoEngine (cPanel / proc_open mode)
===============================================================
This script is called by PHP via proc_open() on each request.
No server needed — PHP spawns this process, it computes, outputs JSON, exits.

Input  : JSON string from stdin
Output : JSON string to stdout

Usage by PHP:
    proc_open('python3 /path/to/ml_compute.py', pipes, ...)
    fwrite($pipes[0], json_encode($request))
    fclose($pipes[0])
    $result = stream_get_contents($pipes[1])
"""
from __future__ import annotations
import sys
import json
import math
import logging
import os
import sqlite3

logging.basicConfig(stream=sys.stderr, level=logging.WARNING)

# ── SQLite Vector Cache ────────────────────────────────────────────────────────
_CACHE_DIR = os.path.join(os.path.dirname(__file__), 'cache')
_VECTOR_DB  = os.path.join(_CACHE_DIR, 'ai_cache.sqlite')

def _db_conn():
    os.makedirs(_CACHE_DIR, exist_ok=True)
    conn = sqlite3.connect(_VECTOR_DB)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tfidf_cache (
            key   TEXT PRIMARY KEY,
            value TEXT
        )
    ''')
    return conn

def _cache_get(key):
    try:
        with _db_conn() as c:
            row = c.execute('SELECT value FROM tfidf_cache WHERE key=?', (key,)).fetchone()
            return json.loads(row[0]) if row else None
    except Exception:
        return None

def _cache_set(key, value):
    try:
        with _db_conn() as c:
            c.execute('INSERT OR REPLACE INTO tfidf_cache (key, value) VALUES (?,?)',
                      (key, json.dumps(value)))
    except Exception:
        pass

# ── Same product catalog & users as main.py ────────────────────────────────────
PRODUCTS: list[dict] = [
    {"id": 1,  "name": "MacBook Pro M3 14\"",    "category": "Laptop",     "brand": "Apple",      "price": 28000000, "rating": 4.9, "sold": 1200, "tags": "laptop ultrabook profesional desainer video editing performance", "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"},
    {"id": 2,  "name": "ASUS ROG Strix G16",      "category": "Laptop",     "brand": "ASUS",       "price": 22000000, "rating": 4.7, "sold": 980,  "tags": "laptop gaming RGB performa tinggi RTX", "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"},
    {"id": 3,  "name": "Lenovo ThinkPad X1",      "category": "Laptop",     "brand": "Lenovo",     "price": 19000000, "rating": 4.6, "sold": 750,  "tags": "laptop bisnis tipis ringan profesional VPN", "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"},
    {"id": 4,  "name": "iPhone 15 Pro Max",       "category": "Smartphone", "brand": "Apple",      "price": 23000000, "rating": 4.8, "sold": 3200, "tags": "smartphone premium kamera video titanium iOS", "imageUrl": "https://images.unsplash.com/photo-1695048133142-1a20a5bf616f?w=500&q=80"},
    {"id": 5,  "name": "Samsung Galaxy S24 Ultra","category": "Smartphone", "brand": "Samsung",    "price": 21000000, "rating": 4.7, "sold": 2800, "tags": "smartphone android kamera zoom S-Pen amoled", "imageUrl": "https://images.unsplash.com/photo-1695048133142-1a20a5bf616f?w=500&q=80"},
    {"id": 6,  "name": "Xiaomi 14 Pro",           "category": "Smartphone", "brand": "Xiaomi",     "price": 12000000, "rating": 4.5, "sold": 1500, "tags": "smartphone kamera leica performa snapdragon", "imageUrl": "https://images.unsplash.com/photo-1695048133142-1a20a5bf616f?w=500&q=80"},
    {"id": 7,  "name": "Sony WH-1000XM5",         "category": "Audio",      "brand": "Sony",       "price": 5500000,  "rating": 4.9, "sold": 2100, "tags": "headphone noise cancelling wireless premium audio", "imageUrl": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"},
    {"id": 8,  "name": "AirPods Pro 2",           "category": "Audio",      "brand": "Apple",      "price": 4200000,  "rating": 4.8, "sold": 4200, "tags": "earphone tws anc apple wireless", "imageUrl": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"},
    {"id": 9,  "name": "Samsung Galaxy Buds3",    "category": "Audio",      "brand": "Samsung",    "price": 2100000,  "rating": 4.4, "sold": 880,  "tags": "earphone tws anc android wireless", "imageUrl": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"},
    {"id": 10, "name": "Dell UltraSharp 4K 27\"", "category": "Monitor",    "brand": "Dell",       "price": 9800000,  "rating": 4.8, "sold": 420,  "tags": "monitor 4k desainer video editing colour accurate IPS", "imageUrl": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"},
    {"id": 11, "name": "LG UltraWide 34\"",       "category": "Monitor",    "brand": "LG",         "price": 6500000,  "rating": 4.6, "sold": 310,  "tags": "monitor ultrawide gaming produktivitas curved", "imageUrl": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"},
    {"id": 12, "name": "Logitech MX Master 3",    "category": "Aksesori",   "brand": "Logitech",   "price": 1200000,  "rating": 4.8, "sold": 1800, "tags": "mouse ergonomis wireless kerja desain produktivitas", "imageUrl": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"},
    {"id": 13, "name": "Keychron Q1 Pro",         "category": "Aksesori",   "brand": "Keychron",   "price": 1800000,  "rating": 4.7, "sold": 720,  "tags": "keyboard mechanical wireless QMK hotswap", "imageUrl": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"},
    {"id": 14, "name": "iPad Air M2",             "category": "Tablet",     "brand": "Apple",      "price": 11500000, "rating": 4.8, "sold": 1600, "tags": "tablet apple pencil productivity design draw", "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"},
    {"id": 15, "name": "Samsung Tab S9+",         "category": "Tablet",     "brand": "Samsung",    "price": 13000000, "rating": 4.6, "sold": 900,  "tags": "tablet android amoled gaming note productivity", "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"},
    {"id": 16, "name": "Nike Air Max 270",        "category": "Sepatu",     "brand": "Nike",       "price": 1800000,  "rating": 4.6, "sold": 4500, "tags": "sepatu sneakers kasual sport comfortable cushion", "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"},
    {"id": 17, "name": "Adidas Ultraboost 23",    "category": "Sepatu",     "brand": "Adidas",     "price": 2400000,  "rating": 4.7, "sold": 3200, "tags": "sepatu lari running sport cushion boost", "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"},
    {"id": 18, "name": "New Balance 574",         "category": "Sepatu",     "brand": "New Balance","price": 1500000,  "rating": 4.5, "sold": 2100, "tags": "sepatu sneakers retro kasual santai", "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"},
    {"id": 19, "name": "Uniqlo Smart Ankle Pants","category": "Celana",     "brand": "Uniqlo",     "price": 499000,   "rating": 4.7, "sold": 8900, "tags": "celana kantoran formal slim fit kasual", "imageUrl": "https://images.unsplash.com/photo-1624378439575-d1ead6af00f6?w=500&q=80"},
    {"id": 20, "name": "H&M Linen Shirt",         "category": "Kemeja",     "brand": "H&M",        "price": 299000,   "rating": 4.3, "sold": 5600, "tags": "kemeja santai linen kasual summer tipis", "imageUrl": "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80"},
    {"id": 21, "name": "Fossil Gen 6E Smartwatch","category": "Jam Tangan", "brand": "Fossil",     "price": 3200000,  "rating": 4.4, "sold": 680,  "tags": "jam tangan smartwatch android wear fitness tracker", "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"},
    {"id": 22, "name": "Apple Watch Series 9",    "category": "Jam Tangan", "brand": "Apple",      "price": 6500000,  "rating": 4.8, "sold": 2200, "tags": "smartwatch health fitness tracking apple ECG", "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"},
    {"id": 23, "name": "Garmin Forerunner 965",   "category": "Jam Tangan", "brand": "Garmin",     "price": 9800000,  "rating": 4.7, "sold": 420,  "tags": "smartwatch lari GPS triatlon olahraga sport", "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"},
    {"id": 24, "name": "Samsonite T-Tech 22\"",   "category": "Koper",      "brand": "Samsonite",  "price": 2800000,  "rating": 4.6, "sold": 890,  "tags": "koper travel ringan bisnis hard case", "imageUrl": "https://images.unsplash.com/photo-1551021469-6d60cabe4154?w=500&q=80"},
    {"id": 25, "name": "Polo Ralph Lauren Tee",   "category": "Kaos",       "brand": "Polo RL",    "price": 699000,   "rating": 4.5, "sold": 3200, "tags": "kaos polo kasual premium cotton brand", "imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"},
    {"id": 26, "name": "Dyson V15 Detect",        "category": "Elektronik Rumah","brand": "Dyson", "price": 8500000,  "rating": 4.8, "sold": 950,  "tags": "vacuum cleaner cordless powerful filter HEPA", "imageUrl": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80"},
    {"id": 27, "name": "Philips Air Purifier 800","category": "Elektronik Rumah","brand": "Philips","price": 2800000, "rating": 4.6, "sold": 1200, "tags": "air purifier HEPA filter debu polusi ruangan", "imageUrl": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80"},
    {"id": 28, "name": "Instant Pot Duo 7-in-1",  "category": "Dapur",      "brand": "Instant Pot","price": 1900000,  "rating": 4.7, "sold": 2800, "tags": "pressure cooker slow cooker rice cooker multi cooker", "imageUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80"},
    {"id": 29, "name": "Xiaomi Robot Vacuum S10+","category": "Elektronik Rumah","brand": "Xiaomi","price": 5500000,  "rating": 4.5, "sold": 720,  "tags": "robot vacuum cleaner auto mapping mop laser", "imageUrl": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80"},
    {"id": 30, "name": "Nespresso Vertuo Next",   "category": "Dapur",      "brand": "Nespresso",  "price": 2100000,  "rating": 4.7, "sold": 1500, "tags": "kopi espresso mesin capsule coffee barista", "imageUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80"},
    {"id": 31, "name": "KitchenAid Stand Mixer",  "category": "Dapur",      "brand": "KitchenAid", "price": 6500000,  "rating": 4.9, "sold": 380,  "tags": "mixer baking kue roti profesional premium", "imageUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80"},
    {"id": 32, "name": "Kettlebell 16kg",          "category": "Olahraga",   "brand": "Rogue",      "price": 490000,   "rating": 4.6, "sold": 2200, "tags": "gym weight training fitness kettle bell", "imageUrl": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"},
    {"id": 33, "name": "Yoga Mat Manduka PRO",     "category": "Olahraga",   "brand": "Manduka",    "price": 890000,   "rating": 4.8, "sold": 1800, "tags": "yoga mat tebal anti-slip pilates stretching", "imageUrl": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"},
    {"id": 34, "name": "Whey Protein Optimum Gold","category": "Suplemen",   "brand": "ON",         "price": 580000,   "rating": 4.7, "sold": 5600, "tags": "protein whey supplement gym muscle mass", "imageUrl": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80"},
    {"id": 35, "name": "BCAA Universal Nutrition", "category": "Suplemen",   "brand": "Universal",  "price": 280000,   "rating": 4.4, "sold": 3100, "tags": "bcaa suplemen recovery otot fitness gym", "imageUrl": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80"},
    {"id": 36, "name": "Jump Rope Speed Cable",   "category": "Olahraga",   "brand": "RPM",        "price": 350000,   "rating": 4.6, "sold": 920,  "tags": "jump rope lompat tali cardio fitness speed", "imageUrl": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"},
    {"id": 37, "name": "Hands-On ML (Géron)",      "category": "Buku",       "brand": "O'Reilly",   "price": 480000,   "rating": 4.9, "sold": 1200, "tags": "buku machine learning python scikit tensorflow keras", "imageUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80"},
    {"id": 38, "name": "Clean Code (Martin)",      "category": "Buku",       "brand": "Prentice",   "price": 390000,   "rating": 4.8, "sold": 980,  "tags": "buku programming software engineering best practices", "imageUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80"},
    {"id": 39, "name": "Design Patterns (GoF)",    "category": "Buku",       "brand": "A-W",        "price": 420000,   "rating": 4.7, "sold": 640,  "tags": "buku programming desain arsitektur software patterns", "imageUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80"},
    {"id": 40, "name": "Atomic Habits (Clear)",    "category": "Buku",       "brand": "Avery",      "price": 109000,   "rating": 4.9, "sold": 9800, "tags": "buku produktivitas kebiasaan pengembangan diri motivasi", "imageUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80"},
    {"id": 41, "name": "Sony A7 IV Mirrorless",   "category": "Kamera",     "brand": "Sony",       "price": 35000000, "rating": 4.9, "sold": 280,  "tags": "kamera mirrorless full frame video profesional photography", "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"},
    {"id": 42, "name": "Canon EOS R50",            "category": "Kamera",     "brand": "Canon",      "price": 14000000, "rating": 4.6, "sold": 650,  "tags": "kamera mirrorless APS-C vlogging konten kreator", "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"},
    {"id": 43, "name": "GoPro Hero 12 Black",      "category": "Kamera",     "brand": "GoPro",      "price": 6500000,  "rating": 4.5, "sold": 1100, "tags": "kamera action waterproof vlog sport outdoor 5.3K", "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"},
    {"id": 44, "name": "DJI Osmo Pocket 3",        "category": "Kamera",     "brand": "DJI",        "price": 6800000,  "rating": 4.7, "sold": 820,  "tags": "kamera gimbal stabilizer vlog video travel konten", "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"},
    {"id": 45, "name": "PS5 Slim",                 "category": "Gaming",     "brand": "Sony",       "price": 8500000,  "rating": 4.9, "sold": 1800, "tags": "konsol gaming playstation 5 4K 120fps SSD fast", "imageUrl": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80"},
    {"id": 46, "name": "Xbox Series X",            "category": "Gaming",     "brand": "Microsoft",  "price": 8200000,  "rating": 4.7, "sold": 950,  "tags": "konsol gaming xbox 4K game pass cloud", "imageUrl": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80"},
    {"id": 47, "name": "Nintendo Switch OLED",     "category": "Gaming",     "brand": "Nintendo",   "price": 6200000,  "rating": 4.8, "sold": 2200, "tags": "konsol gaming portabel handheld casual family", "imageUrl": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80"},
    {"id": 48, "name": "Razer DeathAdder V3",      "category": "Gaming",     "brand": "Razer",      "price": 1200000,  "rating": 4.6, "sold": 1400, "tags": "mouse gaming FPS ultra lightweight akurasi tinggi", "imageUrl": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80"},
    {"id": 49, "name": "Corsair K65 Mini TKL",     "category": "Gaming",     "brand": "Corsair",    "price": 980000,   "rating": 4.5, "sold": 820,  "tags": "keyboard gaming mechanical tkl mini compact RGB", "imageUrl": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80"},
    {"id": 50, "name": "ASUS ROG Swift 240Hz",     "category": "Monitor",    "brand": "ASUS",       "price": 7200000,  "rating": 4.7, "sold": 490,  "tags": "monitor gaming 240Hz 1440p IPS fast response esports", "imageUrl": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"},
]

USERS: list[dict] = [
    {"id": "U001", "name": "Budi – Developer",       "persona": "Tech enthusiast, remote worker",  "history": [1, 3, 12, 13, 37, 38]},
    {"id": "U002", "name": "Siti – Gamer",            "persona": "Hardcore gamer, streams on YT",   "history": [2, 45, 48, 49, 50, 6]},
    {"id": "U003", "name": "Ahmad – Content Creator", "persona": "YouTuber, travel photographer",    "history": [4, 41, 43, 44, 8, 22]},
    {"id": "U004", "name": "Dewi – Fitness Enthusiast","persona":"Daily gym, health-conscious",      "history": [17, 32, 33, 34, 35, 23]},
    {"id": "U005", "name": "Rizki – Student",         "persona": "Uni student, budget-conscious",   "history": [6, 18, 20, 40, 37, 36]},
    {"id": "U006", "name": "Indah – Home Chef",       "persona": "Cooking enthusiast, homemaker",   "history": [28, 30, 31, 26, 25, 40]},
    {"id": "U007", "name": "Fauzan – Designer",       "persona": "UI/UX designer, Mac user",       "history": [1, 10, 14, 12, 7, 39]},
    {"id": "U008", "name": "Ratna – Executive",       "persona": "Business traveller, Apple lover", "history": [4, 22, 8, 3, 24, 25]},
]

PID_IDX = {p["id"]: i for i, p in enumerate(PRODUCTS)}


# ── Lightweight TF-IDF (no sklearn) ───────────────────────────────────────────
def build_tfidf():
    """Pure-Python TF-IDF — result persisted to SQLite so next spawn is <1ms."""
    cached = _cache_get("tfidf_vectors_v1")
    if cached:
        return cached

    import math
    corpus = [f"{p['name']} {p['category']} {p['brand']} {p['tags']}" for p in PRODUCTS]
    tokenized = [doc.lower().split() for doc in corpus]
    df: dict[str, int] = {}
    for tokens in tokenized:
        for t in set(tokens):
            df[t] = df.get(t, 0) + 1
    N = len(tokenized)
    idf = {t: math.log(N / max(v, 1)) for t, v in df.items()}
    vectors: list[dict[str, float]] = []
    for tokens in tokenized:
        tf: dict[str, float] = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1
        length = len(tokens)
        vec = {t: (count / length) * idf.get(t, 0) for t, count in tf.items()}
        norm = math.sqrt(sum(v * v for v in vec.values())) or 1
        vectors.append({t: v / norm for t, v in vec.items()})

    _cache_set("tfidf_vectors_v1", vectors)  # Persist for next spawn
    return vectors


def cosine(a: dict, b: dict) -> float:
    return sum(a.get(t, 0) * b.get(t, 0) for t in a)


TFIDF = build_tfidf()



def content_score(history_ids: list[int]) -> list[float]:
    if not history_ids:
        return [p["rating"] * math.log1p(p["sold"]) for p in PRODUCTS]
    hist_idx = [PID_IDX[pid] for pid in history_ids if pid in PID_IDX]
    scores = []
    for i in range(len(PRODUCTS)):
        avg = sum(cosine(TFIDF[h], TFIDF[i]) for h in hist_idx) / len(hist_idx)
        scores.append(avg)
    return scores


def popularity_score() -> list[float]:
    """Fallback: normalised popularity = rating * log(sold)"""
    raw = [p["rating"] * math.log1p(p["sold"]) for p in PRODUCTS]
    mx = max(raw) or 1
    return [v / mx for v in raw]


def normalise(scores: list[float]) -> list[float]:
    mn, mx = min(scores), max(scores)
    rng = mx - mn or 1
    return [(v - mn) / rng for v in scores]


def recommend(user_id: str, limit: int, category_filter: str | None, exclude_seen: bool) -> list[dict]:
    user = next((u for u in USERS if u["id"] == user_id), None)
    if not user:
        return []

    history = set(user["history"])
    cb = normalise(content_score(user["history"]))
    pop = popularity_score()

    # Collaborative proxy: users who share category preferences
    history_cats = {PRODUCTS[PID_IDX[pid]]["category"] for pid in user["history"] if pid in PID_IDX}
    cf = []
    for p in PRODUCTS:
        score = 0.7 if p["category"] in history_cats else 0.3
        score += p["rating"] / 5 * 0.3
        cf.append(score)
    cf_norm = normalise(cf)

    # Hybrid: 55% CF + 45% CB
    hybrid = [0.55 * cf_norm[i] + 0.45 * cb[i] for i in range(len(PRODUCTS))]

    results = []
    ranked = sorted(range(len(PRODUCTS)), key=lambda i: hybrid[i], reverse=True)
    for idx in ranked:
        p = PRODUCTS[idx]
        if exclude_seen and p["id"] in history:
            continue
        if category_filter and p["category"].lower() != category_filter.lower():
            continue
        results.append({
            **p,
            "score": round(hybrid[idx], 4),
            "reason": _reason(p, history_cats, hybrid[idx], cb[idx]),
            "method_used": "hybrid-serverless",
        })
        if len(results) >= limit:
            break
    return results


def _reason(p: dict, history_cats: set, score: float, cb: float) -> str:
    if p["category"] in history_cats and score > 0.6:
        return f"Populer di kalangan pengguna dengan profil serupa"
    elif p["category"] in history_cats:
        return f"Mirip dengan {p['category']} yang pernah Anda lihat"
    elif p["rating"] >= 4.8:
        return f"Rating tertinggi di kategori {p['category']}"
    else:
        return f"Trending — {p['sold']:,} terjual"


def handle(req: dict) -> dict:
    action = req.get("action", "recommend")

    if action == "health":
        return {"status": "ok", "service": "RecoEngine-Serverless", "version": "1.0.0",
                "model": "Content-Based TF-IDF + CF-Proxy (serverless mode)",
                "products": len(PRODUCTS), "users": len(USERS)}

    elif action == "products":
        cat = req.get("category", "")
        items = [p for p in PRODUCTS if not cat or p["category"].lower() == cat.lower()]
        return {"status": "success", "data": items[:req.get("limit", 50)]}

    elif action == "categories":
        return {"status": "success", "data": sorted(set(p["category"] for p in PRODUCTS))}

    elif action == "users":
        return {"status": "success", "data": USERS}

    elif action == "recommend":
        uid = req.get("user_id", "U001")
        limit = int(req.get("limit", 8))
        cat = req.get("category_filter")
        excl = bool(req.get("exclude_seen", True))
        data = recommend(uid, limit, cat, excl)
        return {"status": "success", "user_id": uid, "method": "hybrid-serverless",
                "count": len(data), "data": data}

    elif action == "feedback":
        # Serverless mode: feedback is stateless, just return immediate re-rank
        uid = req.get("user_id", "U001")
        data = recommend(uid, 4, None, True)
        return {"status": "success", "message": "Feedback noted (serverless mode)",
                "updated_recommendations": data}

    elif action == "explain":
        pid = int(req.get("product_id", 1))
        uid = req.get("user_id", "U001")
        prod = next((p for p in PRODUCTS if p["id"] == pid), None)
        if not prod:
            return {"error": "Product not found"}
        idx = PID_IDX.get(pid, 0)
        # Top 3 similar by content
        sims = [(i, cosine(TFIDF[idx], TFIDF[i])) for i in range(len(PRODUCTS)) if i != idx]
        sims.sort(key=lambda x: x[1], reverse=True)
        similar = [PRODUCTS[i] for i, _ in sims[:3]]
        user = next((u for u in USERS if u["id"] == uid), USERS[0])
        history_cats = {PRODUCTS[PID_IDX[pid2]]["category"] for pid2 in user["history"] if pid2 in PID_IDX}
        pop_rank = sorted(PRODUCTS, key=lambda x: x["sold"], reverse=True).index(prod) + 1
        return {
            "product": prod,
            "cf_score": round(cosine(TFIDF[idx], TFIDF[0]), 4),
            "top_similar_products": similar,
            "explanation": {
                "category_match": prod["category"] in history_cats,
                "brand_match": prod["brand"] in {PRODUCTS[PID_IDX[pid2]]["brand"] for pid2 in user["history"] if pid2 in PID_IDX},
                "popularity_rank": pop_rank,
            }
        }

    return {"error": f"Unknown action: {action}"}


if __name__ == "__main__":
    try:
        raw = sys.stdin.read().strip()
        req = json.loads(raw) if raw else {}
        result = handle(req)
        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()
    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}))
        sys.stdout.flush()
        sys.exit(1)
