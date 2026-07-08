# ADR-002: Manual expense entry only for MVP

## Status

Accepted.

## Context

A browser cannot read phone SMS or email inboxes to auto-capture card transactions. Building an
auto-capture pipeline now would be speculative work for a channel (native app) that doesn't exist
yet.

## Decision

MVP supports manual expense entry only, via the same `/api/v1/expenses` endpoints any future
client would use. Email/SMS auto-capture is deferred to the future native companion app, which
will POST to this same API rather than requiring a separate ingestion path.

## Consequences

The Expense API shape must not assume a particular entry method — manual and future auto-captured
expenses are indistinguishable rows. No parsing/ingestion code exists in this MVP.
