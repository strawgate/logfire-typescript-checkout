import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Set by the GitHub Pages deploy workflow so assets resolve under the project-page path
  // (https://<org>.github.io/<repo>/). Local dev and `vite preview` stay rooted at `/`.
  base: process.env.VITE_BASE_PATH ?? '/',
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0') },
  plugins: [react()],
  server: { port: 5173 },
})
