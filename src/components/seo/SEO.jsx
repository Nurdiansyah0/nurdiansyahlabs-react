import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical, image, type = 'website' }) => {
    const siteTitle = "NurdiansyahLabs";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = "https://nurdiansyahlabs.com";
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
    const defaultDesc = "Jasa pembuatan landing page, web developer fullstack, analisis data bisnis, dan data science terpercaya di Indonesia.";

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
        </Helmet>
    );
};

export default SEO;
