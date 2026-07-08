# ADR-005: Multi-user + auth in MVP, per-user isolation

## Status

Accepted.

## Context

"Me + family" means several real people share this app from day one, each with their own cards and
expenses. Users must never see each other's data — this is a hard invariant, not a nice-to-have.

## Decision

Every `Card` and `Expense` row carries a `userId` foreign key (see `prisma/schema.prisma`). Every
route handler calls `requireUser(request)` (`src/server/auth.ts`) before touching Prisma, and every
query is scoped by the authenticated user's id. Per TESTING.md, every integration test creates ≥2
users and asserts isolation explicitly.

## Consequences

`src/app/api/v1/me/route.test.ts` demonstrates the pattern this round: two users, one token, and an
explicit assertion that the wrong user's id is never returned. Every future `/api/v1/cards` and
`/api/v1/expenses` route must follow the same test shape before merging.
