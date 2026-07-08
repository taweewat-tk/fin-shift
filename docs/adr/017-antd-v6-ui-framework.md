# ADR-017: UI framework — Ant Design v6 retained after comparison research

## Status

Accepted.

## Context

Evaluated against shadcn/ui, Mantine v8, MUI, HeroUI, and Gluestack for a data-dense CRUD +
dashboard + mobile-first (webview) financial app.

## Decision

Ant Design v6 + antd-mobile v5 (mobile), Tailwind v4 scoped to layout/utility classes only (as
kor-it-ui already does). Findings: Ant Design owns the enterprise-dashboard niche with the richest
built-in Table/Form/DatePicker/Statistic components — least custom code needed for financial CRUD
UIs. Fully MIT (no paid tier), unlike MUI whose advanced DataGrid/date-pickers require paid MUI X
Pro/Premium. v6 (Nov 2025) removed antd's historical performance weakness via zero-runtime style
generation and a bundled React Compiler, and is React-19-native — the
`@ant-design/v5-patch-for-react-19` shim kor-it-ui still needs (pinned to antd v5 + React 19) is
**not** installed in this project. Mantine (own styling engine, third-party data tables) and shadcn
(hand-assemble tables/pickers) would both forfeit kor-it-ui pattern reuse for marginal gains.

## Consequences

`src/app/layout.tsx` omits the `@ant-design/v5-patch-for-react-19` import that kor-it-ui's root
layout has — confirmed unnecessary and correctly omitted this round, since this project installs
`antd@6.5.0`, not v5.
