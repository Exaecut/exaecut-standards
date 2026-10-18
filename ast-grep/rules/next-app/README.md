# next-app rule pack

**STATUS: PLACEHOLDER — no rules yet**

This directory is reserved for rules specific to the Next.js applications (`exaecut-app`, `landing`). Biome's
`next` and `react` domains in `biome/next.jsonc` cover framework-level linting; ast-grep rules should cover
the application contracts that Biome cannot express.

Candidate rule areas to investigate before writing a rule:

- No secrets or `process.env` reads in client components; server-only configuration stays on the server.
- Call the API through the generated `@exaecut/api` SDK, not raw `fetch` to the API origin.
- Mark server-only modules explicitly and prevent them from being imported into client components.
- Use `next/image` for content images rather than raw `<img>`.

Deliverable format when the pack is written:

- One rule per file under this directory, file name equal to the rule id, id prefixed `next-`.
- `language: TypeScript` or `language: Tsx` as appropriate. Remember that a TypeScript rule does not scan
  `.tsx`; add a `-tsx` variant when both extensions are in scope.
- A test file per rule with at least two `valid` and two `invalid` snippets taken from real application code.
- Catalog rows in `docs/RULES.md`, a `CHANGELOG.md` entry, and zero false positives on the applications
  scanned read-only.
- `npm test` must pass.
