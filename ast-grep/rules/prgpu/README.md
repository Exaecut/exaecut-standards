# prgpu rule pack

**STATUS: PLACEHOLDER — to be completed by a dedicated session**

You are the agent responsible for writing the prgpu rule pack. Read this document in full before touching
any rule. The only rule currently present is `prgpu-placeholder`, which is disabled and matches a call that
never occurs. Delete it and its test when the real pack lands.

## Goal

Write ast-grep rules that enforce correct, hygienic use of prgpu in three contexts:

1. prgpu itself, so the framework's own code follows its performance and safety contract.
2. `create-video-effect` templates, so generated projects start correct.
3. Third-party effects, so developers who never read prgpu's internals still produce safe, performant code.

Rules must catch real mistakes in real idioms. Do not write rules for hypothetical code. Every rule needs
evidence from the prgpu repository and must have zero false positives on prgpu's own code and on a freshly
generated `create-video-effect` project.

## Required research first

Do this before writing a rule:

1. Clone and read `https://github.com/exaecut/prgpu`. Focus on:
   - `src/` — public API, render loop, resource types, error types.
   - `prgpu-macro/` — what the macros generate and which low-level calls they replace.
   - `prgpu-build/` — shader compilation, binding/layout generation, build-time conventions.
   - `shaders/` — binding declarations, layout conventions, entry-point naming.
   - `docs/` — the documented contract, including performance guidance and lifetime rules.
   - `tests/` — the accepted idioms and the failure cases the maintainers care about.
   - `CHANGELOG.md` — API migrations and recently deprecated patterns.
2. Clone and read `https://github.com/exaecut/create-video-effect`. Focus on `templates/` and the generated
   project structure, including how effects declare parameters, resources and render callbacks.
3. Record the exact idioms you find. Each candidate rule must cite at least one file and line range from
   prgpu or a template as its motivating example.
4. Run the rules you write against both repositories in read-only mode and classify every finding.

If a candidate rule cannot be expressed without false positives, do not ship it. Document the attempted
shape and why it was rejected in the pull request.

## Candidate rule areas to investigate

Treat this as a research list, not a specification. Confirm each pattern against the actual code before
writing a rule.

- **Per-frame hot path allocations and synchronization.** Heap allocation, locking, logging, formatting or
  expensive cloning inside render/process callbacks that run every frame.
- **Buffer and texture lifetime and ownership.** Resources created on one side of the CPU/GPU boundary and
  used after release, dropped while in flight, or copied instead of borrowed. Look for the ownership types
  prgpu provides and flag raw handles used where the owner type is required.
- **Checked error propagation.** Kernel launches and device calls whose `Result` is discarded, or handled
  with `unwrap`/`expect` where prgpu defines a propagation path. Prefer the framework's error type.
- **Unsafe and FFI justification.** Every `unsafe` block and FFI call must carry a `// SAFETY:` comment that
  names the invariant and why it holds. Reuse the rust-core rule's shape but add prgpu-specific guidance
  when the invariant is a GPU contract.
- **Macros and builder APIs versus low-level calls.** Flag hand-written boilerplate that the prgpu macros or
  builders generate, when the generated form is the supported path. Do not flag deliberate low-level code
  inside prgpu's own implementation.
- **Shader binding and layout conventions.** Bindings that do not match the generated layout, missing
  bindings, wrong set/index, or shader entry points that do not follow the documented naming convention.
- **Deterministic resource cleanup.** Early returns, `?` paths and panics that skip releasing GPU resources.
  Look for the RAII types prgpu provides and flag manual cleanup that bypasses them.
- **Blocking I/O on the render thread.** File, network, database or channel operations that can block inside
  a per-frame callback.
- **Host-boundary parameter validation.** Effect parameters read from the host without range, type or
  presence checks before they reach shader uniforms or buffer writes.

## Deliverable format

- One rule per file under `ast-grep/rules/prgpu/`, file name equal to the rule id, id prefixed `prgpu-`.
- Fields: `id`, `language: Rust`, `severity`, one-line `message`, 2–4 line `note` with why and how to fix,
  `rule`, and `files`/`ignores` where scoped. Use leading `**/` in globs.
- One test file per rule under `ast-grep/rule-tests/`, named `<rule-id>-test.yml`, with at least two `valid`
  and two `invalid` snippets. Take snippets from real prgpu idioms, including the false-positive shapes the
  rule must ignore.
- Generate and inspect snapshots with `npx ast-grep test --include-off -f <rule-id> --update-all`.
- Add a row per rule to `docs/RULES.md` (id, pack, language, severity, why, how to fix).
- Add a `CHANGELOG.md` entry under the next version.
- Verify zero false positives by scanning a read-only clone of prgpu and a freshly generated
  `create-video-effect` project. Report counts per rule and examples of true positives.
- Run `npm test` in this repository and make it pass.

## Severity policy

- `error`: memory safety, GPU lifetime bugs, unchecked device errors, or violations that corrupt output.
- `warning`: performance regressions in per-frame paths, missing safety rationale, and maintainability
  issues that need reviewer judgement.
- `hint`: informational guidance that should not block CI.
- `off`: placeholders only. Do not ship a real rule as `off`.

## Cleanup

When the first real prgpu rules land, delete `ast-grep/rules/prgpu/prgpu-placeholder.yml`, its test file and
its snapshot. Remove the placeholder row from `docs/RULES.md` and replace this document with a short pack
overview that links to the catalog.
