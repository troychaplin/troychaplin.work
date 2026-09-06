# troychaplin.work

Personal site. Vite + React + TypeScript, deployed as a static SPA to Spacefast.

```bash
npm run dev       # dev server
npm run build     # typecheck + production build
npm run preview   # serve the production build locally
npm run lint      # oxlint
npm run deploy    # build + publish to Spacefast
```

## Styling

SCSS, compiled by `sass-embedded`. Two layers:

**Global** — `src/styles/`, imported once from `src/main.tsx`:

| File | Purpose |
| --- | --- |
| `main.scss` | Entry. `@use`s the partials below, in cascade order. |
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

Breakpoint mixins and `$bp-*` variables are auto-injected into every component
stylesheet by `vite.config.ts`, so **don't** write `@use 'abstracts'` in one — a
second `as *` is a namespace collision. Partials reached via `@use` (such as
`_base.scss`) are the exception: the injection doesn't reach them, so they
import it explicitly.

Breakpoints are Sass variables rather than custom properties because custom
properties are not valid inside `@media` queries. Write mobile-first with `up()`:

```scss
.thing {
  padding: var(--space-4);

  @include up($bp-md) {
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
refresh on `/about` will 404. It's already in the `deploy` script — see
`DEPLOY.md`.
