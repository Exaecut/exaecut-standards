# Consuming the standards

This guide is for repositories that mount `exaecut-standards` at `.standards/`. The submodule path is a
convention: every example below assumes it, and the rule globs are written to work inside monorepos.

## Add the submodule

From the consumer repository root:

```sh
git submodule add https://github.com/exaecut/exaecut-standards.git .standards
git -C .standards checkout v0.1.0
git add .gitmodules .standards
git commit -m "chore: add exaecut standards submodule"
```

The checkout pins the submodule to the release tag. Commit the resulting gitlink; consumers should never
track the submodule's `main` branch directly.

Cloning a consumer that already has the submodule:

```sh
git clone --recurse-submodules <consumer-repo>
# or, after a normal clone:
git submodule update --init
```

## CI checkout

GitHub Actions must check out submodules explicitly:

```yaml
- uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
  with:
    submodules: true
```

`submodules: true` checks out the pinned commit. Use `submodules: recursive` only when the standards
repository itself gains nested submodules.

## Biome

Add the presets to the consumer's `biome.json` or `biome.jsonc`:

```json
{
  "extends": [
    "./.standards/biome/base.jsonc",
    "./.standards/biome/node.jsonc"
  ]
}
```

Use `./.standards/biome/next.jsonc` instead of `node.jsonc` for Next.js apps. `base.jsonc` sets the formatter
and the org-wide linter baseline; the Node and Next presets add environment-specific rules. The presets point
at the public schema URL `https://biomejs.dev/schemas/2.5.15/schema.json`, so no consumer-relative schema
path is needed.

Biome resolves `extends` values relative to the config file that declares them, so the paths above work when
`biome.json` sits at the consumer root. The preset enables `vcs.useIgnoreFile`, which requires a `.gitignore`
in the consumer; every repository has one.

## ast-grep

Install the pinned CLI in the consumer:

```sh
npm install --save-dev --save-exact @ast-grep/cli@0.51.0
```

Create or extend `sgconfig.yml` at the consumer root. Point at only the packs the repository needs:

```yaml
ruleDirs:
  - .standards/ast-grep/rules/ts-core
  - .standards/ast-grep/rules/fastify-api
testConfigs:
  - testDir: .standards/ast-grep/rule-tests
```

For a Rust repository use the Rust packs instead:

```yaml
ruleDirs:
  - .standards/ast-grep/rules/rust-core
  # add .standards/ast-grep/rules/prgpu once the prgpu pack is written
```

Run the scan from the consumer root:

```sh
npx ast-grep scan
```

The rule `files` and `ignores` globs use leading `**/`, so they match paths from a consumer root and inside
workspaces such as `packages/api/src`. Rules scoped to `**/src/**` therefore apply to each package that has
its own `src/` directory.

To run the shared tests locally, add the `testConfigs` entry and run:

```sh
npx ast-grep test
```

`severity: off` rules are skipped unless you pass `--include-off`; this repository's own test script does so
to keep the prgpu placeholder covered.

## Knip

Import the base object and spread it into the consumer configuration:

```ts
// knip.config.ts
import base from "./.standards/knip/base.mjs";

export default {
  ...base,
  entry: ["src/index.ts"],
  project: ["src/**/*.ts"],
};
```

The base enables `ignoreExportsUsedInFile`, which avoids reporting an export that is only used in its own
file. Add consumer-specific `entry`, `project`, `ignore` and workspace settings after the spread.

If the consumer's TypeScript configuration does not allow JavaScript imports, add `allowJs` for the config
file or import with a type assertion supported by the consumer's tooling. Knip loads `.mjs` configuration
natively.

## Renovate

Renovate's `git-submodules` manager updates the pinned commit when a new tag is available. The standards
repository is public, so no credentials are required. A typical policy:

```json
{
  "packageRules": [
    {
      "matchManagers": ["git-submodules"],
      "matchDepNames": ["exaecut-standards"],
      "automerge": false
    }
  ]
}
```

Keep submodule upgrades manual: a new tag can add an error rule, and the consumer needs a green CI run
before the gitlink moves. Group the submodule update with the code changes that satisfy the new rules.

## Upgrade procedure

1. Read `CHANGELOG.md` in the new tag, especially migration notes.
2. Fetch tags and check out the new release:

   ```sh
   git -C .standards fetch --tags
   git -C .standards checkout v0.2.0
   ```

3. Run the consumer's formatter, linter, ast-grep scan and tests. Fix new findings.
4. Commit the updated gitlink together with any code changes:

   ```sh
   git add .standards
   git commit -m "chore: bump exaecut standards to v0.2.0"
   ```

5. If a rule is wrong for the consumer, open an issue or pull request in `exaecut-standards` rather than
   disabling the rule locally. Local overrides fragment the standard.

To roll back, check out the previous tag in `.standards/` and commit the gitlink. The submodule is a normal
git repository, so `git -C .standards checkout v0.1.0` is enough.
