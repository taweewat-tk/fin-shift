# ADR-007: REST + zod route handlers, not tRPC

## Status

Accepted.

## Context

The API must be consumable by any client identically: the web app, the future native webview, and
plain curl for debugging/testing. tRPC's type-safety benefits come at the cost of coupling clients
to the TypeScript server project, which works against the API-first goal (ADR-001).

## Decision

Plain JSON REST under `src/app/api/v1/**`, every input validated by a zod schema before touching
Prisma. Route handlers return `NextResponse.json(...)` with explicit status codes (400 validation,
401 unauthorized, 409 conflict, etc.) rather than a single RPC error channel.

## Consequences

Every route handler this round (`register`, `login`, `logout`, `me`) is callable with a bare curl
request and JSON body/headers, and was verified that way manually. No client-specific SDK is
required to consume the API.
