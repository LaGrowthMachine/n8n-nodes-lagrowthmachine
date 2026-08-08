# Publishing & verification

This package is ready to publish. The steps below need **your** npm account and, for
verification, an n8n.io account — they can't be done on your behalf.

## 0. Pre-flight (already passing)

```bash
npm ci        # clean install
npm run lint  # 0 errors (n8n community ruleset)
npm run build # compiles to dist/ + copies icons & codex
```

> **Why the scoped name?** The unscoped `n8n-nodes-lagrowthmachine` is already taken
> on npm by a third party (`elevate_agency`, v1.0.0, Nov 2025). This official package
> is published under the LGM-owned scope **`@lagrowthmachine/n8n-nodes-lagrowthmachine`**.

## 1. Create the npm org (one-time, free)

The `@lagrowthmachine` scope must exist and be owned by your npm account. Create a
free org at <https://www.npmjs.com/org/create> (name: `lagrowthmachine`, free plan =
unlimited public packages). Add any teammates who should be able to publish.

## 2. Set the real repository URL

`package.json` points to a placeholder GitHub URL. Create the repo (or change the URL)
and push:

```bash
git remote add origin git@github.com:<org>/n8n-nodes-lagrowthmachine.git
git push -u origin main
```

## 3. Publish to npm

```bash
npm login
npm publish   # scope access is set to public via publishConfig
```

`prepublishOnly` runs the build + strict lint automatically before the package is
uploaded, so a broken build can't be published. `publishConfig.access = public` makes
the scoped package public (otherwise npm would try to publish it as private).

> Tip: to preview the exact tarball without publishing: `npm pack` (inspect the `.tgz`).

## 4. Install on n8n

- **Self-hosted**: Settings → Community Nodes → Install → `@lagrowthmachine/n8n-nodes-lagrowthmachine`.
- **n8n Cloud**: only **verified** community nodes install on Cloud — do step 5 first.

## 5. Submit for n8n verification

Verified nodes appear in the in-app node search and are installable on n8n Cloud.

Submit at the **n8n Creator Portal: <https://creators.n8n.io/nodes>**.

> ⚠️ **Provenance required (from 1 May 2026).** Nodes submitted for verification must
> be **published to npm via GitHub Actions with a provenance statement**. A manual
> `npm publish` from a laptop does NOT qualify. Use the included
> `.github/workflows/publish.yml`, which uses **npm Trusted Publishing (OIDC)** — no
> token to manage:
> 1. On npm: the package → Settings → **Trusted Publisher** → GitHub Actions → owner `LaGrowthMachine`, repo `n8n-nodes-lagrowthmachine`, workflow `publish.yml`.
> 2. `git pull && npm version patch && git push --follow-tags` → create a GitHub Release (the Action publishes with provenance over OIDC).
> 3. Then submit the (provenance-published) version at creators.n8n.io/nodes.
>
> n8n also reserves the right to reject nodes that compete with its paid/enterprise features.

Checklist the reviewer expects (all already satisfied here):

- [x] Package name starts with `n8n-nodes-`
- [x] `n8n-community-node-package` in `keywords`
- [x] Only `n8n-workflow` as a runtime dependency (no other prod deps)
- [x] `npm run lint` passes with the n8n community config
- [x] A credential with a `test` request
- [x] Icons (SVG) for every node
- [x] MIT license + README with install/credentials/operations

## Local testing (how this package was validated)

A local n8n was run in Docker with the node mounted via `N8N_CUSTOM_EXTENSIONS`, and
every operation was exercised against the live LGM API through a harness that drives
the compiled node's `execute()`. Message-send and conversation-mutation endpoints were
validated without side effects (dry-run / bogus IDs). See the test report for details.
