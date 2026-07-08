# ADR-001: API-first architecture with token auth

## Status

Accepted.

## Context

A native app is planned that logs the user in and wraps this web app in a webview. The backend
must therefore be reusable by more than one client (browser, native webview), and the session
mechanism must be something a native shell can carry, not something tied to browser-only APIs.

## Decision

Next.js App Router route handlers are a clean JSON API under `src/app/api/**` — no business logic
lives in pages or Server Components. The session is a JWT (see ADR-012), not an opaque
server-side session, so the native shell can carry the same token. The web UI consumes the API via
React Query exactly as any other client would (see ADR-011).

## Consequences

No server-only coupling that a webview can't reuse. Every feature is implemented API-first: a
failing integration test against the route handler, then the UI. Confirmed end-to-end in M6/M8:
`/api/auth/register`, `/api/auth/login`, `/api/v1/me` all work identically whether called via
cookie (web) or `Authorization: Bearer` (native), verified manually with curl.
