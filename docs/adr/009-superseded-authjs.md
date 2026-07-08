# ADR-009: Superseded by ADR-012

## Status

Superseded.

## Context

An earlier draft of this project considered Auth.js (NextAuth) Credentials provider for
authentication.

## Decision

Superseded by ADR-012: `jose`-signed JWTs with dual transport (httpOnly cookie for web,
`Authorization: Bearer` for native), not Auth.js. Auth.js's session model doesn't naturally hand a
bearer token to a native shell without extra plumbing, and this project already needed
first-party control over the token to support both transports cleanly.
