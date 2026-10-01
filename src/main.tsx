import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
