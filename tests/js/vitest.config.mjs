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
 * Vitest for the JavaScript of this package itself (npm test at the monorepo root, CI job "node"): the support files
 * with the same settings a module gets from build-typescript (jsdom, the setup file, clean mocks and globals).
 */

import path from 'node:path';
import {fileURLToPath} from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export default {
  root: packageDir,
  cacheDir: path.resolve(packageDir, '../../.cache/vite'),
  test: {
    environment: 'jsdom',
    include: ['tests/js/**/*.test.js'],
    setupFiles: ['support/setup.js'],
    restoreMocks: true,
    unstubGlobals: true,
    clearMocks: true,
    sequence: {shuffle: false},
  },
};
