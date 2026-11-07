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
 * Types of shop.js for TypeScript tests (recipe typescript). "vitest" resolves from the module only with the paths
 * entry of the tests tsconfig.json (README of prestashopheaven/build-testing-js); without it Mock is not checked.
 */

import type {Mock} from 'vitest';

export interface PrestashopDouble {
  handlers: Record<string, Array<(payload?: unknown) => void>>;
  on(event: string, handler: (payload?: unknown) => void): void;
  emit(event: string, payload?: unknown): void;
  [key: string]: unknown;
}

export interface JQueryDouble {
  jQuery: (target: unknown) => unknown;
  handlers: Record<string, Array<() => void>>;
  ready(): void;
  trigger(event: string): void;
}

export interface AdminComponentsDouble {
  component: {initComponents: Mock<(names: string[]) => void>; [name: string]: unknown};
  instance: Record<string, unknown>;
}

export function installPrestashop(extra?: Record<string, unknown>): PrestashopDouble;
export function installJQuery(): JQueryDouble;
export function installAdminComponents(names?: string[]): AdminComponentsDouble;
export function runScript(load: () => Promise<unknown>): Promise<void>;
export function flushPromises(): Promise<void>;
export function setReadyState(state: DocumentReadyState): void;
export function resetReadyState(): void;
