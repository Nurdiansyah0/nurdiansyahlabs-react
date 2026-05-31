/**
 * NurdiansyahLabs – Image Delivery Helper
 * Provides consistent CDN-backed optimization and fallback handling.
 */

const CDN_BASE = 'https://wsrv.nl/?url=';

/**
 * Resolves an image URL to an optimized CDN path if possible.
 * Follows Senior Dev best practices: Smart detection, environment toggles, and robust encoding.
 */
export const getOptimizedImg = (src, options = {}) => {
    if (!src) return '/assets/logo.svg';

    // 1. Skip optimization if disabled via ENV or if it's a dev-only blob/data URL
    const isCdnEnabled = import.meta.env.VITE_CDN_ENABLED !== 'false';
    const isBlob = src.startsWith('blob:') || src.startsWith('data:');
    const isSvg = src.toLowerCase().endsWith('.svg');

    if (!isCdnEnabled || isBlob || isSvg) {
        return src;
    }

    // 2. Normalize and Clean the URL for the CDN
    // We should NOT strip query parameters because external image providers (Pravatar, Unsplash)
    // rely on them (e.g. ?img=12). Wsrv.nl handles URL-encoded query params perfectly.
    let fullUrl = src;

    if (fullUrl.startsWith('/')) {
        const host = window.location.origin;
        fullUrl = `${host}${fullUrl}`;
    }

    // 3. Local Environment Guard & Bypass Domains
    // Public CDNs (like wsrv.nl) cannot access your "localhost".
    // We also bypass external avatar services that block proxying (pravatar) or don't need it.
    const isLocal = fullUrl.includes('localhost') || fullUrl.includes('127.0.0.1') || fullUrl.includes('::1');
    const isBypassed = fullUrl.includes('pravatar.cc') || fullUrl.includes('ui-avatars.com');

    if (isLocal || isBypassed) {
        return src;
    }

    // 4. Build optimization parameters
    const params = new URLSearchParams();

    // Default to WebP if no output specified (Senior Best Practice for weight)
    params.append('output', options.output || 'webp');
    params.append('q', options.q || '80');

    if (options.w) params.append('w', options.w);
    if (options.h) params.append('h', options.h);
    if (options.fit) params.append('fit', options.fit || 'cover');
    if (options.il) params.append('il', ''); // Interlace/Progressive loading

    // 4. Return the optimized CDN URL
    return `${CDN_BASE}${encodeURIComponent(fullUrl)}&${params.toString()}`;
};

/**
 * Simple wrapper for raw URLs (no CDN) with fallback
 */
export const getRawImg = (src) => src || '/assets/logo.svg';
