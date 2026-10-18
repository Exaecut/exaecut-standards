# Rule catalog

Every rule in this repository, with the reason it exists and how to resolve a finding. Rules are grouped by
pack. `files` and `ignores` globs are relative to the consumer repository root.

## ts-core

| Rule id | Pack | Language | Severity | Why | How to fix |
| --- | --- | --- | --- | --- | --- |
| `ts-no-ts-suppression-comments` | ts-core | TypeScript | error | `@ts-ignore`, `@ts-nocheck` and `@ts-expect-error` hide type errors from readers and CI. | Fix the type error, narrow the boundary with a runtime check, and delete the directive. |
| `ts-no-eslint-directives` | ts-core | TypeScript | error | Exaecut lints with Biome; eslint directives do nothing and rot silently. | Use `// biome-ignore <rule>: <reason>` with a reason, or remove the directive. |
| `ts-no-double-cast` | ts-core | TypeScript | warning | `as unknown as` disables assignability checks and moves a compile-time error to runtime. | Validate or parse the value at the boundary, or fix the source type. Isolate an unavoidable escape hatch in one adapter. Test files are ignored. |
| `ts-no-empty-catch` | ts-core | TypeScript | error | An empty catch swallows failures and makes incidents unexplainable. | Handle or rethrow the error. Add an explanatory comment inside the block when ignoring it is intentional. |
| `ts-no-noop-promise-catch` | ts-core | TypeScript | warning | `catch(() => {})` and `catch(() => undefined)` look like handling but discard the rejection. | Handle or rethrow the rejection, or use `void promise` when fire-and-forget is truly intended. Test files are exempt (best-effort cleanup). |
| `ts-no-ts-suppression-comments-tsx` | ts-core | TSX | error | Same as the TypeScript rule, for `.tsx` files. | Same as the TypeScript rule. |
| `ts-no-eslint-directives-tsx` | ts-core | TSX | error | Same as the TypeScript rule, for `.tsx` files. | Same as the TypeScript rule. |
| `ts-no-double-cast-tsx` | ts-core | TSX | warning | Same as the TypeScript rule, for `.tsx` files. | Same as the TypeScript rule. Test files are ignored. |
| `ts-no-empty-catch-tsx` | ts-core | TSX | error | Same as the TypeScript rule, for `.tsx` files. | Same as the TypeScript rule. |
| `ts-no-noop-promise-catch-tsx` | ts-core | TSX | warning | Same as the TypeScript rule, for `.tsx` files. | Same as the TypeScript rule. |

## fastify-api

These rules are scoped to `**/src/**` and ignore `**/*.test.ts` unless noted. `api-rls-context-required` is
further scoped to `**/src/routes/**` and `**/src/modules/**`.

| Rule id | Pack | Language | Severity | Why | How to fix |
| --- | --- | --- | --- | --- | --- |
| `api-rls-context-required` | fastify-api | TypeScript | error | Querying the raw pool bypasses the row-level-security context. | Use `withUserContext`, `withServiceContext` or `withMachineContext` and query with the provided `client`. |
| `api-no-request-cast` | fastify-api | TypeScript | warning | `request.body as T` asserts a shape that was never validated. | Declare the route schema so Fastify validates and types the input, then read it without a cast. |
| `api-http-error-code-format` | fastify-api | TypeScript | error | Error codes are part of the wire contract and must stay predictable. | Use lower_snake_case such as `bad_request`; only use the `domain/` prefix for a legacy wire contract. |
| `api-sql-no-dynamic-interpolation` | fastify-api | TypeScript | error | Interpolating into SQL invites injection and defeats statement caching. | Pass values through `$1` parameters. A single SCREAMING_SNAKE_CASE module constant is allowed for reusable SQL fragments. |
| `api-no-process-env` | fastify-api | TypeScript | error | Scattered environment reads make configuration implicit and untestable. | Parse and validate variables once in `src/config.ts`, then inject the typed config. |
| `api-no-console` | fastify-api | TypeScript | warning | `console` bypasses structured logging, correlation and log levels. | Use `request.log` or `app.log`. `console.error`, `console.warn` and `console.info` are allowed; test files are exempt. |

## rust-core

Rust rules apply to any crate. `rust-no-unwrap-in-lib` and `rust-no-print-in-lib` are scoped to `**/src/**`
and exclude tests, examples, benches, build scripts and inline `#[cfg(test)]` modules where noted.

| Rule id | Pack | Language | Severity | Why | How to fix |
| --- | --- | --- | --- | --- | --- |
| `rust-unsafe-requires-safety-comment` | rust-core | Rust | error | An unsafe block is a proof obligation that readers must be able to audit. | Put `// SAFETY: ...` directly above the block or above the statement containing it. |
| `rust-unsafe-fn-requires-safety-doc` | rust-core | Rust | warning | Callers of a public unsafe function need its exact preconditions. | Add a `# Safety` section to the doc comment listing every requirement. |
| `rust-no-dbg` | rust-core | Rust | error | `dbg!` writes to stderr outside the logging pipeline and is easy to leave behind. | Use `tracing`/`log` when diagnostics are needed, or remove the macro. |
| `rust-no-todo` | rust-core | Rust | warning | `todo!` and `unimplemented!` panic at runtime. | Implement the branch or return a typed error. |
| `rust-no-unwrap-in-lib` | rust-core | Rust | warning | A panic in library code takes down the caller and cannot be handled. | Use `?` with a typed error, match on the error, or `expect` only with a proven invariant. |
| `rust-no-print-in-lib` | rust-core | Rust | warning | Printing from a library makes output uncontrollable for embedders. | Return data to the caller or use `tracing`/`log`. |

## prgpu

| Rule id | Pack | Language | Severity | Why | How to fix |
| --- | --- | --- | --- | --- | --- |
| `prgpu-placeholder` | prgpu | Rust | off | Placeholder so the pack loads; it matches a call that never occurs in real code. | No action. The pack will be replaced by real prgpu rules. See `ast-grep/rules/prgpu/README.md`. |

## next-app

No rules yet. See `ast-grep/rules/next-app/README.md` for the candidate rule areas.
