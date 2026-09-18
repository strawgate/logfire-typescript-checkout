import { useMemo, useState } from 'react'
import * as logfire from '@pydantic/logfire-browser'
import './App.css'

type CheckoutState = 'idle' | 'processing' | 'complete' | 'failed'

const products = [
  { name: 'Type-safe tote', price: 24, quantity: 1 },
  { name: 'Observable mug', price: 18, quantity: 2 },
]

export default function App() {
  const [status, setStatus] = useState<CheckoutState>('idle')
  const [email, setEmail] = useState('developer@example.com')
  const [incidentMode, setIncidentMode] = useState(false)
  const total = useMemo(() => products.reduce((sum, product) => sum + product.price * product.quantity, 0), [])

  async function submitOrder() {
    setStatus('processing')
    try {
      await logfire.span('submit checkout', {
        attributes: { 'checkout.item_count': products.length, 'checkout.incident_mode': incidentMode },
        callback: async () => {
          const response = await fetch(`/api/checkout?scenario=${incidentMode ? 'failure' : 'success'}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email, total }),
          })
          if (!response.ok) throw new Error(`Checkout API returned ${response.status}`)
          const result = (await response.json()) as { orderId: string }
          logfire.info('Checkout completed', { 'order.id': result.orderId, 'checkout.total': total })
        },
      })
      setStatus('complete')
    } catch (error) {
      logfire.reportError('Checkout failed', error, { 'checkout.incident_mode': incidentMode, 'checkout.total': total })
      setStatus('failed')
    }
  }

  function blockMainThread() {
    const start = performance.now()
    while (performance.now() - start < 350) Math.sqrt(Math.random())
    logfire.warning('Slow interaction generated', { 'demo.blocked_ms': Math.round(performance.now() - start) })
  }

  return (
    <main>
      <header className="masthead">
        <a className="brand" href="https://logfire.pydantic.dev" target="_blank" rel="noreferrer"><span className="brand-mark">LF</span>Pydantic Logfire</a>
        <span className="live-pill"><span /> Browser telemetry live</span>
      </header>
      <section className="hero">
        <p className="eyebrow">TypeScript observability, end to end</p>
        <h1>See what your users experience.</h1>
        <p className="lede">A deliberately imperfect checkout instrumented with Logfire. Generate a slow interaction or a failed request, then follow the evidence from Web Vitals to traces and session replay.</p>
      </section>
      <section className="workspace">
        <article className="checkout-card">
          <div className="section-heading"><div><p className="kicker">Demo storefront</p><h2>Your cart</h2></div><span className="item-count">3 items</span></div>
          <div className="products">{products.map((product) => <div className="product" key={product.name}><div className="product-art" aria-hidden="true">{product.name.at(0)}</div><div><strong>{product.name}</strong><p>Quantity {product.quantity}</p></div><span>${product.price * product.quantity}</span></div>)}</div>
          <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></label>
          <div className="total"><span>Total</span><strong>${total}</strong></div>
          <button className="primary" onClick={() => void submitOrder()} disabled={status === 'processing'}>{status === 'processing' ? 'Processing…' : 'Complete order'}</button>
          <p className={`status status-${status}`} role="status">{status === 'idle' && 'Ready for checkout'}{status === 'processing' && 'Submitting your order'}{status === 'complete' && 'Order completed. Find the trace in Logfire.'}{status === 'failed' && 'Checkout failed. The error and request trace were reported.'}</p>
        </article>
        <aside className="lab-card">
          <p className="kicker">Incident lab</p><h2>Make the invisible visible</h2><p>These controls create realistic signals without adding production-only debugging code.</p>
          <button className={`lab-control ${incidentMode ? 'active' : ''}`} onClick={() => setIncidentMode(!incidentMode)}><span><strong>API failure</strong><small>Return HTTP 503 on checkout</small></span><span className="switch" aria-hidden="true"><span /></span></button>
          <button className="lab-control" onClick={blockMainThread}><span><strong>Slow interaction</strong><small>Block the main thread for 350 ms</small></span><span className="run">Run</span></button>
          <div className="signal-list"><div><span className="signal-dot violet" /><span><strong>Core Web Vitals</strong><small>LCP, INP, CLS, FCP and TTFB</small></span></div><div><span className="signal-dot mint" /><span><strong>Request traces</strong><small>Fetch timing, status and errors</small></span></div><div><span className="signal-dot amber" /><span><strong>Session replay</strong><small>Correlated by browser session</small></span></div></div>
        </aside>
      </section>
      <footer><p><strong>Built for TypeScript developers.</strong> OpenTelemetry-native data, one query language, no black box.</p><a href="https://pydantic.dev/docs/logfire/observe/frontend/" target="_blank" rel="noreferrer">Instrument your app →</a></footer>
    </main>
  )
}
