# design-sync notes for arf-frontend / @arf/ui

## Build ordering (important)

`packages/ui` has no stylesheet of its own -- design tokens (`--color-arf-blue`
etc.) and the Tailwind utility/component classes these components use
(`arf-card-light`, `arf-btn-primary`, `text-h3`, ...) live in the consuming
app's `app/globals.css`, compiled by Next/Tailwind at the **app** level, not
the package level.

`packages/ui/build.mjs` copies the largest `.css` chunk out of
`../../.next/static/chunks/` into `dist/styles.css` after the esbuild bundle
step. **This means `next build` must run at the repo root before
`packages/ui && yarn build`** -- if `.next/static/chunks` doesn't exist yet
or is stale, the copied stylesheet will be missing or out of date. The
converter's `buildCmd` (`yarn build`, recorded in config.json) does NOT
capture this prerequisite -- re-run `next build` at the repo root first on
every re-sync.

## Components synced

`CapabilityCard`, `TierBody`, `SandboxCard`, `ConsoleCard`, `SpecsCard` --
all of `@arf/ui`'s current exports. All five are Next.js-free by design
(the `renderLink` prop pattern keeps `next/link` usage in the consuming app,
not the library) per an explicit project rule: NavBar and ArchitecturePipeline
are NOT in this package and must not be migrated without a different
strategy, since they import `next/navigation`/`next/font`/`next/image`
directly, which this package's plain-esbuild build can't handle.

## Re-sync risks

- The copied `dist/styles.css` is a snapshot of the app's compiled CSS at
  build time, not a real "package stylesheet" -- if the app's Tailwind
  config, token values, or class names change, `packages/ui`'s previews go
  stale until the next `next build` + `yarn build` pair runs. There's no
  automated dependency between the two builds.
- next/font (Instrument Sans, Newsreader, JetBrains Mono) is self-hosted by
  Next at the app level; the copied CSS's `@font-face` rules point at
  hashed `/_next/static/media/*` paths that only resolve inside the actual
  deployed app. Font families will very likely need `cfg.extraFonts` or
  will show as unresolved in the design-sync previews -- check the
  `[FONT_MISSING]`/`[FONT_DANGLING]` validator output.
- `packages/ui/package.json` `"types": "./src/index.ts"` points at source,
  not a compiled `.d.ts` -- intentional (ts-morph reads TS source directly
  fine for prop extraction), but worth knowing if `.d.ts` extraction ever
  looks wrong.
