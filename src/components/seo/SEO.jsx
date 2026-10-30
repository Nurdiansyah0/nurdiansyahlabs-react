import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical, image, type = 'website', breadcrumbs, additionalSchemas }) => {
    const siteTitle = "NurdiansyahLabs";
    const titleStr = typeof title === 'object' && title !== null
        ? (title.id || title.en || String(title))
        : (title || '');
    const fullTitle = titleStr
        ? (titleStr.includes(siteTitle) ? titleStr : `${titleStr} | ${siteTitle}`)
        : siteTitle;
    const siteUrl = "https://nurdiansyahlabs.com";
    const normalizedPath = canonical
        ? (canonical === "/" ? "/" : `/${canonical.replace(/^\/+|\/+$/g, "")}`)
        : "/";
    const fullCanonical = normalizedPath === "/" ? `${siteUrl}/` : `${siteUrl}${normalizedPath}`;
    const fullImage = image
        ? (String(image).startsWith("http") ? String(image) : `${siteUrl}${String(image).startsWith("/") ? "" : "/"}${image}`)
        : `${siteUrl}/assets/Logo_Primatera.png`;
    const defaultDesc = "Jasa rekayasa software enterprise, custom ERP, dan arsitektur aplikasi web skala produksi di Indonesia. Solusi end-to-end full SDLC software engineer terpercaya.";
    const descStr = typeof description === 'object' && description !== null
        ? (description.id || description.en || String(description))
        : (description || defaultDesc);

    // Enhanced Connected Schema Graph (Person + WebSite + ProfessionalService + ProfilePage + OfferCatalog)
    const baseGraph = [
        {
            "@type": "Person",
            "@id": `${siteUrl}/#person`,
            "name": "Nurdiansyah",
            "url": siteUrl,
            "jobTitle": "Enterprise Software Engineer & Systems Architect",
            "alumniOf": "Universitas Terbuka",
            "knowsAbout": [
                "React",
                "Python",
                "Flask",
                "PostgreSQL",
                "Enterprise Resource Planning",
                "Machine Learning",
                "Data Analytics"
            ],
            "sameAs": [
                "https://github.com/Nurdiansyah0",
                "https://www.linkedin.com/in/nurdiansyah-ds"
            ]
        },
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            "url": siteUrl,
            "name": "NurdiansyahLabs",
            "publisher": { "@id": `${siteUrl}/#person` },
            "inLanguage": ["id-ID", "en-US"]
        },
        {
            "@type": "ProfilePage",
            "@id": `${siteUrl}/#profile`,
            "url": siteUrl,
            "name": "Nurdiansyah – Enterprise Software Engineering & Architecture",
            "mainEntity": {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                "name": "Nurdiansyah",
                "jobTitle": "Enterprise Software Engineer & Systems Architect",
                "url": siteUrl
            },
            "isPartOf": {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`
            }
        },
        {
            "@type": ["ProfessionalService", "LocalBusiness"],
            "@id": `${siteUrl}/#service`,
            "name": "NurdiansyahLabs - Jasa Software Enterprise & Full SDLC Engineer",
            "alternateName": "Konsultan Teknologi, Informasi, Web Developer, IT Architect, Software Developer",
            "logo": `${siteUrl}/assets/logo.svg`,
            "image": `${siteUrl}/assets/android-chrome-512x512.png`,
            "url": siteUrl,
            "hasMap": "https://maps.google.com/?cid=5919226666349071529",
            "founder": { "@id": `${siteUrl}/#person` },
            "telephone": "+62-821-7601-2461",
            "email": "nudiansyahdian28.adv@gmail.com",
            "priceRange": "Rp 2.500.000 – Rp 5.000.000+",
            "openingHours": "Mo-Su 08:00-21:00",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Perm Griya Batu Aji Asri Tahap 4",
                "addressLocality": "Batu Aji, Batam",
                "addressRegion": "Kepulauan Riau",
                "postalCode": "29424",
                "addressCountry": "ID"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 1.0308,
                "longitude": 103.9747
            },
            "areaServed": [
                { "@type": "Country", "name": "Indonesia" },
                { "@type": "City", "name": "Batam" },
                { "@type": "City", "name": "Jakarta" },
                { "@type": "City", "name": "Surabaya" }
            ],
            "description": "Jasa rekayasa software enterprise, custom ERP, konsultan website, dan arsitektur aplikasi web skala produksi di Indonesia. Solusi end-to-end full SDLC dari analisis arsitektur hingga deployment.",
            "sameAs": [
                "https://maps.google.com/?cid=5919226666349071529",
                "https://github.com/Nurdiansyah0",
                "https://www.linkedin.com/in/nurdiansyah-ds"
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Layanan Digital & Software Engineering",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "name": "Paket 1: Modern Web Architecture & Conversion Acceleration",
                        "price": "2500000",
                        "priceCurrency": "IDR",
                        "url": `${siteUrl}/services/landing-page`
                    },
                    {
                        "@type": "Offer",
                        "name": "Paket 2: Custom Enterprise ERP & Sistem Operasional Terdistribusi",
                        "price": "5000000",
                        "priceCurrency": "IDR",
                        "url": `${siteUrl}/services/web-development`
                    },
                    {
                        "@type": "Offer",
                        "name": "Paket 3: Konsultasi Arsitektur Teknis, Full SDLC & Enterprise Advisory",
                        "price": "0",
                        "priceCurrency": "IDR",
                        "description": "Gratis 30-Menit Discovery Consultation",
                        "url": `${siteUrl}/#services`
                    },
                    {
                        "@type": "Offer",
                        "name": "Business Intelligence & Data Analytics Dashboard",
                        "price": "2500000",
                        "priceCurrency": "IDR",
                        "url": `${siteUrl}/services/data-analyst`
                    }
                ]
            }
        }
    ];

    if (normalizedPath === "/") {
        baseGraph.push({
            "@type": "FAQPage",
            "@id": `${siteUrl}/#faq`,
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Apa saja layanan utama yang disediakan NurdiansyahLabs?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "NurdiansyahLabs adalah perusahaan software dan konsultan IT di Batam yang menyediakan jasa software enterprise, custom ERP, konsultan website, jasa machine learning, dan data scientist dengan metodologi Full SDLC ketat."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Apakah NurdiansyahLabs melayani klien di luar kota Batam?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ya, kami melayani perusahaan korporasi, UMKM, dan startup di seluruh Indonesia termasuk Jakarta, Surabaya, Bandung, Medan, hingga klien internasional dengan manajemen proyek transparan dan repositori Git mandiri."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Berapa lama estimasi pengerjaan software enterprise dan custom ERP?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Waktu pengerjaan berkisar antara 2 hingga 8 minggu tergantung pada skala modul dan kompleksitas sistem, dengan garansi 30 hari bug-fix serta 100% kepemilikan source code tanpa vendor lock-in."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Bagaimana proses konsultasi IT dan rekayasa software di NurdiansyahLabs?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kami menyediakan sesi discovery teknis 1-on-1 gratis selama 30 menit via Google Meet atau WhatsApp untuk membedah arsitektur sistem, bottleneck database, estimasi milestone, dan scope of work (SOW) proyek Anda."
                    }
                }
            ]
        });
    }

    if (additionalSchemas && Array.isArray(additionalSchemas)) {
        baseGraph.push(...additionalSchemas);
    }

    const schemaGraph = {
        "@context": "https://schema.org",
        "@graph": baseGraph
    };

    // Breadcrumb schema
    let breadcrumbSchema = null;
    const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;
    if (hasBreadcrumbs) {
        breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name || '',
                "item": (crumb.url && crumb.url.startsWith('http')) ? crumb.url : `${siteUrl}${crumb.url || ''}`
            }))
        };
    }

    return (
        <Helmet defer={false}>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={descStr} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={descStr} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:image" content={fullImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={descStr} />
            <meta name="twitter:image" content={fullImage} />

            {/* Schema.org JSON-LD Graph */}
            <script type="application/ld+json">
                {JSON.stringify(schemaGraph)}
            </script>
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
