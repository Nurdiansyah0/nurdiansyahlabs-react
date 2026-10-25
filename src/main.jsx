import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Progressive Web App (PWA) Service Worker Lifecycle Management
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker active with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    });
  } else {
    // Unregister legacy or rogue service workers during local development to ensure hot module replacement
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
        console.log('[Dev] Unregistered service worker for clean HMR:', registration.scope);
      }
    }).catch(function (err) {
      console.log('[Dev] Service Worker cleanup check:', err);
    });
  }
}

// Dispatch event for vite-plugin-prerender
setTimeout(() => document.dispatchEvent(new Event('render-event')), 2000)
