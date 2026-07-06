import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

// Registrar/Desregistrar Service Worker según el entorno para evitar problemas de caché en desarrollo
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      let unregisteredAny = false;
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('🧹 [DevHelper] Service Worker desregistrado de localhost.');
            unregisteredAny = true;
          }
        });
      }
      if (unregisteredAny && 'caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) caches.delete(name);
          console.log('🧹 [DevHelper] Cachés de PWA eliminadas de localhost.');
          setTimeout(() => window.location.reload(), 200);
        });
      }
    });
  } else {
    // Registrar Service Worker para soporte PWA en producción (PDA / Instalable)
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('✅ Service Worker registrado con éxito:', reg.scope))
        .catch((err) => console.error('❌ Error al registrar el Service Worker:', err));
    });
  }
}
