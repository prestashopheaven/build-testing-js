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

/* withTestingSupport() of vitest.mjs: the module's Vitest config with the setup file of this package. */

import {describe, expect, it} from 'vitest';
import {MODULE_SETUP_FILE, SETUP_FILE, withTestingSupport} from '../../vitest.mjs';

describe('withTestingSupport', () => {
  it('replaces the module copy of the setup file and keeps everything else', () => {
    const config = {
      root: '/module',
      resolve: {alias: {x: '/y'}},
      test: {environment: 'jsdom', setupFiles: [MODULE_SETUP_FILE, '_dev/tests/own-setup.js'], coverage: {provider: 'istanbul'}},
    };

    const result = withTestingSupport(config);

    expect(result).toEqual({
      root: '/module',
      resolve: {alias: {x: '/y'}, preserveSymlinks: true},
      test: {environment: 'jsdom', setupFiles: [SETUP_FILE, '_dev/tests/own-setup.js'], coverage: {provider: 'istanbul'}},
    });
    expect(config.test.setupFiles).toEqual([MODULE_SETUP_FILE, '_dev/tests/own-setup.js']);
    expect(config.resolve).toEqual({alias: {x: '/y'}});
  });

  it('adds the setup file to a config without one, once', () => {
    const once = withTestingSupport({});

    expect(once).toEqual({resolve: {preserveSymlinks: true}, test: {setupFiles: [SETUP_FILE]}});
    expect(withTestingSupport(once).test.setupFiles).toEqual([SETUP_FILE]);
  });

  it('points at the package in vendor/ of the module', () => {
    expect(SETUP_FILE).toBe('vendor/prestashopheaven/build-testing-js/support/setup.js');
    expect(MODULE_SETUP_FILE).toBe('_dev/tests/support/setup.js');
  });
});
