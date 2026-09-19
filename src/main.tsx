import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './telemetry'

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  // Only the checkout endpoint is mocked; everything else (including Logfire's own
  // telemetry export) passes through to the real network untouched.
  // MSW resolves the worker script from the site root by default, but this app can be
  // deployed under a subpath (GitHub Pages project sites), where the script lives under
  // `BASE_URL` alongside the rest of the built assets.
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}

const root = document.getElementById('root')
if (root === null) throw new Error('Missing root element')

// A mocking failure (e.g. no service worker support) shouldn't blank the whole app --
// the checkout button just won't work, which is a far better failure mode.
enableMocking()
  .catch((error: unknown) => {
    console.error('Failed to start the checkout mock; the checkout button will not work.', error)
  })
  .finally(() => {
    createRoot(root).render(<StrictMode><App /></StrictMode>)
  })
