# ADR-014: Deviation — dedicated `src/server/` for server-only code

## Status

Accepted.

## Context

kor-it-ui is frontend-only and has no server-only code, so it has no need for a directory boundary
enforcing that. This project's Prisma client and JWT signing secret absolutely must never enter the
client bundle — a leak here is a credential/data leak, not just a bundle-size concern.

## Decision

`src/server/*` (currently `db.ts`, `auth.ts`) is the **only** place Prisma and jose-signing are
imported. Route handlers are the only importers of `src/server/*`. The pure billing-cycle engine
stays in `src/shared/utils/` (client-agnostic) so both server and client — and the future native
app — can use it.

## Consequences

Caught one real violation of this boundary during implementation (M8): `src/shared/hocs/withAuth.tsx`
initially imported `AUTH_COOKIE_NAME` from `@/server/auth`, which would have pulled the entire
server module graph (jose, Prisma) into a file living in `shared/`. Fixed by moving the constant to
`src/shared/constants/cookies.ts`, a plain string with no framework or server coupling, imported by
both `src/server/auth.ts` and `src/shared/hocs/withAuth.tsx`.
