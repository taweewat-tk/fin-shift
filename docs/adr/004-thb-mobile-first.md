# ADR-004: THB single currency, mobile-first UI

## Status

Accepted.

## Context

The user and family are in Thailand, using Thai-issued cards (KBank, SCB, KTC, Citi, etc.), and the
eventual native app is a webview — so the UI must work well on a phone screen from day one.

## Decision

All amounts are THB; no multi-currency support. `Expense.amount` and `Card.creditLimit` are
`Decimal(12,2)` with no currency column. The Thai issuer list is a shared constant
(`src/shared/constants/thai-issuers.ts`) offered as suggestions in the future card-creation form,
not a hard constraint. UI is built mobile-first with Tailwind v4 + Ant Design v6 + antd-mobile v5.

## Consequences

Adding multi-currency later would require a schema migration (an `currency` column plus
conversion logic) — deliberately deferred since it's out of scope for the stated goals.
