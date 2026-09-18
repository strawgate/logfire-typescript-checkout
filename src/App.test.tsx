// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('@pydantic/logfire-browser', () => ({
  span: vi.fn(async (_name, options: { callback: () => Promise<void> }) => options.callback()),
  info: vi.fn(),
  warning: vi.fn(),
  reportError: vi.fn(),
}))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('checkout lab', () => {
  it('completes a healthy checkout', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ orderId: 'order_test' }))))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Complete order' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Order completed'))
  })

  it('shows a reported failure when incident mode is enabled', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 503 })))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /API failure/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Complete order' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Checkout failed'))
  })
})
