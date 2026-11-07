# Changelog

The version is the one of the monorepo `mono-build-testing`.

## 1.0.0

First version: `_dev/tests/support/` of the 17 modules and `heavenupdater` (scan of 2026-11-07).

- `support/shop.js`, `support/setup.js`, `support/shop.d.ts`: identical in all 18 copies, moved as they are; only the
  header comments say where they live now (and that `shop.d.ts` needs the `vitest` paths entry of the tests tsconfig).
  No drift to merge.
- `vitest.mjs` (new): `withTestingSupport(config)` points a module's Vitest config at the setup file of this package and
  sets `resolve.preserveSymlinks` (needed for a linked package).
- `Paths` (new): the paths of these files for build-tools, and the old copies a module still has.
- JavaScript tests of the support files and `vitest.mjs` (`tests/js`, run at the monorepo root with `npm test`).
