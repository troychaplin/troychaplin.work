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

## One-time setup

You only do this once, when setting the project up.

### 1. Install the CLI and log in

```bash
npm install -g spacefast
```

```bash
sf login
```

### 2. The space

The space already exists. Its title is **troychaplin.work**, its slug is
`curious-wind` (auto-generated), and its id is
`spc_c2b3f863773a4f769aa9d418ee269055`. To create one from scratch instead:

```bash
pnpm build
```

```bash
sf publish ./dist --prebuilt --spa true --name "troychaplin.work" --access public
```

Spaces are private by default, and `--access public` makes this one public.
Use the slug from the receipt everywhere this doc says `curious-wind`.

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

### 5. Connect the domain

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
for emergencies. The normal path is a tag.

## Reference

- [Publish from CI](https://spacefast.com/docs/ci)
- [sf publish](https://spacefast.com/docs/cli/publish)
- [API keys and tokens](https://spacefast.com/docs/api-keys)
- [Domains](https://spacefast.com/docs/domains)
- [Git and GitHub connections](https://spacefast.com/docs/git)
