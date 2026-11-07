# prestashopheaven/build-testing-js

JavaScript test doubles of the PrestaHaven modules for Vitest: `window.prestashop`, jQuery, the admin components,
`runScript` and the setup file that resets listeners and globals after every test, with TypeScript types. A build
package: `require-dev` only, never in a module zip (PKG-03).

JavaScript is delivered as files in this Composer package and imported by path (D16): there is no npm package. Vitest
and jsdom stay the module's own, in `_dev/node_modules`.

## Use when

A module has JavaScript or TypeScript tests in `_dev/tests` (Vitest + jsdom): import the PrestaShop test doubles and
use the shared setup file instead of copying `_dev/tests/support`.

## Install

```
composer require --dev prestashopheaven/build-testing-js:^1.0
```

`composer install` comes before `npm ci` / `npm run build`: the tests import from `../vendor/`. Then remove
`_dev/tests/support/` (`shop.js`, `setup.js`, `shop.d.ts`) from the module.

## Usage

### `_dev/vitest.config.mjs`

```js
import {vitestConfig} from '../vendor/prestashopheaven/build-typescript/vitest.config.mjs';
import {withTestingSupport} from '../vendor/prestashopheaven/build-testing-js/vitest.mjs';

export default withTestingSupport(vitestConfig(import.meta.url));
```

`withTestingSupport()` puts `vendor/prestashopheaven/build-testing-js/support/setup.js` in `setupFiles` in place of
`_dev/tests/support/setup.js` (other setup files stay) and sets `resolve.preserveSymlinks`, so the files also load when
the package is linked (`ps-module link`: a junction to `libraries/mono-build-testing`, outside the module; without it
Vite answers "Cannot find module /@fs/…").

### The tests

From `_dev/tests/back/` or `_dev/tests/front/`:

```ts
import {installAdminComponents, installJQuery, runScript} from '../../../vendor/prestashopheaven/build-testing-js/support/shop.js';
```

(`vitest` itself resolves from these files without anything else: Vitest serves its own module.)

### `_dev/tests/back/tsconfig.json` (and `tests/front`)

TypeScript finds `shop.d.ts` next to `shop.js`, but its `import type {Mock} from 'vitest'` has to resolve from the
module's `node_modules`, so the tests tsconfig maps `vitest` (without it `skipLibCheck` hides the error and `Mock`
becomes `any`). The `../support/*.d.ts` entry of `include` goes:

```json
{
  "extends": "../../../vendor/prestashopheaven/build-typescript/tsconfig.base.json",
  "compilerOptions": {"paths": {"vitest": ["../../node_modules/vitest"]}},
  "include": ["**/*.ts", "../../../vendor/prestashopheaven/build-typescript/types/prestashop-admin.d.ts", "../../types/module.d.ts"]
}
```

### What the doubles do

| Export | What |
|---|---|
| `installPrestashop(extra?)` | `window.prestashop` of the front office with `on()` / `emit()` like core.js |
| `installJQuery()` | `window.jQuery`: the ready queue (`ready()`) and delegated handlers (`trigger(event)`) |
| `installAdminComponents(names?)` | `window.prestashop.component` / `instance` of the admin theme, `initComponents` a spy |
| `runScript(load)` | Runs a script again as on a new page (`vi.resetModules()` + a fresh import) |
| `flushPromises()` | Lets pending promise chains settle |
| `setReadyState(state)` / `resetReadyState()` | Fakes `document.readyState` |

The setup file removes every listener added to `document` and `window` during a test, the globals above and the body
after each test.

### Paths for build-tools

`PrestaShopHeaven\Build\TestingJs\Paths`: `shop()`, `shopTypes()`, `setup()`, `vitest()`, `all()`, `root()`,
`importFromTests()` and `copiesIn($moduleDir)` (the old copies a module still has).

## Tests of this package

`Paths` with 100 % PHP coverage (`composer check`); the JavaScript in `tests/js` with Vitest at the monorepo root
(`npm ci && npm test`, CI job "node"). Verified on a throwaway copy of `heavenautoorderstatus`: its 9 test files
(62 tests) pass on these files with 100 % coverage, linked and copied, and the tests typecheck.

---

Read-only split of [`prestashopheaven/mono-build-testing`](https://github.com/prestashopheaven/mono-build-testing): changes,
issues and pull requests go there. MIT License.
