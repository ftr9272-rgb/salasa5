import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Use the redesigned app shell (App_new) for builds
import App from './App_new.jsx'
import { installImageFallback } from './lib/image-fallback'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

installImageFallback();
