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
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
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
            "jobTitle": "Fullstack Software Engineer & Architect",
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
            "name": "Nurdiansyah – Software Engineering Portfolio & Studio",
            "mainEntity": {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                "name": "Nurdiansyah",
                "url": siteUrl
            },
            "isPartOf": { "@id": `${siteUrl}/#website` }
        },

        {
            "@type": ["ProfessionalService", "LocalBusiness"],
            "@id": `${siteUrl}/#service`,
            "name": "NurdiansyahLabs",
            "alternateName": "Konsultan Teknologi, Informasi, Web Developer, IT Architect, Software Developer",
            "image": `${siteUrl}/assets/Logo.png`,
            "url": siteUrl,
            "hasMap": "https://maps.google.com/?cid=5919226666349071529",
            "founder": { "@id": `${siteUrl}/#person` },
            "telephone": "+6282176012461",
            "priceRange": "Rp 2.500.000 – Rp 5.000.000+",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Batam",
                "addressRegion": "Kepulauan Riau",
                "addressCountry": "ID"
            },
            "description": "Fullstack web applications, enterprise software architecture, custom ERP systems, and IT consultancy in Batam & Indonesia.",
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
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={descStr} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={descStr} />
            <meta property="og:url" content={fullCanonical} />
            {image && <meta property="og:image" content={`${siteUrl}${image}`} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={descStr} />
            {image && <meta name="twitter:image" content={`${siteUrl}${image}`} />}

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
