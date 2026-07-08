# ADR-012: `jose` JWT with dual transport, for native login

## Status

Accepted.

## Context

The web app authenticates via an httpOnly cookie (can't be read/exfiltrated by client JS, doesn't
need CSRF-prone alternatives). The future native app wraps this app in a webview with no shared
cookie jar, and needs to carry a bearer token instead. Both must be served by the same login
endpoint and the same `requireUser()` check — not two parallel auth systems.

## Decision

`src/server/auth.ts`: `signToken`/`verifyToken` using `jose` (HS256, `JWT_SECRET`). `requireUser()`
reads the token from **either** the `token` httpOnly cookie **or** an `Authorization: Bearer`
header, verifying whichever is present, then loads the user from Prisma. `register`/`login` set
the cookie *and* return the token in the response body, so a native client can pull the token out
of the JSON without ever touching cookies.

## Consequences

Verified manually (M8): a full register → cookie-authenticated `/api/v1/me` → `/dashboard` flow
works with zero explicit token handling in curl (cookie jar only); a separate login →
`Authorization: Bearer <token>` call to `/api/v1/me` with **no cookie at all** also succeeds,
proving the native path. A request with neither transport gets 401. Any future auth-adjacent
change must preserve both paths — this is called out explicitly in CLAUDE.md.
