import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './telemetry'

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  // Only the checkout endpoint is mocked; everything else (including Logfire's own
  // telemetry export) passes through to the real network untouched.
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const root = document.getElementById('root')
if (root === null) throw new Error('Missing root element')

void enableMocking().then(() => {
  createRoot(root).render(<StrictMode><App /></StrictMode>)
})
