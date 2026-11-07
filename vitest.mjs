/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the MIT License
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/MIT
 *
 * @author    prestahaven.com
 * @copyright Since 2026 George van Engers
 * @license   https://opensource.org/licenses/MIT MIT License
 */

/*
 * Points a module's Vitest config at the test support of this package (prestashopheaven/build-testing-js) instead of
 * the copy in _dev/tests/support/. The module's _dev/vitest.config.mjs:
 *
 *   import {vitestConfig} from '../vendor/prestashopheaven/build-typescript/vitest.config.mjs';
 *   import {withTestingSupport} from '../vendor/prestashopheaven/build-testing-js/vitest.mjs';
 *
 *   export default withTestingSupport(vitestConfig(import.meta.url));
 *
 * Only Node built-ins here (none at all): Vite bundles the config file together with this one.
 */

/** The setup file of this package, relative to the module folder (the root of the Vitest config). */
export const SETUP_FILE = 'vendor/prestashopheaven/build-testing-js/support/setup.js';

/** The setup file a module had before this package (replaced). */
export const MODULE_SETUP_FILE = '_dev/tests/support/setup.js';

/**
 * The config with the setup file of this package (first, in place of the module's own copy; other setup files stay),
 * and resolve.preserveSymlinks, so the support files also load when the package is linked (ps-module link: a symlink
 * or junction to libraries/mono-build-testing, outside the module, which Vite would otherwise not serve).
 *
 * @param {object} config the Vitest config of the module (vitestConfig() of build-typescript, or its own)
 * @returns {object} a new config; the given one is not changed
 */
export function withTestingSupport(config) {
  const test = config.test ?? {};
  const others = (test.setupFiles ?? []).filter((file) => file !== MODULE_SETUP_FILE && file !== SETUP_FILE);

  return {
    ...config,
    resolve: {...(config.resolve ?? {}), preserveSymlinks: true},
    test: {...test, setupFiles: [SETUP_FILE, ...others]},
  };
}
