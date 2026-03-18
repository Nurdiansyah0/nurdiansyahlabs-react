#!/usr/bin/env python3
"""
NurdiansyahLabs - ML-Powered SEO Article Generator
Architecture:
  Mode 1 (GROQ_API_KEY set) → Groq LLM API (llama-3.1-8b-instant) - NO extra deps, pure urllib
  Mode 2 (offline fallback)  → Markov Chain NLG (pure Python, no deps)
  Mode 3 (last resort)       → Curated structured template

Usage: python3 generate_article.py <keyword> <volume> <language>
"""

import sys
import json
import os
import re
import random
import hashlib
import urllib.request
import urllib.error
from datetime import datetime

# ──────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────────
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"
GROQ_TIMEOUT = 15   # seconds


# ──────────────────────────────────────────────────────────────────────────────
# MODE 1: GROQ LLM API (Machine Learning - Real AI)
# ──────────────────────────────────────────────────────────────────────────────
def _groq_generate(keyword, volume, lang):
    """Call Groq's free API with llama-3.1-8b-instant. Pure urllib, zero extra deps."""

    if lang == 'id':
        system_prompt = (
            "Kamu adalah analis data digital dan penulis konten SEO profesional. "
            "Tulis artikel jurnalisme data dalam Bahasa Indonesia yang sangat human-like. "
            "Artikel harus mengandung keyword utama, subheadings H2/H3, tone analitis tapi engaging, "
            "dan diakhiri dengan call-to-action ke NurdiansyahLabs.com."
        )
        user_prompt = (
            f"Tulis artikel SEO tentang topik trending **{keyword}** yang baru saja memiliki "
            f"**{volume} pencarian** di Google hari ini. Artikel harus:\n"
            f"1. Judul yang menarik dan SEO-friendly (format: 'Membongkar/Mengapa/Fakta: ...')\n"
            f"2. Intro 3 kalimat yang langsung hook pembaca\n"
            f"3. Minimal 3 section H2 dengan analisis mendalam tentang dampak digital\n"
            f"4. CTA organik ke https://nurdiansyahlabs.com\n"
            f"5. 2 FAQ relevan\n\n"
            f"Return ONLY valid JSON:\n"
            f'{{"title":"...", "description":"...", "content":"...[markdown]...", '
            f'"faqs":[{{"q":"...","a":"..."}}]}}'
        )
    else:
        system_prompt = (
            "You are a data journalist and SEO content strategist. Write a human-like, "
            "in-depth data journalism article. Include H2/H3 headings, analytical tone, "
            "and a closing call-to-action to NurdiansyahLabs.com."
        )
        user_prompt = (
            f"Write an SEO article on trending topic **{keyword}** with **{volume} searches** "
            f"recorded today. Article must:\n"
            f"1. Compelling SEO title\n"
            f"2. 3-sentence hook intro\n"
            f"3. At least 3 H2 sections analyzing digital/business implications\n"
            f"4. Organic CTA to https://nurdiansyahlabs.com\n"
            f"5. 2 relevant FAQs\n\n"
            f"Return ONLY valid JSON:\n"
            f'{{"title":"...", "description":"...", "content":"...[markdown]...", '
            f'"faqs":[{{"q":"...","a":"..."}}]}}'
        )

    payload = json.dumps({
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.82,
        "max_tokens": 1800,
        "response_format": {"type": "json_object"}
    }).encode('utf-8')

    req = urllib.request.Request(
        GROQ_ENDPOINT,
        data=payload,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=GROQ_TIMEOUT) as resp:
        raw = json.loads(resp.read().decode('utf-8'))

    text = raw['choices'][0]['message']['content']
    data = json.loads(text)

    # Normalize field names
    return {
        "status": "success",
        "mode": "groq_llm",
        "title": data.get("title", f"Trending Now: {keyword}"),
        "description": data.get("description", ""),
        "faqs": data.get("faqs", []),
        "content": data.get("content", "")
    }


# ──────────────────────────────────────────────────────────────────────────────
# MODE 2: MARKOV CHAIN NLG (Pure Python — Works Offline on cPanel)
# ──────────────────────────────────────────────────────────────────────────────

