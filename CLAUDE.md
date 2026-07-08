# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status: pre-code / greenfield

There is **no source code yet**. The repository currently contains `PLAN.md` (the *what*) and `STRUCTURE.md` (the *how* — directory skeleton + module boundaries), and it is not yet a git repository. Both are **sources of truth** — read them in full before implementing anything. The sections below summarize their binding decisions; if this file disagrees with them, they win.

**This project follows the conventions of the sibling app `../Korit/kor-it-ui`** (structure, tooling, naming) — read `STRUCTURE.md` (ADR-006…014). Key points:
- **Full-stack Next.js with kor-it-ui's frontend org.** Backend = `src/server/*` (Prisma, jose — SERVER-ONLY, never imported by client) + REST/zod route handlers under `src/app/api/v1/*`. Frontend = `src/modules/<feature>/*` + `src/shared/services/api/*` (axios) calling our own `/api/v1`, via React Query hooks in `src/shared/hooks/api`.
- **Layout/tooling mirror kor-it-ui:** `(private)/(public)` route groups, versioned `api/v1`, **zustand** state, **Tailwind v4 + Ant Design**, husky + commitlint (conventional commits) + lint-staged + pre-push gate, `.nvmrc`.
- **Auth = `jose` JWT, dual transport (ADR-012):** signed on login, accepted as an HTTP-only cookie (web) OR `Authorization: Bearer` (native app). `requireUser()` in `src/server/auth.ts` reads either. **Any auth work must preserve native-app login.** Not NextAuth.
- **The pure billing-cycle engine lives at `src/shared/utils/billing-cycle.ts`** — imports nothing from React/Next/Prisma; it's the seam the future native app extracts.
- **Deviation from kor-it-ui:** we add `src/server/` (kor-it-ui is frontend-only and has none) to keep server code out of the client bundle; and we use **Vitest**, not kor-it-ui's Jest, because we need real-DB integration tests.

## What this app is

A mobile-first web app for a Thai (THB) user + family to record credit-card expenses and get **billing-cycle reminders**, helping plan spending for "maximum efficiency." The vague goal was pinned to four sub-goals, built in **phases**: (1) track/visualize, (2) maximize interest-free **float** + never miss a due date, (3) maximize rewards.

## Non-negotiable constraints (do not re-litigate)

- **API-first.** A native app is planned that logs the user in and wraps this web app in a **webview**. So Next.js **route handlers are a clean JSON API**, the UI consumes them via React Query, and the session is a **JWT** the native shell can carry. No server-only coupling that a webview can't reuse.
- **Mobile-first responsive** UI throughout.
- **Multi-user + auth from day one** (family scope); every query is scoped per user — users must never see each other's data.
- **Manual expense entry only for MVP.** A browser cannot read phone SMS; email/SMS auto-capture is deferred to the future native companion, which will POST to the same API.
- **THB single currency.** Thai issuers (KBank, SCB, KTC, Citi, …).
- **Rewards stay simple**: flat-rate default, schema left extensible; no rotating/tiered engine now.

## Correctness-critical core

The **billing-cycle engine** (planned `src/lib/billing-cycle.ts`) is the heart of the app and must be **pure and unit-tested first (TDD)**. It computes: which cycle a purchase falls into, statement closing date, payment due date (`closing + graceDays`), float days, and best-card-for-float. It **must handle month-length clamping** — a `statementClosingDay` of 31 means "last day of month" (Feb, 30-day months). Float and per-cycle totals are always relative to the cycle a purchase belongs to.

## Testing / TDD (see `TESTING.md`, ADR-010)

Build **test-first**. Runner is **Vitest** (not Jest). Layered pyramid: **strict TDD** on the pure engine + zod schemas (unit); **integration** tests for API routes against a **real Postgres test DB** (`creditcard_test`, reset per test) that must assert the **per-user isolation invariant** (every integration test uses ≥2 users); **smoke** tests for key UI; a few **Playwright** E2E flows at the end of Phase 1. Start every feature from the failing unit test. Primary loop: `npm run test:watch`.

## Intended stack (from PLAN.md; matches sibling `../Korit/kor-it-ui`)

**Next.js 16 (App Router, latest stable — 16.2.x) + React 19.2.x + TypeScript 6.** This intentionally diverges from kor-it-ui (Next 15.5, TS 5, antd v5) — per user instruction, every dependency in this project is pinned to **latest stable**, verified live via `npm view <pkg> dist-tags` and re-checked at scaffold time (ADR-015, ADR-016). Rest of stack: **Ant Design v6** (kept after researching MUI/Mantine/shadcn — see ADR-017; richest built-in tables/forms for a financial app, MIT/free unlike MUI X, v6 fixed antd's historical perf issues and is React-19-native) + antd-mobile v5 + Tailwind v4, @tanstack/react-query, zustand, axios, dayjs, react-hook-form + zod, lucide-react. Prisma + PostgreSQL (Docker). Auth = `jose` JWT (dual transport: cookie + Bearer), not NextAuth. Reminders via a cron route → in-app list + email.

## Commands

None wired up yet. Once scaffolded via `create-next-app`, the expected scripts mirror `../Korit/kor-it-ui`'s naming but run on **Vitest**, not Jest (see `TESTING.md`, ADR-010): `npm run dev`, `npm run build`, `npm run lint` / `lint:fix`, `npm run type-check` (`tsc --noEmit`), `npm run test` / `test:watch` (Vitest), `npm run test:e2e` (Playwright), `npm run format`. Run a single test with `npm run test -- <path-or-name-pattern>`. **Update this section as soon as `package.json` exists.**
