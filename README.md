# troychaplin.work

Personal site. Vite + React + TypeScript, deployed as a static SPA to
[Spacefast](https://spacefast.com) at <https://troychaplin.work>.

## Setup

Requirements:

- **Node.js 22** (CI uses 22)
- **pnpm 10**: the exact version is pinned in `package.json` →
  `packageManager`. Running `corepack enable` once makes `pnpm` use it.

```bash
git clone https://github.com/troychaplin/troychaplin.work.git
```

```bash
cd troychaplin.work && pnpm install
```

```bash
pnpm dev
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Type-check, then production build to `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | oxlint |
| `pnpm run deploy` | Manual build + publish to Spacefast (escape hatch, see below) |

This project uses **pnpm only**. Don't run `npm install`: it creates a
`package-lock.json` that drifts out of sync with `pnpm-lock.yaml`. When you
change dependencies, commit `package.json` and `pnpm-lock.yaml` together. CI
installs with `--frozen-lockfile` and fails if they disagree.

## Publishing

Pushes to `main` deploy nothing. Production only updates when a `v*` tag is
pushed. That triggers [the Release workflow](.github/workflows/release.yml),
which lints, builds, and publishes `dist/` to the Spacefast space
`curious-wind`, served at `troychaplin.work`.

To release, from an up-to-date `main` with a clean working tree:

```bash
pnpm version patch
```

```bash
git push --follow-tags
```

`pnpm version` bumps `package.json`, commits, and tags (for example `v0.0.5`).
Use `minor` or `major` in place of `patch` as needed. Then open **Actions →
Release** on GitHub: the run summary shows the live URL and the Spacefast
version, and a GitHub Release is created for the tag.

- Roll back: `sf rollback <version> --space curious-wind`
- Manual publish without CI: `pnpm run deploy` (needs `sf login`). Use
  `pnpm run deploy`, not `pnpm deploy`, because `deploy` is also a built-in pnpm
  command and the built-in wins.

More detail:

- [docs/deployment.md](docs/deployment.md): how the pipeline works, the one-time
  Spacefast/GitHub/DNS setup, and why it's built this way
- [docs/releasing.md](docs/releasing.md): releasing, rolling back, re-running,
  rotating the API key, and troubleshooting

## Styling

SCSS, compiled by `sass-embedded`. Two layers:

**Global** — `src/styles/`, imported once from `src/main.tsx`:

| File | Purpose |
| --- | --- |
| `main.scss` | Entry. `@use`s the partials below, in cascade order. |
| `_fonts.scss` | `@font-face` for the three self-hosted variable families. |
| `_tokens.scss` | All design tokens as custom properties on `:root`, plus the dark palette. |
| `_reset.scss` | Reset, including `prefers-reduced-motion`. |
| `_base.scss` | Bare element styles — headings, links, code, focus. |
| `_mixins.scss` | Breakpoint variables and mixins. |
| `_abstracts.scss` | Forwards `_mixins`. Emits no CSS. |

**Per component** — a plain `.scss` file beside the component, imported for its
side effect. Class names are global, so namespace them BEM-style:

```tsx
import './Header.scss'

<header className="header">
  <nav className="header__nav">
```

Breakpoint mixins and `$break-*` variables are auto-injected into every component
stylesheet by `vite.config.ts`, so **don't** write `@use 'abstracts'` in one — a
second `as *` is a namespace collision. Partials reached via `@use` (such as
`_base.scss`) are the exception: the injection doesn't reach them, so they
import it explicitly.

Breakpoints are Sass variables holding plain values (`768px`), not custom
properties, because `var()` isn't valid inside `@media` queries. Setting
`$break-md: var(--octave--layout-medium)` compiles in dev, but the production
build fails with lightningcss reporting `Invalid media query`. The values copy
the `--octave--layout-*` tokens in `_tokens.scss`, so keep the two in sync.
(`$break-xl` still points at a token that doesn't exist; give it a pixel value
before using it.)

Write mobile-first with `minBreakpoint()`, or `maxBreakpoint()` for the rare
below-a-breakpoint rule:

```scss
.thing {
  padding: var(--space-4);

  @include minBreakpoint($break-md) {
    padding: var(--space-6);
  }
}
```

### Tokens

Two tiers. **Primitives** (`--purple-500`, `--space-4`, `--text-xl`) are the same
in every theme. **Semantic** tokens (`--color-bg`, `--color-text`,
`--color-accent`, …) say what a value is *for*, and are the only ones that change
between light and dark. Components should use semantic tokens almost exclusively
and should not contain raw colour values.

### Type

Three self-hosted variable families, one file per style:
`--font-heading` is Inter Tight, `--font-body` is Source Serif 4, `--font-mono`
is JetBrains Mono. Each `@font-face` declares that family's real weight *range*
(`100 900`, `200 900` and `100 800` respectively — they differ, so don't
copy one onto another), which is what lets a single file cover every weight.
Italic faces are declared but fetched only when something renders italic.

## Theming

Three states — System, Light, Dark — driven by `data-theme` on `<html>` and
persisted to `localStorage`.

- **System** is the *absence* of the attribute, so the `prefers-color-scheme`
  media query in `_tokens.scss` handles it with no JavaScript involved. It
  tracks OS changes live, no reload and no `matchMedia` listener needed.
- **Light / Dark** set `data-theme`. The media query is guarded with
  `:root:not([data-theme='light'])` so a forced light theme wins over a dark OS.

`src/theme/` holds the context, provider, and `useTheme` hook, split across three
files so a single file never exports both a component and a non-component (the
`react/only-export-components` lint rule).

An inline script in `index.html` applies a stored override before first paint to
avoid a flash of the wrong theme. It must stay inline and non-`module`, since
module scripts are deferred.

## Routing

`react-router` v8, declarative (`BrowserRouter` / `Routes` / `Route`). Routes are
declared in `src/App.tsx`; pages live in `src/pages/`.

Because routing is client-side, the deploy must pass `--spa true` or a hard
refresh on `/about` will 404. It's already in the release workflow and the
`deploy` script — see [docs/deployment.md](docs/deployment.md).