_MARKOV_PHRASES_ID = {
    "intro": [
        "Dunia digital kembali berguncang akibat topik {kw} yang meledak dengan {vol} pencarian.",
        "Fenomena {kw} menguasai radar tren dengan volume {vol}—sinyal kuat sentimen massa.",
        "Lonjakan {vol} kueri tentang {kw} membuktikan bahwa informasi adalah komoditas tertinggi.",
        "Pada {date}, {kw} menjadi epicentrum diskusi digital dengan {vol} pencarian aktif.",
        "Tidak ada yang bisa memprediksi seberapa cepat {kw} menguasai mesin pencari—{vol} kueri dalam hitungan jam.",
    ],
    "body_opener": [
        "## Mengapa {kw} Mendominasi Internet Hari Ini?",
        "## Anatomi Viral: Membedah Fenomena {kw}",
        "## Data di Balik Lonjakan {kw}: Analisis Mendalam",
        "## {kw} dan Gelombang Perubahan Digital",
    ],
    "body_mid": [
        "Lonjakan {vol} pencarian dalam satu hari merepresentasikan intensitas emosional kolektif—bukan sekadar rasa ingin tahu biasa.",
        "Algoritma mesin pencari langsung mendeteksi anomali ini dan memprioritaskan konten terkait {kw} di seluruh platform.",
        "Di balik setiap kueri {kw} terdapat seorang pengguna yang mencari kejelasan, validasi, atau sekadar ingin memahami konteks.",
        "Infrastruktur digital yang handal mampu menyerap gelombang trafik sebesar {vol}—ini bukan kemewahan, ini keharusan bisnis.",
        "Fenomena {kw} memperlihatkan bahwa batas antara berita, hiburan, dan keputusan bisnis semakin tipis.",
    ],
    "body_closer": [
        "## Implikasi Strategis bagi Bisnis Digital\n\nMomentum seperti {kw} adalah peluang emas bagi bisnis yang siap. Platform lambat = trafik hilang.",
        "## Pelajaran dari {kw}: Infrastruktur Adalah Segalanya\n\nSetiap {vol} kueri adalah calon pengunjung. Tanpa arsitektur yang tepat, mereka pergi sebelum halaman terbuka.",
        "## SEO Intelligence: Memanfaatkan {kw} Secara Strategis\n\nData {vol} pencarian adalah blueprint strategi konten. Tim digital yang cerdas sudah bergerak sekarang.",
    ],
    "cta": [
        "\n\n---\n> 🚀 **NurdiansyahLabs**: Platform lambat adalah bunuh diri bisnis di era {kw}.\n> 👉 [Bangun Infrastruktur Web Kelas Enterprise Bersama Kami](https://nurdiansyahlabs.com/)",
        "\n\n---\n> 💡 **Insight**: Trafik {vol} dari topik seperti {kw} tidak bisa dikelola dengan website biasa.\n> 👉 [Konsultasi Arsitektur Digital di NurdiansyahLabs](https://nurdiansyahlabs.com/)",
    ]
}

_MARKOV_PHRASES_EN = {
    "intro": [
        "The digital world is fixated on {kw} after a staggering {vol} searches were recorded today.",
        "With {vol} active queries, {kw} has become the defining topic of the digital moment.",
        "{kw} detonated across global search networks today—{vol} queries in just hours reveals immense public appetite.",
        "On {date}, {kw} emerged as the dominant trend with {vol} recorded searches, reshaping digital discourse.",
        "No algorithm predicted how fast {kw} would eclipse everything—{vol} queries tell that story.",
    ],
    "body_opener": [
        "## Why Is {kw} Dominating the Internet Right Now?",
        "## The Anatomy of Virality: Dissecting the {kw} Phenomenon",
        "## Data Behind the {kw} Surge: A Deep Analysis",
        "## {kw} and the Wave of Digital Change",
    ],
    "body_mid": [
        "A surge of {vol} queries in a single day signals not mere curiosity—it represents collective emotional intensity.",
        "Search engine algorithms instantly detected this anomaly and began prioritizing {kw}-related content across platforms.",
        "Behind every {kw} query is a user seeking clarity, validation, or an understanding of context.",
        "A robust digital infrastructure can absorb traffic spikes of {vol}—this isn't a luxury, it's a business requirement.",
        "{kw} demonstrates how the line between news, entertainment, and business decisions continues to blur.",
    ],
    "body_closer": [
        "## Strategic Implications for Digital Businesses\n\nMomentum like {kw} is a golden window. Slow platforms = lost traffic.",
        "## Lessons from {kw}: Infrastructure Is Everything\n\nEach of those {vol} queries is a potential visitor. Without the right architecture, they leave before your page loads.",
        "## SEO Intelligence: Capitalizing on {kw} Strategically\n\nThe {vol} search blueprint is a content strategy goldmine. Smart digital teams are moving now.",
    ],
    "cta": [
        "\n\n---\n> 🚀 **NurdiansyahLabs**: Slow platforms are business suicide in the age of {kw}.\n> 👉 [Build Enterprise-Grade Web Infrastructure With Us](https://nurdiansyahlabs.com/)",
        "\n\n---\n> 💡 **Insight**: Managing {vol} traffic from topics like {kw} demands more than a standard website.\n> 👉 [Consult Digital Architecture at NurdiansyahLabs](https://nurdiansyahlabs.com/)",
    ]
}


