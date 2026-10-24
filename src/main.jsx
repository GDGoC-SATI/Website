import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// --- Developer Identity & Platform Credits ---
const printDeveloperCredits = () => {
  if (typeof window === 'undefined' || window.__GDG_DEV_CREDITS_SHOWN__) return;
  window.__GDG_DEV_CREDITS_SHOWN__ = true;

  console.log(
    '%c GDG on Campus SATI Vidisha %c Designed & Built by Safal Tiwari %c',
    'background:#4285F4;color:#FFFFFF;font-weight:800;padding:5px 10px;border-radius:4px 0 0 4px;font-size:12px;font-family:sans-serif;',
    'background:#0F172A;color:#38BDF8;font-weight:700;padding:5px 10px;border-radius:0 4px 4px 0;font-size:12px;font-family:sans-serif;',
    'background:transparent;'
  );
  console.log(
    '%c' +
    '👨‍💻 Developer:    Safal Tiwari\n' +
    '💼 Role:         Full-Stack Web Developer & Product Owner\n' +
    '🏛️ Institute:    Samrat Ashok Technological Institute (SATI), Vidisha\n' +
    '📅 Founded / Dev: 2025 - Present\n' +
    '✉️ Contact:      safaltiwari601@gmail.com\n' +
    '🐙 GitHub:       https://github.com/SAFAL-TIWARI\n' +
    '🔗 Instagram:    https://www.instagram.com/itz_safal_\n' +
    '📄 humans.txt:   https://gdgocsati.vercel.app/humans.txt\n' +
    '🛡️ security.txt: https://gdgocsati.vercel.app/.well-known/security.txt',
    'color:#475569;font-size:11px;font-family:monospace;line-height:1.7;padding:4px 0;'
  );
};
printDeveloperCredits();

// Filter external third-party telemetry and deprecated Permissions-Policy warnings from iframe/extensions
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const text = args[0] ? String(args[0]) : '';
    if (
      text.includes('Permissions-Policy') ||
      text.includes('attribution-reporting') ||
      text.includes('interest-cohort') ||
      text.includes('otp-credentials') ||
      text.includes('private-state-token') ||
      text.includes('shared-storage')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const text = args[0] ? String(args[0]) : '';
    if (
      text.includes('gen_204') ||
      text.includes('ERR_BLOCKED_BY_CLIENT') ||
      text.includes('csp_test=true')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

// Register Service Worker silently in the background for PWA (no popups)
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => {
        console.debug('Service Worker registration skipped/failed:', err);
      });
  });
}
