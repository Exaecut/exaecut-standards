# Contributing

This repository is the source of truth for Exaecut's formatter, lint and structural rules. Changes affect
every consumer, including public prgpu effect projects, so rules are added deliberately and verified
against real code.

## Adding or changing a rule

1. Create the rule file under `ast-grep/rules/<pack>/<rule-id>.yml`. One rule per file, file name equals the
   rule id. Use `id`, `language`, `severity`, `message`, `note`, `rule`, and `files`/`ignores` when scoped.
2. Add `ast-grep/rule-tests/<rule-id>-test.yml` with at least two `valid` and two `invalid` snippets.
   Include the real-world shapes the rule is meant to catch, not only minimal examples.
3. Run `npx ast-grep test --include-off`. If a rule has an output snapshot, generate it with
   `npx ast-grep test --include-off -f <rule-id> --update-all` and **inspect the snapshot**. The primary
   label must point at the intended construct and nowhere else.
4. Add the rule to `docs/RULES.md` (id, pack, language, severity, why, how to fix).
5. Add an entry to `CHANGELOG.md` under the next version.
6. Run `npm test` from the repository root. It runs ast-grep tests and Biome over this repository.

For a TypeScript rule that must also apply to `.tsx`, add a second rule file with `language: Tsx` and the
suffix `-tsx` in the id. ast-grep selects files by language, so a TypeScript rule does not scan `.tsx`.

Before merging, scan at least one real consumer repository read-only and classify every finding as a true
positive or a false positive. Tune until there are zero false positives. Report the counts in the change
description.

### Rule quality checklist

- The message is one sentence and tells the reader what is wrong.
- The note explains why it matters and how to fix it, in two to four lines.
- File globs use a leading `**/` so they work from a consumer root and inside monorepos.
- Test snippets include the false-positive shapes that the rule must ignore.
- No placeholder text in rule messages or notes.

## Severity policy

- `error`: correctness, security or contract violations. Blocks CI.
- `warning`: maintainability or review issues that need judgement.
- `off`: placeholders only. A rule that is off is excluded from normal `ast-grep test` runs, so the test
  script uses `--include-off` to keep the placeholder covered.

Do not downgrade an `error` rule to `warning` to make a consumer pass. Fix the code, or change the rule in
this repository with a migration note.

## Semver policy

While the project is `0.x`:

- New error rule, new rule pack or new preset: **minor**.
- Stricter existing rule, renamed rule or changed rule id: **minor** with a migration note in
  `CHANGELOG.md`.
- Bug fix or documentation: **patch**.
- Removal or incompatible preset change: **minor** with an explicit migration section.

After `1.0.0`, removal and incompatible changes are **major**. Consumers pin a tag in the submodule, so
document the old and new tag in the migration note.

## Verification

```sh
npm test
```

This runs `ast-grep test --include-off` and `biome check .`. Both must pass before a change is merged.
