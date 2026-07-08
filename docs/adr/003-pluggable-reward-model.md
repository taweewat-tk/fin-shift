# ADR-003: Pluggable reward model, flat-rate default

## Status

Accepted.

## Context

Goal #4 ("maximize rewards") is explicitly a Phase 3 concern. Real card reward rules (rotating
categories, tiered caps) are complex and not needed to deliver Phases 1–2's value (track/visualize,
maximize float, never miss a due date).

## Decision

Phase 3 adds a `RewardRule` model with a flat-rate default per card, but the schema is designed to
be extensible to category multipliers and caps later. No rotating/tiered engine is built now.

## Consequences

`RewardRule` does not exist in this round's schema (Phases 0–1 core only, per this implementation's
scope). When Phase 3 begins, `bestCardForFloat` in `src/shared/utils/billing-cycle.ts` extends to a
reward-aware recommendation without needing to change the float logic itself.
