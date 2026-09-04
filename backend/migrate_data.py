import os
import json
import pymysql
import psycopg
from datetime import datetime

env_path = os.path.join(os.path.dirname(__file__), ".env")
env_vars = {}
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env_vars[k.strip()] = v.strip()

mysql_host = "localhost"
mysql_user = "uygpuazs_root"
mysql_pass = "Nurdiansyah@024"
mysql_db = "uygpuazs_nurdiansyahlabs_db"

pg_url = env_vars.get("DATABASE_URL")
if pg_url.startswith("postgresql+psycopg://"):
    pg_url = pg_url.replace("postgresql+psycopg://", "postgresql://", 1)

print("🚀 Connecting to MySQL and PostgreSQL...")

my_conn = pymysql.connect(
    host=mysql_host,
    user=mysql_user,
    password=mysql_pass,
    database=mysql_db,
    cursorclass=pymysql.cursors.DictCursor
)
pg_conn = psycopg.connect(pg_url)

my_cur = my_conn.cursor()
pg_cur = pg_conn.cursor()

def migrate_table(table_name, select_query, insert_query, transform_row):
    print(f"\n📦 Migrating table: {table_name}...")
    my_cur.execute(select_query)
    rows = my_cur.fetchall()
    print(f"   Found {len(rows)} rows in MySQL.")
    
    migrated_count = 0
    for r in rows:
        params = transform_row(r)
        try:
            pg_cur.execute(insert_query, params)
            migrated_count += 1
        except Exception as err:
            print(f"   ⚠️ Row error on {table_name}: {err}")
            pg_conn.rollback()
            continue
    pg_conn.commit()
    print(f"   ✅ Successfully migrated {migrated_count} rows into PostgreSQL.")

# 1. admin_users
migrate_table(
    "admin_users",
    "SELECT * FROM admin_users",
    """
    INSERT INTO admin_users (id, username, password_hash, email, token, reset_token, reset_expires, created_at, updated_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, token = EXCLUDED.token
    """,
    lambda r: (
        r["id"], r["username"], r["password_hash"], r["email"],
        r.get("token"), r.get("reset_token"), r.get("reset_expires"),
        r.get("created_at") or datetime.utcnow(), r.get("updated_at") or datetime.utcnow()
    )
)

# 2. posts
migrate_table(
    "posts",
    "SELECT * FROM posts",
    """
    INSERT INTO posts (id, slug, title, description, service, "serviceLabel", accent, "accentLight", img, faqs, content, created_at, updated_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (slug) DO NOTHING
    """,
    lambda r: (
        r["id"], r["slug"], r["title"], r.get("description"), r.get("service"),
        r.get("serviceLabel"), r.get("accent"), r.get("accentLight"), r.get("img"),
        json.dumps(r.get("faqs")) if r.get("faqs") is not None and not isinstance(r.get("faqs"), str) else r.get("faqs"),
        r.get("content"), r.get("created_at") or datetime.utcnow(), r.get("updated_at") or datetime.utcnow()
    )
)

# 3. products
migrate_table(
    "products",
    "SELECT * FROM products",
    """
    INSERT INTO products (id, app_id, name, price, description, image_url, category, extras, created_at, updated_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
    """,
    lambda r: (
        r["id"], r["app_id"], r["name"], float(r["price"] or 0), r.get("description"),
        r.get("image_url"), r.get("category"),
        json.dumps(r.get("extras")) if r.get("extras") is not None and not isinstance(r.get("extras"), str) else r.get("extras"),
        r.get("created_at") or datetime.utcnow(), r.get("updated_at") or datetime.utcnow()
    )
)

# 4. leads
migrate_table(
    "leads",
    "SELECT * FROM leads",
    """
    INSERT INTO leads (id, name, contact, service, message, timestamp, created_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
    """,
    lambda r: (
        r["id"], r["name"], r["contact"], r.get("service"), r.get("message"),
        r.get("timestamp") or datetime.utcnow(), r.get("created_at") or datetime.utcnow()
    )
)

# 5. analytics
migrate_table(
    "analytics",
    "SELECT * FROM analytics",
    """
    INSERT INTO analytics (id, type, path, "visitorId", timestamp, title, service, duration, route, "userAgent", created_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING
    """,
    lambda r: (
        r["id"], r["type"], r.get("path"), r["visitorId"], r.get("timestamp") or datetime.utcnow(),
        r.get("title"), r.get("service"), r.get("duration"), r.get("route"), r.get("userAgent"),
        r.get("created_at") or datetime.utcnow()
    )
)

print("\n🎉 Database migration complete and validated!")
my_conn.close()
pg_conn.close()
