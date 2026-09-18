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

The development server includes a small local checkout endpoint. No external backend is required.

## Quality checks

```bash
pnpm run ci
```

Built with React, Vite, TypeScript, and the official [`@pydantic/logfire-browser`](https://www.npmjs.com/package/@pydantic/logfire-browser) SDK.

## License

MIT
