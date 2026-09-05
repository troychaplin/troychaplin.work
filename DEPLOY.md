# Deploying this app to Spacefast

This is a standard Vite + React + TypeScript app. `vite build` outputs a static
`dist/` folder with `index.html` at its root — exactly what Spacefast expects.

## Option 1 — hand it to your coding agent

Build first, then tell your agent:

```
Publish this space to Spacefast
```

It will publish `dist/`, and report back the live URL, the permanent version
URL, and (if you don't have a Spacefast account yet) a claim link.

## Option 2 — CLI yourself

Install the CLI once:

```bash
curl -fsSL https://spacefast.com/install.sh | bash
```

Then build and publish:

```bash
npm run build
sf publish ./dist --name spacefast-app
```

(`npm run publish` does both in one step — see package.json.)

This is a single-page app, so if Spacefast doesn't detect the SPA fallback
automatically, force it:

```bash
sf publish ./dist --name spacefast-app --spa true
```

## Claim your space

If you published without an account, the receipt includes a claim link.
Open it and sign in within 6 hours or the space expires. After claiming,
every future `sf publish` from this folder updates the same URL, and you get
full version history / rollback via `sf rollback`.

## Notes

- Nothing here needs Spacefast's Zero or Functions runtime — this is a plain
  static SPA. Add those later only if you need server-side logic.
- `.spacefast/state.json` is created next to this folder after your first
  publish so subsequent publishes know which space to update. Don't commit
  it if you plan to let teammates publish independently — see the CLI docs.
