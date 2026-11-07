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
 * Test doubles for the globals of PrestaShop and its themes, for the tests in _dev/tests/ (TST-22). Used by
 * plain-JS and TypeScript tests alike (types in shop.d.ts). Package prestashopheaven/build-testing-js: a test imports
 * it from ../../../vendor/prestashopheaven/build-testing-js/support/shop.js (from _dev/tests/<front|back>/).
 *
 *   const prestashop = installPrestashop();     window.prestashop with on()/emit() of core.js
 *   const jquery = installJQuery();             window.jQuery: ready queue + $(document).on()
 *   const admin = installAdminComponents();     window.prestashop.component / instance (admin theme)
 *   await runScript(() => import('../../views/js/front.js'));   runs a script again, as on a new page
 */

import {vi} from 'vitest';

/** window.prestashop of the front office: records handlers, emit() calls them like core.js does. */
export function installPrestashop(extra = {}) {
  const handlers = {};
  const prestashop = {
    ...extra,
    handlers,
    on(event, handler) {
      (handlers[event] = handlers[event] || []).push(handler);
    },
    emit(event, payload) {
      (handlers[event] || []).forEach((handler) => handler(payload));
    },
  };
  window.prestashop = prestashop;

  return prestashop;
}

/**
 * window.jQuery with the two forms the module code uses: jQuery(fn) queues a ready handler (run them with
 * ready(), in order, as jQuery 3 does after DOMContentLoaded), jQuery(document).on(events, fn) records
 * delegated handlers (fire them with trigger(event)).
 */
export function installJQuery() {
  const readyQueue = [];
  const handlers = {};
  const jQuery = (target) => {
    if (typeof target === 'function') {
      readyQueue.push(target);

      return undefined;
    }

    return {
      on(events, handler) {
        events.split(/\s+/).filter(Boolean).forEach((event) => (handlers[event] = handlers[event] || []).push(handler));

        return this;
      },
    };
  };
  window.jQuery = jQuery;

  return {
    jQuery,
    handlers,
    ready() {
      readyQueue.splice(0).forEach((handler) => handler());
    },
    trigger(event) {
      (handlers[event] || []).forEach((handler) => handler());
    },
  };
}

/**
 * window.prestashop.component and .instance of the admin theme (main.bundle.js), with the given component
 * names. initComponents() is a spy that starts each component like the core does.
 */
export function installAdminComponents(names = ['MultistoreConfigField']) {
  const instance = {};
  const component = {
    initComponents: vi.fn((list) => list.forEach((name) => {
      instance[name.charAt(0).toLowerCase() + name.slice(1)] = {name};
    })),
  };
  names.forEach((name) => {
    component[name] = function Component() {};
  });
  window.prestashop = {...(window.prestashop || {}), component, instance};

  return {component, instance};
}

/** Runs a script again (vi.resetModules + a fresh import), as if the page was loaded anew. */
export async function runScript(load) {
  vi.resetModules();
  await load();
}

/** Lets pending promises (fetch().then(...)) settle. */
export async function flushPromises() {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Sets document.readyState for a test ('loading' makes scripts wait for DOMContentLoaded). */
export function setReadyState(state) {
  Object.defineProperty(document, 'readyState', {configurable: true, get: () => state});
}

/** Undoes setReadyState(): document.readyState is jsdom's own again. */
export function resetReadyState() {
  delete document.readyState;
}
