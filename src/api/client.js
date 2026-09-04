/**
 * NurdiansyahLabs – Centralized Modern API Client
 * Targets Flask 3.1.3 Modular Monolith at /api/v1/
 */

const API_BASE = '/api/v1';

export async function apiRequest(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const token = localStorage.getItem('adminToken');
    if (token && !headers['X-Admin-Token']) {
        headers['X-Admin-Token'] = token;
    }

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    return await fetch(url, {
        ...options,
        headers
    });
}
