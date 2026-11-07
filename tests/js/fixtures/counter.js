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

/* A "page script" for shop.test.js: counts how often it ran and adds a listener, like a module script does. */

window.heavenCounterRuns = (window.heavenCounterRuns || 0) + 1;
document.addEventListener('click', () => {
  window.heavenCounterClicks = (window.heavenCounterClicks || 0) + 1;
});
