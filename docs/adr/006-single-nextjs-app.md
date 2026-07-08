# ADR-006: Single Next.js app now, not a monorepo

## Status

Accepted.

## Context

A native app is planned, which will eventually need to reuse some of this codebase's logic (the
billing-cycle engine, zod schemas, possibly the axios services layer). Standing up a Turborepo
monorepo now, before there's a second consumer, would be premature structure.

## Decision

One Next.js app. The extraction seam for the future native app is `src/shared/utils/billing-cycle.ts`
(pure, zero React/Next/Prisma imports) plus the zod schemas — code that's already
framework-agnostic and can be lifted into a shared package later without a rewrite.

## Consequences

No workspace tooling (Turborepo, pnpm workspaces) exists yet. `billing-cycle.ts` was written and
verified (M7) to import nothing beyond `dayjs`, confirming the seam holds in practice.
