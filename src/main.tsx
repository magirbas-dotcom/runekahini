import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are served from this site rather than Google Fonts, so a visit sends
// nothing to a third party (see the privacy page). Only the Latin and
// Latin Extended subsets: Turkish needs the latter (ş, ğ, İ, ı).
import '@fontsource/cinzel/latin-500.css'
import '@fontsource/cinzel/latin-ext-500.css'
import '@fontsource/cinzel/latin-600.css'
import '@fontsource/cinzel/latin-ext-600.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-400-italic.css'
import '@fontsource/inter/latin-ext-400-italic.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-500-italic.css'
import '@fontsource/inter/latin-ext-500-italic.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
import './index.css'
import App from './App.tsx'

// iOS Safari ignores user-scalable=no and touch-action does not cover its
// proprietary pinch gesture, so block that gesture directly. Zoom broke the
// fixed realm backdrop; see the viewport note in index.html.
const blockGesture = (e: Event) => e.preventDefault()
document.addEventListener('gesturestart', blockGesture, { passive: false })
document.addEventListener('gesturechange', blockGesture, { passive: false })

// Ask for a portrait lock where the platform allows it (installed Android
// PWAs, fullscreen); elsewhere it rejects quietly and RotateNotice takes over.
const orientation = screen.orientation as ScreenOrientation & {
  lock?: (o: string) => Promise<void>
}
orientation?.lock?.('portrait').catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
