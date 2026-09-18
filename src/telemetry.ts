import * as logfire from '@pydantic/logfire-browser'
import { sessionReplayIntegration } from '@pydantic/logfire-session-replay/integration'

const baseUrl = import.meta.env.VITE_LOGFIRE_BASE_URL
const token = import.meta.env.VITE_LOGFIRE_FRONTEND_TOKEN

if (baseUrl && token) {
  logfire.configureFrontend({
    baseUrl, token, serviceVersion: __APP_VERSION__, resourceTiming: { detail: 'summary' },
    rum: { session: { getRouteName: () => window.location.pathname, getSessionAttributes: () => ({ demo: 'checkout-lab', framework: 'react' }) } },
    ...(import.meta.env.VITE_LOGFIRE_SESSION_REPLAY === 'true' ? { sessionReplay: { ...sessionReplayIntegration(), sessionSampleRate: 1, onErrorSampleRate: 1, maskAllInputs: true } } : {}),
  })
} else if (import.meta.env.DEV) {
  console.info('Logfire is disabled. Copy .env.example to .env.local to send telemetry.')
}
