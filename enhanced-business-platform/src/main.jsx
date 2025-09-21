import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Use the redesigned app shell (App_new) for builds
import App from './App_new.jsx'
import { installImageFallback } from './lib/image-fallback'
// Ensure `motion` is available globally for any modules that reference it
// (some components mistakenly rely on a global `motion` variable). This
// is a small compatibility shim while we fix imports across files.
import { motion } from 'framer-motion';
if (typeof window !== 'undefined' && !window.motion) window.motion = motion;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

installImageFallback();
