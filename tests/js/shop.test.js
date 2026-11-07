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

/* The test doubles of support/shop.js behave like the PrestaShop globals the module scripts use. */

import {describe, expect, it, vi} from 'vitest';
import {
  flushPromises,
  installAdminComponents,
  installJQuery,
  installPrestashop,
  resetReadyState,
  runScript,
  setReadyState,
} from '../../support/shop.js';

describe('installPrestashop', () => {
  it('records handlers and emits like core.js', () => {
    const prestashop = installPrestashop({urls: {base_url: '/'}});
    const first = vi.fn();
    const second = vi.fn();
    prestashop.on('updateCart', first);
    prestashop.on('updateCart', second);

    prestashop.emit('updateCart', {reason: 'add'});
    prestashop.emit('nobodyListens');

    expect(window.prestashop).toBe(prestashop);
    expect(prestashop.urls).toEqual({base_url: '/'});
    expect(first).toHaveBeenCalledExactlyOnceWith({reason: 'add'});
    expect(second).toHaveBeenCalledOnce();
    expect(Object.keys(prestashop.handlers)).toEqual(['updateCart']);
  });

  it('works without extra properties', () => {
    expect(installPrestashop().handlers).toEqual({});
  });
});

describe('installJQuery', () => {
  it('queues ready handlers and runs them once, in order', () => {
    const jquery = installJQuery();
    const order = [];
    expect(window.jQuery(() => order.push(1))).toBeUndefined();
    window.jQuery(() => order.push(2));

    jquery.ready();
    jquery.ready();

    expect(window.jQuery).toBe(jquery.jQuery);
    expect(order).toEqual([1, 2]);
  });

  it('records delegated handlers per event and triggers them', () => {
    const jquery = installJQuery();
    const handler = vi.fn();

    const chain = window.jQuery(document).on('click  change', handler);
    expect(chain.on('submit', handler)).toBe(chain);
    jquery.trigger('change');
    jquery.trigger('submit');
    jquery.trigger('keyup');

    expect(handler).toHaveBeenCalledTimes(2);
    expect(Object.keys(jquery.handlers)).toEqual(['click', 'change', 'submit']);
  });
});

describe('installAdminComponents', () => {
  it('gives the admin components and starts them like the core does', () => {
    window.prestashop = {keep: true};
    const {component, instance} = installAdminComponents();

    component.initComponents(['MultistoreConfigField']);

    expect(window.prestashop.keep).toBe(true);
    expect(window.prestashop.component).toBe(component);
    expect(typeof component.MultistoreConfigField).toBe('function');
    expect(instance).toEqual({multistoreConfigField: {name: 'MultistoreConfigField'}});
    expect(component.initComponents).toHaveBeenCalledExactlyOnceWith(['MultistoreConfigField']);
  });

  it('takes other component names', () => {
    const {component} = installAdminComponents(['TranslatableInput', 'EmailInput']);

    expect(Object.keys(component).sort()).toEqual(['EmailInput', 'TranslatableInput', 'initComponents']);
  });
});

describe('runScript', () => {
  it('runs a script again as on a new page', async () => {
    await runScript(() => import('./fixtures/counter.js'));
    await runScript(() => import('./fixtures/counter.js'));

    expect(window.heavenCounterRuns).toBe(2);
  });
});

describe('flushPromises', () => {
  it('lets pending promise chains and timers of zero settle', async () => {
    const done = vi.fn();
    Promise.resolve().then(() => Promise.resolve()).then(done);
    const timer = vi.fn();
    setTimeout(timer, 0);

    await flushPromises();

    expect(done).toHaveBeenCalledOnce();
    expect(timer).toHaveBeenCalledOnce();
  });
});

describe('setReadyState', () => {
  it('fakes document.readyState until resetReadyState()', () => {
    const real = document.readyState;

    setReadyState('loading');
    expect(document.readyState).toBe('loading');

    resetReadyState();
    expect(document.readyState).toBe(real);
  });
});
