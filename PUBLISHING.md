# Publishing & verification

This package is ready to publish. The steps below need **your** npm account and, for
verification, an n8n.io account — they can't be done on your behalf.

## 0. Pre-flight (already passing)

```bash
npm ci        # clean install
npm run lint  # 0 errors (n8n community ruleset)
npm run build # compiles to dist/ + copies icons & codex
```

## 1. Set the real repository URL

`package.json` currently points to a placeholder GitHub URL
(`lagrowthmachine/n8n-nodes-lagrowthmachine`). Create that repo (or change the URL)
and push:

```bash
git remote add origin git@github.com:<org>/n8n-nodes-lagrowthmachine.git
git push -u origin main
```

## 2. Publish to npm

```bash
npm login
npm publish --access public
```

`prepublishOnly` runs the build + strict lint automatically before the package is
uploaded, so a broken build can't be published.

> Tip: to preview the exact tarball without publishing: `npm pack` (inspect the `.tgz`).

## 3. Install on n8n

- **Self-hosted**: Settings → Community Nodes → Install → `n8n-nodes-lagrowthmachine`.
- **n8n Cloud**: only **verified** community nodes install on Cloud — do step 4 first.

## 4. Submit for n8n verification

Verified nodes appear in the in-app node search and are installable on n8n Cloud.
Follow n8n's submission process: <https://docs.n8n.io/integrations/community-nodes/build-community-nodes/#verify-your-node>

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
