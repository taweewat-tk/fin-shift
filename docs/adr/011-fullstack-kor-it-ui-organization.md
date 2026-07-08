# ADR-011: Full-stack Next.js with kor-it-ui's frontend organization

## Status

Accepted.

## Context

kor-it-ui (sibling app, frontend-only) has an established, working convention for organizing a
Next.js frontend: `modules/<feature>/*` for feature code, `shared/services/api/<domain>/*` (axios)
for the API client layer, and `shared/hooks/api/{queries,mutations}` for React Query hooks. There's
no reason to invent a new convention when a working one already exists in this org.

## Decision

Adopt kor-it-ui's frontend layout wholesale, adding `src/server/*` for the backend half this
project has and kor-it-ui doesn't (ADR-014). Frontend code calls **our own** `/api/v1`, through the
same services-layer + React Query hook pattern kor-it-ui uses for its (currently mocked) API.

## Consequences

`src/shared/services/{axios.ts,interceptor.ts,request-url.ts}` and
`src/shared/hooks/api/{queries,mutations}/<domain>/` mirror kor-it-ui's shape exactly (verified by
reading kor-it-ui's actual source this round). The one deliberate deviation: kor-it-ui's cookie is
readable by JS (`js-cookie`) so its interceptor reads/decodes it and attaches Bearer manually; ours
is httpOnly (ADR-012), so the browser sends it automatically and the interceptor only injects
Bearer for the future native case.
