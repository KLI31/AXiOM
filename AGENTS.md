## Stack

- Astro 7 + React 19 (`@astrojs/react`) + Tailwind CSS v4, pnpm 11, Node >= 22.12.
- Tailwind v4 is CSS-first via `@tailwindcss/vite`: no `tailwind.config.*`, no `@astrojs/tailwind`. Theme/config lives in `src/styles/global.css` (`@import "tailwindcss"`).

## Package manager

Use **pnpm** (`pnpm install`, `pnpm add <pkg>`). `package-lock.json` is stale — never run npm.

`pnpm-workspace.yaml` sets `allowBuilds: esbuild: false`: dependency build scripts are blocked. If a new dependency needs a postinstall, approve it there.

## Development

Start the dev server in background mode (real Astro 7 feature):

```
pnpm dev --background
```

Manage it with `pnpm astro dev status`, `pnpm astro dev logs`, `pnpm astro dev stop`. Only one server can run at a time (lock file) — check `status` and `stop` an existing one before restarting.

## Verification

- `pnpm build` is the fastest sanity check.
- `pnpm lint` runs ESLint on `.js`, `.jsx`, `.ts`, `.tsx`, `.astro`, `.mjs`, `.cjs`.
- `pnpm lint:fix` runs ESLint with `--fix`.
- `pnpm format` formats source files with Prettier.
- `pnpm format:check` checks formatting without writing.
- The `opencode.json` formatter hook runs ESLint (`--fix`) and Prettier automatically on each file after it is written or edited by opencode.
- Typecheck is not wired: `astro check` requires adding `@astrojs/check` + `typescript` first.

## Conventions

- `@/*` imports map to `src/*`, defined in **both** `astro.config.mjs` (vite alias) and `tsconfig.json` (`paths`). Keep them in sync.
- `CLAUDE.md` is a symlink to this file — edit `AGENTS.md` only; never replace the symlink with a regular file.
- Pages use `src/layouts/Layout.astro` (loads DM Sans Variable font, global.css, Navbar). React components (`.tsx`) need a `client:*` directive to be interactive.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
