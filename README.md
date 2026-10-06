# troychaplin.work

Personal site. Vite + React + TypeScript, deployed as a static SPA to
[Spacefast](https://spacefast.com) at <https://troychaplin.work>.

## Setup

Requirements:

- **Node.js 22** (CI uses 22)
- **pnpm 12**: the exact version is pinned in `package.json` →
  `packageManager`, matching the `parlour-ui` component library. Running
  `corepack enable` once makes `pnpm` use it. pnpm settings live in
  `pnpm-workspace.yaml`.

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

### Analytics

Google Analytics 4 (`G-E0FCWJZTDM`) is added to `index.html` by a small plugin in
`vite.config.ts`, during `pnpm build` only. `pnpm dev` never loads it, so local
work doesn't show up in the stats. `pnpm preview` serves the production build,
so it does load it. To change or remove the tag, edit `GA_MEASUREMENT_ID` or the
`googleAnalytics()` plugin in `vite.config.ts`.

Route changes happen in the browser without a full page load. GA4 still counts
each one as a page view through the stream's **Enhanced measurement → Page
changes based on browser history events** setting, which is on. Turning it off
would mean only the first page of each visit is recorded.

## Styling

All styling comes from [Parlour](https://www.npmjs.com/package/@troychaplin/parlour-ui)
(`@troychaplin/parlour-ui`). The app has no global styles of its own: no tokens,
reset, fonts, or theme toggle.

`src/main.tsx` imports Parlour's full stylesheet once:

```tsx
import '@troychaplin/parlour-ui/styles.css'
```

That one file contains the design tokens (`--parlour--*`), base element styles,
layout classes, every component's CSS, and the `@font-face` rules. The font
files ship inside the package, and Vite bundles them from the stylesheet.

Parlour has no dark mode, so the site always renders in its light palette
whatever the OS setting.

### Prototyping components

New components can be prototyped here before they move into Parlour. Give each
one a folder with a `.scss` file next to it, imported for its side effect:

```tsx
// src/components/Testimonial/Testimonial.tsx
import './Testimonial.scss'

export function Testimonial() {
  return <figure className="parlour-testimonial">…</figure>
}
```

Every component `.scss` file automatically gets Parlour's Sass variables and
breakpoint mixins. `vite.config.ts` injects `@use 'parlour-variables' as *;`
from the installed package, so don't add that line yourself, or Sass reports a
namespace collision. What's in scope:

| Kind | Examples |
| --- | --- |
| Spacing | `$parlour-spacing-small`, `$parlour-spacing-x-large`, and the `$parlour-spacing` map |
| Radius | `$parlour-radius-md`, and the `$parlour-radius` map |
| Breakpoints | `$parlour-viewport-mobile` (600px), `$parlour-viewport-tablet` (768px) |
| Mixins | `below-mobile`, `above-mobile`, `below-tablet`, `above-tablet` |

Colours, font sizes and other tokens are CSS custom properties. Use them as
`var(--parlour--color-black)` and so on, since Parlour's stylesheet is loaded
globally.

```scss
.parlour-testimonial {
  padding: $parlour-spacing-medium;
  border-radius: $parlour-radius-md;
  background-color: var(--parlour--color-neutral-50);

  @include above-tablet {
    padding: $parlour-spacing-x-large;
  }
}
```

Name classes the way Parlour does (`parlour-<component>`, BEM modifiers) so a
finished prototype moves into Parlour unchanged. Check the name isn't already a
Parlour component first. Once it ships in a Parlour release, bump
`@troychaplin/parlour-ui`, switch the import to the package, and delete the
local copy. `@troychaplin/*` packages are exempt from pnpm's one-day minimum
release age (see `pnpm-workspace.yaml`), so a fresh release installs straight
away.

The variables file is read from the package by path
(`dist/styles/_parlour-variables.scss`), because Parlour's `exports` map doesn't
list it. If a Parlour release moves or renames it, the build fails on the
`@use`. Update the path in `vite.config.ts` to fix it.

## Routing

`react-router` v8, declarative (`BrowserRouter` / `Routes` / `Route`). Routes are
declared in `src/App.tsx`; pages live in `src/pages/`.

Because routing is client-side, the deploy must pass `--spa true` or a hard
refresh on `/about` will 404. It's already in the release workflow and the
`deploy` script — see [docs/deployment.md](docs/deployment.md).
