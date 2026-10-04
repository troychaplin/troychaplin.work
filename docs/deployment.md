# Deployment

The site is hosted on [Spacefast](https://spacefast.com) and served at
`troychaplin.work`. Production only changes when a version tag (`v*`) is pushed
to GitHub. Pushes to `main` or any other branch deploy nothing.

To cut a release, see [releasing.md](releasing.md).

## How it works

```text
git push --follow-tags (v1.4.0)
        │
        ▼
GitHub Actions — .github/workflows/release.yml
  pnpm install --frozen-lockfile → pnpm lint → pnpm build → npm i -g spacefast
        │
        ▼
sf publish ./dist --space curious-wind --prebuilt --spa true   (auth: SPACEFAST_TOKEN)
        │
        ▼
Spacefast space "troychaplin.work" (slug curious-wind)
  new immutable version (v1, v2, …) → promoted to the live channel
        │
        ▼
https://troychaplin.work   (www.troychaplin.work 308-redirects to it)
```

1. Pushing a `v*` tag starts the **Release** workflow.
2. The workflow installs dependencies, lints, and runs `pnpm build`, which
   type-checks and writes the static site to `dist/`.
3. It installs the `sf` CLI and runs `sf publish` on `dist/`. `--prebuilt` tells
   Spacefast to upload the folder as-is rather than build it again.
4. Spacefast stores the upload as a new **immutable version** and promotes it to
   live. `sf publish` waits until the version is live, so a failed publish fails
   the job.
5. The job summary lists the live URL, the Spacefast version (`v12`, …), and
   that version's permanent URL.
6. The workflow then creates a GitHub Release for the tag with auto-generated
   notes, unless one already exists.

When the CLI runs on GitHub Actions, it reads the commit SHA, tag, run URL, and
actor from the environment and records them on the version. Spacefast's version
history therefore shows which tag and which workflow run produced each deploy.

### Why GitHub Actions and not Spacefast's GitHub connection

Spacefast can connect to a GitHub repository directly (`sf git connect`), but
that connection deploys on **branch** pushes: every push to the production
branch goes live, and every other branch becomes a preview. It has no tag
trigger. Publishing from Actions on `push: tags` is the documented
[Publish from CI](https://spacefast.com/docs/ci) lane, and it gives us
release-only deploys.

The `curious-wind` space does have this repository connected (production branch
`main`), but with **Auto production** and **Auto previews** both turned off, so
pushes deploy nothing. Keep them off, or branch pushes would deploy alongside
tags. Check with:

```bash
sf git ls --space curious-wind
```

### SPA fallback

Routing is client-side (`react-router`), so a hard refresh on `/about` must
serve `index.html` and not a 404. `--spa true` turns on Spacefast's
single-page-app fallback. It's passed explicitly in both the workflow and the
`deploy` script.

## Configuration

| Where | Name | Value |
| --- | --- | --- |
| GitHub → Settings → Secrets and variables → Actions → **Secrets** | `SPACEFAST_TOKEN` | A Spacefast API key (`sfa_…`) with the `ci_deploy` preset |
| `.github/workflows/release.yml` | `--space curious-wind` | The target space, hard-coded in the publish step |

The space is written into the workflow rather than read from a variable because
a missing value doesn't fail: `sf publish` with no space creates a **new** space
named after the folder (`dist`). That happened on `v0.0.3`, when the value was
saved as a secret but read as a variable. If the space ever changes, edit the
workflow, the `deploy` script in `package.json`, and these docs.

Nothing Spacefast-specific is committed apart from the workflow. `.spacefast/`
(local CLI state) is gitignored.

### Package manager

The project uses pnpm, and the version is pinned in `package.json` →
`packageManager`. `pnpm/action-setup` reads that field, so CI and local use the
same pnpm. CI installs with `pnpm install --frozen-lockfile`, which fails if
`pnpm-lock.yaml` doesn't match `package.json`. That's intended: the build uses
exactly the versions that were committed. Only the `sf` CLI is installed with
npm (`npm i -g spacefast`), which installs a global tool and doesn't touch the
project's dependencies.

## One-time setup

All of this is **done** for `troychaplin.work`. It's recorded here so it can be
repeated or audited.

### 1. Install the CLI and log in

```bash
npm install -g spacefast
```

```bash
sf login
```

### 2. The space

The space already exists. Its title is **troychaplin.work**, its slug is
`curious-wind` (auto-generated, which is why it doesn't match the site name),
and its id is `spc_c2b3f863773a4f769aa9d418ee269055`. Check with
`sf spaces ls`. To create one from scratch instead:

```bash
pnpm build
```

```bash
sf publish ./dist --prebuilt --spa true --name "troychaplin.work" --access public
```

Spaces are private by default, and `--access public` makes this one public.
Use the slug from the receipt everywhere this doc says `curious-wind`, including
the workflow and the `deploy` script.

### 3. Create the CI API key

```bash
sf api-keys create --name "GitHub Actions publish" --preset ci_deploy
```

`ci_deploy` can publish versions and nothing else. It can't manage keys,
domains, members, or billing. The `sfa_…` secret prints **once**. Paste it
straight into the GitHub secret below and don't save it anywhere else.

### 4. Add the GitHub secret

In the repository, go to **Settings → Secrets and variables → Actions → Secrets**
→ New repository secret → `SPACEFAST_TOKEN` = the `sfa_…` key.

That's the only GitHub setting needed. The workflow reads `secrets.*` and
`vars.*` separately, so a value saved under the wrong tab arrives empty.

### 5. Connect the domain

`troychaplin.work` is attached to `curious-wind` and verified. A domain can
serve only one space: if `sf domains add` or `sf domains check` asks to **move**
the domain from its current space, it's already attached elsewhere. Run
`sf domains ls --space curious-wind` to confirm before you answer.

```bash
sf domains add troychaplin.work --space curious-wind --role primary
```

The command prints the DNS records to create at your DNS host: a `TXT`
verification record plus `A` and `AAAA` records, for both the apex and `www`.
Copy the exact values from the output.

- **Delete any existing `A`/`AAAA` records** for `troychaplin.work` and `www`
  first. A leftover record from a previous host blocks verification.
- Spacefast only uses `A`, `AAAA` and `TXT`. There is no CNAME/ALIAS option.

Spacefast checks DNS on its own every 30 seconds or so for the first ten
minutes. To check sooner:

```bash
sf domains check troychaplin.work --space curious-wind
```

Once the domain is `verified` and SSL is `active`, `troychaplin.work` becomes
the space's live URL. `www.troychaplin.work` redirects to it with a 308, and you
don't have to set that redirect up.

If something is stuck:

```bash
sf domains diagnostics troychaplin.work --space curious-wind
```

### 6. Ship the first release

Follow [releasing.md](releasing.md).

## Manual publish (escape hatch)

`pnpm run deploy` builds locally and publishes `dist/` to the same space from
your machine, using your `sf login` session. It bypasses tags and CI, so keep it
for emergencies. The normal path is a tag. Use `pnpm run deploy`, not
`pnpm deploy`, which is a built-in pnpm command.

Don't publish with a bare `sf publish ./dist` and no `--space`: that creates a
new space (see Configuration above).

## Setup history

Problems hit while wiring this up, and what fixed them:

| Tag | What went wrong | Fix |
| --- | --- | --- |
| `v0.0.1` | `npm ci` failed: `package-lock.json` was out of sync with `package.json`. The project had moved to pnpm, but the workflow still used npm and a stale npm lock file from the initial scaffold. | Switched the workflow and docs to pnpm, deleted `package-lock.json`, and pinned `packageManager`. |
| `v0.0.2` | Build failed: `Cannot find module '../lightningcss.linux-x64-gnu.node'`. The npm lock file regenerated on macOS only listed the macOS binary (a known npm bug with optional platform dependencies). | Fixed by the pnpm switch above. `pnpm-lock.yaml` records every platform. |
| `v0.0.3` | Published to a brand-new space called `dist` instead of `curious-wind`. `SPACEFAST_SPACE` was saved as a secret but read as a variable, so it arrived empty, and the CLI created a space. | Hard-coded `--space curious-wind` in the workflow and deleted the stray space. |
| `v0.0.4` | First successful release to `troychaplin.work`. | |

Earlier, before any tag, the production build also failed with lightningcss
`Invalid media query`, because the Sass breakpoints used `var()`. See the
Styling section of the README.

## Reference

- [Publish from CI](https://spacefast.com/docs/ci)
- [sf publish](https://spacefast.com/docs/cli/publish)
- [API keys and tokens](https://spacefast.com/docs/api-keys)
- [Domains](https://spacefast.com/docs/domains)
- [Git and GitHub connections](https://spacefast.com/docs/git)