def _markov_generate(keyword, volume, lang):
    """
    Markov-inspired NLG: select phrases probabilistically based on keyword hash
    to ensure deterministic variety per keyword while remaining diverse.
    """
    phrases = _MARKOV_PHRASES_ID if lang == 'id' else _MARKOV_PHRASES_EN
    date_str = datetime.now().strftime("%d %B %Y")
    ctx = {"kw": keyword, "vol": volume, "date": date_str}

    # Use keyword hash as seed for reproducible but unique output per keyword
    seed = int(hashlib.md5(keyword.encode()).hexdigest(), 16) % (2**31)
    rng = random.Random(seed)

    def pick(key): return rng.choice(phrases[key]).format(**ctx)

    # Build content
    intro = pick("intro")
    h2_open = pick("body_opener")
    body1 = pick("body_mid")
    body2 = pick("body_mid")
    body3 = pick("body_closer")
    cta = pick("cta")

    content = f"{intro}\n\n{h2_open}\n\n{body1} {body2}\n\n{body3}{cta}"

    if lang == 'id':
        title = f"Membongkar Fakta: Fenomena {keyword} dengan {volume} Pencarian ({date_str})"
        desc = (f"Mengapa {keyword} mendadak menguasai internet hari ini? "
                f"Analisis data menunjukkan {volume} pencarian—sinyal tren yang mustahil diabaikan bisnis digital.")
        faqs = [
            {"q": f"Mengapa {keyword} trending hari ini?",
             "a": f"Volume {volume} pencarian dalam waktu singkat menandakan interest massa yang sangat tinggi terhadap topik {keyword}."},
            {"q": "Bagaimana bisnis bisa memanfaatkan tren seperti ini?",
             "a": "Dengan infrastruktur digital yang cepat dan strategi SEO yang tepat, bisnis dapat mengonversi lonjakan trafik menjadi leads. NurdiansyahLabs spesialis dalam ini."}
        ]
    else:
        title = f"Unveiling the Data: {keyword} and Its {volume} Searches ({date_str})"
        desc = (f"Why is {keyword} suddenly dominating the internet? "
                f"With {volume} recorded searches, this data journalism analysis uncovers the forces behind today's defining digital trend.")
        faqs = [
            {"q": f"Why is {keyword} trending so heavily today?",
             "a": f"A surge of {volume} searches in record time signals intense mass interest and a powerful collective response to {keyword}."},
            {"q": "How can businesses capitalize on trends like this?",
             "a": "With fast digital infrastructure and precision SEO, businesses can convert traffic spikes into leads. NurdiansyahLabs specializes in exactly this."}
        ]

    return {
        "status": "success",
        "mode": "markov_nlg",
        "title": title,
        "description": desc,
        "faqs": faqs,
        "content": content
    }


