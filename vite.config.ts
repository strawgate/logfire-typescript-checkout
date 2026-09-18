import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0') },
  plugins: [react(), checkoutApi()],
  server: { port: 5173 },
})

function checkoutApi(): Plugin {
  return {
    name: 'checkout-demo-api',
    configureServer(server) {
      server.middlewares.use('/api/checkout', (request, response) => {
        const url = new URL(request.url ?? '/', 'http://localhost')
        response.setHeader('content-type', 'application/json')
        setTimeout(() => {
          if (url.searchParams.get('scenario') === 'failure') {
            response.statusCode = 503
            response.end(JSON.stringify({ error: 'Payment processor unavailable' }))
          } else {
            response.end(JSON.stringify({ orderId: `order_${Date.now().toString(36)}` }))
          }
        }, 420)
      })
    },
  }
}
