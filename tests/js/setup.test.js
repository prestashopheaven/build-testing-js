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

/* support/setup.js: after every test the page is fresh again (the tests run in order, the second checks the first). */

import {describe, expect, it} from 'vitest';
import {installJQuery, installPrestashop, setReadyState} from '../../support/shop.js';

// A plain counter, not vi.fn(): the config clears mocks after every test, which would hide a listener that stayed.
let count = 0;
const clicks = () => {
  count += 1;
};

describe('setup.js', () => {
  it('leaves a page with listeners, globals and content behind', () => {
    document.addEventListener('click', clicks);
    window.addEventListener('click', clicks);
    installPrestashop();
    installJQuery();
    window.Theme = {};
    setReadyState('loading');
    document.body.innerHTML = '<p>left over</p>';

    document.body.click();

    expect(count).toBe(2);
  });

  it('starts the next test as a fresh page', () => {
    document.body.click();

    expect(count).toBe(2);
    expect(window.prestashop).toBeUndefined();
    expect(window.jQuery).toBeUndefined();
    expect(window.Theme).toBeUndefined();
    expect(document.readyState).not.toBe('loading');
    expect(document.body.innerHTML).toBe('');
  });
});