# ──────────────────────────────────────────────────────────────────────────────
# MODE 3: STRUCTURED TEMPLATE (Final Fallback)
# ──────────────────────────────────────────────────────────────────────────────
def _template_generate(keyword, volume, lang):
    date_str = datetime.now().strftime("%d %B %Y")
    if lang == 'id':
        return {
            "status": "success",
            "mode": "template",
            "title": f"Membongkar Fakta: Analisis Mendalam Fenomena {keyword} ({date_str})",
            "description": f"Mengapa {keyword} mendadak populer hari ini? {volume} pencarian mengungkap dinamika audiens digital.",
            "faqs": [
                {"q": f"Mengapa {keyword} viral hari ini?",
                 "a": f"Topik {keyword} memanas karena sentimen massa dengan volume {volume} pencarian."},
                {"q": "Bisakah NurdiansyahLabs membantu menangkap tren ini?",
                 "a": "Ya. Kami membangun landing page cepat dan analisis data untuk mengonversi trafik tren menjadi leads."}
            ],
            "content": (
                f"Perhatian dunia digital kembali terpusat pada **{keyword}** yang meledak dengan **{volume} kueri**.\n\n"
                f"## Mengapa {keyword} Mendominasi?\n\nLonjakan {volume} pencarian mencerminkan *Information Gap*—keingintahuan massal yang mendesak.\n\n"
                f"## Dampak bagi Bisnis Digital\n\nMomentum ini menguji infrastruktur website. Platform yang lambat kehilangan trafik bernilai tinggi.\n\n"
                f"## Pelajaran Utama\n\nMomentum di internet itu cepat berlalu. Bisnis yang siap secara teknis yang akan memenangkan race ini.\n\n"
                f"---\n> 🚀 **NurdiansyahLabs** — Infrastruktur digital enterprise untuk menangkap setiap peluang trafik.\n"
                f"> 👉 [Konsultasikan Kebutuhan Anda](https://nurdiansyahlabs.com/)"
            )
        }
    else:
        return {
            "status": "success",
            "mode": "template",
            "title": f"Unveiling the Data: The {keyword} Phenomenon ({date_str})",
            "description": f"Why is {keyword} dominating search today? {volume} searches reveal a massive collective digital moment.",
            "faqs": [
                {"q": f"Why is {keyword} trending?",
                 "a": f"{keyword} is dominating with {volume} searches due to strong mass sentiment and curiosity."},
                {"q": "Can NurdiansyahLabs help capitalize on this traffic?",
                 "a": "Absolutely. We build fast landing pages and data analytics to convert trend surges into leads."}
            ],
            "content": (
                f"The internet is fixated on **{keyword}** today with **{volume} queries** recorded.\n\n"
                f"## Why Is {keyword} Dominating?\n\nThe {volume} query surge reflects an *Information Gap*—massive public urgency to learn more.\n\n"
                f"## Business Impact\n\nThis momentum stress-tests digital infrastructure. Slow websites bleed high-value traffic.\n\n"
                f"## Key Takeaways\n\nDigital momentum is fleeting. Only technically prepared businesses will capitalize.\n\n"
                f"---\n> 🚀 **NurdiansyahLabs** — Enterprise digital infrastructure to capture every traffic opportunity.\n"
                f"> 👉 [Consult Your Needs](https://nurdiansyahlabs.com/)"
            )
        }


# ──────────────────────────────────────────────────────────────────────────────
# MAIN ORCHESTRATOR
# ──────────────────────────────────────────────────────────────────────────────
def generate_article(keyword, volume, lang='id'):
    lang = lang.lower()[:2]
    if lang not in ('id', 'en'):
        lang = 'en'

    # Mode 1: Groq LLM (Real Machine Learning)
    if GROQ_API_KEY:
        try:
            result = _groq_generate(keyword, volume, lang)
            return json.dumps(result, ensure_ascii=False)
        except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, KeyError):
            pass  # Fallthrough to Mode 2

    # Mode 2: Markov Chain NLG (Local ML)
    try:
        result = _markov_generate(keyword, volume, lang)
        return json.dumps(result, ensure_ascii=False)
    except Exception:
        pass  # Fallthrough to Mode 3

    # Mode 3: Template (Last resort)
    result = _template_generate(keyword, volume, lang)
    return json.dumps(result, ensure_ascii=False)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"status": "error",
              "message": "Usage: generate_article.py <keyword> <volume> [lang]"}))
        sys.exit(1)

    keyword = sys.argv[1]
    volume = sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else 'id'

    print(generate_article(keyword, volume, lang))
