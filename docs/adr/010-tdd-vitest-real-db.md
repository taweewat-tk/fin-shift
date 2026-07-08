# ADR-010: TDD with a layered test pyramid, Vitest not Jest

## Status

Accepted.

## Context

kor-it-ui uses Jest, but it is frontend-only. This project is full-stack and needs integration
tests against a real database to trustworthily verify per-user isolation — something a
frontend-only test setup never had to do.

## Decision

Vitest for all layers: strict TDD on the pure engine (`src/shared/utils/billing-cycle.ts`) and zod
schemas; integration tests for API routes against the real `creditcard_test` Postgres database,
reset between tests; light smoke tests for key UI, added after implementation; a handful of
Playwright E2E flows at the end of Phase 1. See `TESTING.md` for the full strategy.

## Consequences

`vitest.config.ts` defines three projects (`unit`, `integration`, `smoke`) with different
environments and setup files. The billing-cycle engine (M7) and the auth routes (M6) were both
built test-first, red before green, per this ADR. 34 tests pass as of this round; the integration
project globally resets the test DB via a `beforeEach` in `vitest.setup.integration.ts`.
