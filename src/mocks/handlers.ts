import { delay, http, HttpResponse } from 'msw'

/**
 * Simulates the checkout API entirely in the browser (via the MSW service worker), so the
 * demo needs no real backend in development or in the static production build. `fetch` still
 * goes over the network stack, so Logfire's request instrumentation captures real timing,
 * status, and errors exactly as it would against a live endpoint.
 */
export const handlers = [
  // `*` matches any prefix, so this still matches whether the app is served from the site
  // root or a subpath (e.g. a GitHub Pages project site).
  http.post('*/api/checkout', async ({ request }) => {
    await delay(420)
    const url = new URL(request.url)
    if (url.searchParams.get('scenario') === 'failure') {
      return HttpResponse.json({ error: 'Payment processor unavailable' }, { status: 503 })
    }
    return HttpResponse.json({ orderId: `order_${Date.now().toString(36)}` })
  }),
]
