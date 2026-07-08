# ADR-015: Next.js 16 (latest stable), diverging from kor-it-ui's Next 15.5

## Status

Accepted.

## Context

Per user instruction, this project pins every dependency to the actual latest stable release,
verified live via `npm view <pkg> dist-tags`, rather than matching kor-it-ui's already-pinned
versions.

## Decision

Next.js 16.2.10 (App Router), React 19.2.7, TypeScript 6.0.3 — all confirmed as the `latest`
dist-tag both at initial planning (2026-07-04) and re-verified at actual scaffold time
(2026-07-08, see ADR-016).

## Consequences

Next 16 removed `next lint` as a built-in command (present in kor-it-ui's Next 15.5); this
project's `lint` script calls the ESLint CLI directly (`eslint .`). Confirmed via
`npx create-next-app@latest`'s own scaffold output at implementation time, which no longer
generates a `lint` script wired to `next lint`.
