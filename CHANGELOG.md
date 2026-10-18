# Changelog

All notable changes to this repository are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses semantic versioning.

## 0.1.0 — initial rule packs

### Added

- Biome presets: `biome/base.jsonc`, `biome/node.jsonc`, `biome/next.jsonc`.
- Knip base configuration: `knip/base.mjs`.
- `ts-core` pack (TypeScript and TSX):
  - `ts-no-ts-suppression-comments`
  - `ts-no-eslint-directives`
  - `ts-no-double-cast`
  - `ts-no-empty-catch`
  - `ts-no-noop-promise-catch`
  - TSX variants: `ts-no-ts-suppression-comments-tsx`, `ts-no-eslint-directives-tsx`,
    `ts-no-double-cast-tsx`, `ts-no-empty-catch-tsx`, `ts-no-noop-promise-catch-tsx`
- `fastify-api` pack:
  - `api-rls-context-required`
  - `api-no-request-cast`
  - `api-http-error-code-format`
  - `api-sql-no-dynamic-interpolation`
  - `api-no-process-env`
  - `api-no-console`
- `rust-core` pack:
  - `rust-unsafe-requires-safety-comment`
  - `rust-unsafe-fn-requires-safety-doc`
  - `rust-no-dbg`
  - `rust-no-todo`
  - `rust-no-unwrap-in-lib`
  - `rust-no-print-in-lib`
- `prgpu` placeholder rule and research brief.
- `next-app` placeholder brief.
- Rule catalog (`docs/RULES.md`) and consumer guide (`docs/CONSUMING.md`).
- CI workflow and Renovate configuration.
