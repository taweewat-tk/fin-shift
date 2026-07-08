# ADR-008: Postgres via Docker for local dev

## Status

Accepted.

## Context

TESTING.md requires real-Postgres integration tests (not a mocked DB) to trustworthily assert the
per-user data-isolation invariant. That requires a reproducible local Postgres, not a dependency on
a developer's system-installed database.

## Decision

`docker-compose.yml` runs a single Postgres 17 container with two databases: `creditcard` (dev) and
`creditcard_test` (integration tests), the latter created by `docker/init-test-db.sh` at container
init. `.env` / `.env.test` point at each respectively.

## Consequences

`npm run db:test:migrate` applies migrations to the test DB independently of the dev DB. Verified
this round: both databases exist, are reachable, and `test/db.ts#resetDb()` successfully truncates
`creditcard_test`'s tables between tests (confirmed with an ad hoc script before writing the
integration test suite).
