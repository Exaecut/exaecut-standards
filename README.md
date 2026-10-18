# Exaecut standards

Shared engineering standards for Exaecut repositories and for third parties building video effects with
[prgpu](https://github.com/exaecut/prgpu). The repository ships three things:

- **Biome presets** for formatting and linting TypeScript, Node services and Next.js apps.
- **ast-grep rule packs** for structural rules that Biome cannot express, including Rust rules.
- **Knip defaults** for unused-code detection.

Consumers mount this repository as a git submodule at `.standards/` and point their own tooling at the
relevant files. The repository is dual-licensed **MIT OR Apache-2.0**.

## Who it is for

- Exaecut-owned repositories: `exaecut-api`, `exaecut-app`, `landing`, `prgpu`, `create-video-effect` and
  `effects`.
- Third-party developers writing Adobe video effects with prgpu and starting from a `create-video-effect`
  template. The Rust rules and the prgpu pack are written for that audience.

## Quick start

Add the standards as a submodule pinned to a release tag:

```sh
git submodule add https://github.com/exaecut/exaecut-standards.git .standards
git -C .standards checkout v0.1.0
```

Then wire up the pieces a repository needs.

### Biome

```json
{
  "extends": [
    "./.standards/biome/base.jsonc",
    "./.standards/biome/node.jsonc"
  ]
}
```

Use `base.jsonc` plus `node.jsonc` for Node services, and `base.jsonc` plus `next.jsonc` for Next.js apps.
The presets reference the public schema URL, so consumers need no local schema path.

### ast-grep

```yaml
# sgconfig.yml
ruleDirs:
  - .standards/ast-grep/rules/ts-core
  - .standards/ast-grep/rules/fastify-api
testConfigs:
  - testDir: .standards/ast-grep/rule-tests
```

Install `@ast-grep/cli` in the consumer and run `ast-grep scan`. The `testConfigs` entry lets consumers run
the shared rule tests with `ast-grep test`; it is optional.

### Knip

```ts
// knip.config.ts
import base from "./.standards/knip/base.mjs";

export default {
  ...base,
  entry: ["src/index.ts"],
};
```

## Rule packs

| Pack | Language | Purpose |
| --- | --- | --- |
| `ts-core` | TypeScript, TSX | Suppression hygiene, unsafe casts, error swallowing, no-op promise handlers. |
| `fastify-api` | TypeScript | Row-level-security context, request validation, HTTP error codes, SQL parameters, env and console use. |
| `rust-core` | Rust | Unsafe justification, public unsafe docs, debug/todo macros, unwrap and printing in libraries. |
| `prgpu` | Rust | Placeholder for prgpu-specific rules; see `ast-grep/rules/prgpu/README.md`. |
| `next-app` | TypeScript, TSX | Placeholder for Next.js rules; see `ast-grep/rules/next-app/README.md`. |

`docs/RULES.md` is the full catalog with rationale and fixes. `docs/CONSUMING.md` covers submodule setup,
CI, Renovate and upgrades in detail.

## Severity policy

- **error** blocks CI. Fix the finding or change the rule in this repository.
- **warning** requires reviewer judgement. Warnings are visible in `ast-grep scan` and in Biome.
- **off** is reserved for placeholders and temporarily disabled rules.

Every rule must have rule tests with at least two valid and two invalid snippets, and must have zero false
positives on the reference code used when the rule was introduced. See `CONTRIBUTING.md`.

## Versioning

Releases are git tags named `vMAJOR.MINOR.PATCH`. While the project is at `0.x`:

- A new **error** rule, a new pack or a new Biome preset is a **minor** release.
- A change that makes an existing rule stricter, renames a rule or changes a message in a way consumers
  match on is a **minor** release, and `CHANGELOG.md` must include a migration note.
- Bug fixes and documentation changes are **patch** releases.
- Removing a rule or changing a preset incompatibly is a **minor** release with an explicit migration
  section until `1.0.0`; after `1.0.0`, such changes are major.

Consumers pin a tag in the submodule and upgrade deliberately.

## License

Dual-licensed under either of:

- Apache License, Version 2.0 (`LICENSE-APACHE`)
- MIT License (`LICENSE-MIT`)

You may choose either license. Contributions are accepted under the same dual license.
