# ADR-013: Adopt kor-it-ui conventions (layout, tooling, git hooks)

## Status

Accepted.

## Context

Reinventing tooling conventions (lint rules, commit message format, route grouping) for a sibling
app in the same org creates needless divergence with no benefit.

## Decision

Adopted directly from kor-it-ui, verified by reading its actual source this round: `modules/` +
`shared/` layout, `(private)`/`(public)` route groups, versioned `api/v1`, zustand for client
state, Tailwind v4 + Ant Design (+ lucide-react, tailwind-merge), and the git-hooks toolchain —
husky (`prepare` script) + commitlint (conventional commits, `.commitlintrc.js` copied verbatim) +
lint-staged + a `pre-push` gate (lint, type-check, format:check, `npm audit --omit=dev
--audit-level=high`, test), `.nvmrc`, ESLint flat config, Prettier (`.prettierrc` copied verbatim).

## Consequences

`.prettierrc`, `.commitlintrc.js`, and the husky hook *shell scripts* are byte-for-byte the same as
kor-it-ui's. The one place this project's `eslint.config.mjs` diverges structurally is documented
in ADR-016 (a version-compatibility issue with eslint 10, not a stylistic choice).
