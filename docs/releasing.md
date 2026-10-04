# Releasing

A release is a `v*` git tag. Pushing one publishes the site to production. How
that works is covered in [deployment.md](deployment.md).

## Cut a release

From an up-to-date `main` with a clean working tree:

```bash
pnpm version patch
```

```bash
git push --follow-tags
```

`pnpm version` (pnpm hands this command to npm) bumps `version` in
`package.json`, commits the change, and creates the matching `v` tag (`v0.0.0` → `v0.0.1`). Use `minor`
or `major` in place of `patch` as needed. `--follow-tags` pushes the commit and
the tag together.

Tagging by hand works too:

```bash
git tag v1.4.0
```

```bash
git push origin v1.4.0
```

## Watch it

Open **Actions → Release** on GitHub. When the run finishes, its summary shows:

| Field | Meaning |
| --- | --- |
| Live | The site's live URL |
| Version | The Spacefast version label (`v12`, …), which counts separately from git tags |
| Immutable URL | A permanent URL that keeps serving exactly this build |
| Activation | Whether the version went live |

A GitHub Release with generated notes is created for the tag.

Run history from the CLI:

```bash
sf versions ls --space curious-wind
```

## Roll back

Each publish is an immutable version, so rolling back restores an earlier build
without rebuilding it.

```bash
sf versions ls --space curious-wind
```

```bash
sf rollback v11 --space curious-wind
```

The dashboard does the same thing from the space's version history.

A rollback changes what's live but leaves git alone. To make the next release
include the fix, revert the bad commit on `main` and tag a new version.

## Re-publish a tag

If a run failed for a transient reason, such as a rate limit or a network
error, either re-run the failed job from the Actions UI, or go to **Actions →
Release → Run workflow** and pick the tag from the branch/tag selector. The
workflow only publishes when it runs on a `v*` tag.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Job succeeds, but the summary or diagnostics mention `noop_publish` | The build is byte-identical to what's live, so no new version was created. This counts as success. |
| A new space (e.g. `dist`) appears instead of updating the site | The publish step lost its `--space curious-wind` flag. Restore it, then delete the stray space. |
| `401` / `unauthorized` | `SPACEFAST_TOKEN` is missing, revoked, or wrong. See *Rotate the API key* below. |
| `429` | Publish rate limit for the plan. Wait for the `Retry-After` period and re-run. |
| Deep link like `/about` returns 404 | The publish lost `--spa true`. Check the workflow step. |
| Domain not serving | `sf domains diagnostics troychaplin.work --space curious-wind`. Usually a leftover `A` record or DNS hasn't propagated. |

Failures from the CLI include a `code`, a `type` URL with recovery steps, and a
`requestId`. Quote the `requestId` when contacting Spacefast support.

## Rotate the API key

```bash
sf api-keys create --name "GitHub Actions publish" --preset ci_deploy
```

Paste the new `sfa_…` value into the `SPACEFAST_TOKEN` secret, then revoke the
old key:

```bash
sf api-keys ls
```

```bash
sf api-keys revoke <old-key-id>
```
