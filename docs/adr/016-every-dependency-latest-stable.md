# ADR-016: Every dependency pinned to latest stable

## Status

Accepted, with implementation-time deviations recorded below.

## Context

Per user instruction, every dependency is pinned to the latest stable release, verified live via
`npm view <pkg> dist-tags`, not just assumed from documentation. This must be re-verified at actual
scaffold time, since "latest" drifts between planning and implementation.

## Versions verified at scaffold time (2026-07-08)

Runtime: `next@16.2.10`, `react`/`react-dom@19.2.7`, `typescript@6.0.3`, `antd@6.5.0`,
`antd-mobile@5.42.3`, `@ant-design/nextjs-registry@1.3.0`, `@tanstack/react-query@5.101.2`,
`zustand@5.0.14`, `axios@1.18.1`, `dayjs@1.11.21`, `react-hook-form@7.81.0` (bumped from 7.80.0
since the 2026-07-04 planning audit), `zod@4.4.3`, `@hookform/resolvers@5.4.0`,
`lucide-react@1.23.0`, `tailwind-merge@3.6.0`, `tailwindcss`/`@tailwindcss/postcss@4.3.2`,
`prisma`/`@prisma/client@7.8.0`, `bcrypt@6.0.0`, `jose@6.2.3`, `js-cookie@3.0.8`.

Dev/test/tooling: `vitest`/`@vitest/coverage-v8@4.1.10` (bumped from 4.1.9), `jsdom@29.1.1`,
`@testing-library/react@16.3.2` + `jest-dom@6.9.1` + `user-event@14.6.1`,
`@playwright/test@1.61.1`, `husky@9.1.7`, `@commitlint/cli@21.2.1` +
`config-conventional@21.2.0` (the `cli` and `config-conventional` packages are versioned
independently upstream — 21.2.1 does not exist for `config-conventional`), `lint-staged@17.0.8`,
`prettier@3.9.4` + `prettier-plugin-tailwindcss@0.8.0`, `eslint-config-next@16.2.10`,
`eslint-config-prettier@10.1.8`, `eslint-plugin-import@2.32.0`, `eslint-plugin-prettier@5.5.6`,
`eslint-plugin-react@7.37.5`, `eslint-plugin-react-hooks@7.1.1`,
`@typescript-eslint/eslint-plugin`/`parser@8.63.0` (bumped from 8.62.1).

## Deviations discovered during implementation

- **`eslint` pinned to 9.39.4, not the `latest` dist-tag 10.6.0.** Two independent, current
  incompatibilities: (1) `@typescript-eslint@8.63.0`'s scope manager does not implement
  `scopeManager.addGlobals`, a method eslint 10's internal `SourceCode.finalize` now calls —
  linting any `.ts`/`.tsx` file crashes outright. (2) `@eslint/eslintrc`'s `FlatCompat` bridge
  (used to load legacy `plugin:x/recommended` configs) throws `Converting circular structure to
  JSON` under eslint 10 when translating `eslint-plugin-react`'s config. Neither is a config bug —
  the TypeScript-ESLint/eslint-plugin-import/eslint-plugin-react ecosystem has not yet caught up to
  eslint 10 (very recently released). Downgraded to the latest 9.x instead of blindly following the
  "latest" mandate into a non-functional lint setup. `eslint.config.mjs` was also rewritten to
  build directly from each plugin's native flat-config exports and `eslint-config-next`'s own
  bundled flat array, rather than kor-it-ui's `FlatCompat` approach — avoids the bridge entirely
  and sidesteps double-registering plugins that `eslint-config-next` already bundles
  (`react`, `react-hooks`, `import`, `@typescript-eslint`).
- **`--legacy-peer-deps` used for the whole install.** `eslint-plugin-import@2.32.0` and
  `eslint-plugin-react@7.37.5`'s published peer ranges cap at eslint `^9`/`^9.7`; even on the
  eslint 9.39.4 pin this is satisfied, but React 19.2 vs some transitive antd/antd-mobile peer
  ranges still produced `ERESOLVE` warnings resolved this way.
- **Prisma 7 removed `datasource.url` from `schema.prisma`.** The CLI now reads the connection
  string from a new `prisma.config.ts` (`datasource.url`, loaded via `import 'dotenv/config'`), and
  `PrismaClient` requires an explicit driver adapter at runtime — added `@prisma/adapter-pg` + `pg`
  + `@types/pg`. This is a genuine Prisma 7 architecture change (confirmed via Prisma's own docs,
  fetched live during implementation), not a version-pinning mistake.
- **Added `dotenv@17.4.2`, `dotenv-cli@11.0.0`, `tsx@4.23.0`** — not in the original STRUCTURE.md
  dependency list. `dotenv` is needed by `prisma.config.ts` and the Vitest integration setup;
  `dotenv-cli` powers the `db:test:migrate` script (applying migrations against `.env.test`
  without permanently exporting it); `tsx` runs `prisma/seed.ts` (referenced by
  `prisma.config.ts`'s `migrations.seed`).
- **`bcrypt` (the native module) built and worked without issue** on this machine — the
  `bcryptjs` fallback anticipated in the original plan was not needed.

## Consequences

Re-verify `npm view <pkg> dist-tags.latest` again before any future dependency bump, especially
around eslint 10 — once the TypeScript-ESLint/import/react plugin ecosystem catches up, this
project should revisit the 9.x pin.
