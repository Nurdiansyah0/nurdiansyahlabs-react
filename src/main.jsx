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

// Unregister any stray service workers from other local projects
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Unregistered rogue service worker:', registration);
    }
  }).catch(function (err) {
    console.log('Service Worker unregistration failed: ', err);
  });
}

// Dispatch event for vite-plugin-prerender
setTimeout(() => document.dispatchEvent(new Event('render-event')), 2000)
