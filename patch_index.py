import re

with open("index.html", "r") as f:
    content = f.read()

# Insert the new static title and schema into the head
head_addition = """
  <title>NurdiansyahLabs - Solusi Digital Terintegrasi</title>
  <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": "https://nurdiansyahlabs.com/#person",
                "name": "Nurdiansyah",
                "url": "https://nurdiansyahlabs.com"
            },
            {
                "@type": "WebSite",
                "@id": "https://nurdiansyahlabs.com/#website",
                "url": "https://nurdiansyahlabs.com",
                "name": "NurdiansyahLabs"
            },
            {
                "@type": "ProfilePage",
                "@id": "https://nurdiansyahlabs.com/#profile",
                "url": "https://nurdiansyahlabs.com",
                "name": "Nurdiansyah – Software Engineering Portfolio & Studio"
            },
            {
                "@type": "ProfessionalService",
                "@id": "https://nurdiansyahlabs.com/#service",
                "name": "NurdiansyahLabs",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Layanan Digital & Software Engineering"
                }
            }
        ]
    }
  </script>
"""

content = content.replace("</head>", head_addition + "</head>")

with open("index.html", "w") as f:
    f.write(content)
