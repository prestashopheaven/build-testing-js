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
 * Runs before every test file (setupFiles of vitest.config.mjs, set by withTestingSupport() of
 * prestashopheaven/build-testing-js/vitest.mjs). jsdom keeps one document per test file, and a
 * script that runs again (runScript) would add its listeners again: this removes every listener added to
 * document and window during a test, and the globals of shop.js, so each test starts as a fresh page.
 */

import {afterEach} from 'vitest';

const added = [];
for (const target of [document, window]) {
  const original = target.addEventListener.bind(target);
  target.addEventListener = (type, listener, options) => {
    added.push([target, type, listener, options]);
    original(type, listener, options);
  };
}

afterEach(() => {
  added.splice(0).forEach(([target, type, listener, options]) => target.removeEventListener(type, listener, options));
  delete document.readyState;
  delete window.prestashop;
  delete window.jQuery;
  delete window.Theme;
  document.body.innerHTML = '';
});
