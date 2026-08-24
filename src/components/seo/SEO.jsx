import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical, image, type = 'website', breadcrumbs }) => {
    const siteTitle = "NurdiansyahLabs";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = "https://nurdiansyahlabs.com";
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
    const defaultDesc = "Jasa pembuatan landing page, web developer fullstack, analisis data bisnis, dan data science terpercaya di Indonesia.";

    // Base Organization/Service schema
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "NurdiansyahLabs",
        "image": `${siteUrl}/assets/Logo.png`,
        "url": siteUrl,
        "telephone": "+6282176012461",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Indonesia",
            "addressCountry": "ID"
        },
        "description": "Enterprise-grade web development, SEO, and Data Analytics.",
        "sameAs": [
            "https://github.com/Nurdiansyah0",
            "https://www.linkedin.com/in/nurdiansyah-ds"
        ]
    };

    // Breadcrumb schema
    let breadcrumbSchema = null;
    if (breadcrumbs && breadcrumbs.length > 0) {
        breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": `${siteUrl}${crumb.url}`
            }))
        };
    }

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:url" content={fullCanonical} />
            {image && <meta property="og:image" content={`${siteUrl}${image}`} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
            {image && <meta name="twitter:image" content={`${siteUrl}${image}`} />}

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(orgSchema)}
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
