# Logfire TypeScript Checkout Lab

A deliberately imperfect React checkout for exploring frontend observability with [Pydantic Logfire](https://logfire.pydantic.dev). It produces useful browser telemetry on demand: Core Web Vitals, request traces, manual spans, handled errors, and optional session replay.

## Why Logfire for TypeScript?

- One restricted frontend token configures OpenTelemetry traces and Web Vitals metrics.
- Browser sessions connect performance signals, requests, errors, and replay.
- Manual spans keep business context typed and close to the code that owns it.
- The demo stays useful without telemetry credentials, so contributors can run it immediately.

## Run it

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Create a frontend application in **Logfire → Frontend → Applications**, then replace the placeholder values in `.env.local`. A frontend application token is intentionally restricted to writing telemetry for that application. Do not use a normal project write token in browser code.

Session replay is off by default. Set `VITE_LOGFIRE_SESSION_REPLAY=true` to enable it after reviewing the recorder's privacy defaults for your application.

## Try an investigation

1. Complete a healthy order and find the `submit checkout` span.
2. Enable **API failure**, complete another order, and inspect the HTTP 503 plus reported error.
3. Run **Slow interaction** and compare the click span with INP.
4. If replay is enabled, open the replay linked by the shared browser session.

`/api/checkout` is mocked entirely in the browser with [MSW](https://mswjs.io) — no backend, in development or in the deployed build. `fetch` still makes a real request through the service worker, so Logfire's request instrumentation reports genuine timing, status, and errors.

## Quality checks

```bash
pnpm run ci
```

Built with React, Vite, TypeScript, and the official [`@pydantic/logfire-browser`](https://www.npmjs.com/package/@pydantic/logfire-browser) SDK.

## Deploy

This repo deploys to GitHub Pages on every push to `main` (see `.github/workflows/deploy-pages.yml`). The build needs two repository secrets so the deployed bundle carries a real frontend telemetry token:

- `LOGFIRE_BASE_URL` — the `VITE_LOGFIRE_BASE_URL` value for your Logfire region.
- `LOGFIRE_FRONTEND_TOKEN` — a restricted frontend application token (never a project write token).

Without those secrets set, the deployed demo still runs; it just won't send telemetry, same as a local checkout without `.env.local`.

## License

MIT
