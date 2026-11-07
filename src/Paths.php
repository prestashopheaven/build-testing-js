<?php
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

declare(strict_types=1);

namespace PrestaShopHeaven\Build\TestingJs;

/**
 * The absolute paths of the JavaScript test support of this package, so build-tools (the scaffold, ps-module assets,
 * a check that a module no longer carries its own copy) can find them wherever Composer installed the package, and
 * the paths a module's files use to reach them. Paths use "/" on every OS.
 */
final class Paths
{
    /** Where Composer puts this package in a module, relative to the module folder. */
    public const MODULE_PATH = 'vendor/prestashopheaven/build-testing-js';

    /** The files a module had in _dev/tests/support/ before this package (now here, in support/). */
    public const MODULE_COPIES = ['_dev/tests/support/shop.js', '_dev/tests/support/setup.js', '_dev/tests/support/shop.d.ts'];

    /**
     * The package folder.
     */
    public static function root(): string
    {
        return str_replace('\\', '/', dirname(__DIR__));
    }

    /**
     * support/shop.js: the test doubles (installPrestashop, installJQuery, installAdminComponents, runScript,
     * flushPromises, setReadyState, resetReadyState).
     */
    public static function shop(): string
    {
        return self::root() . '/support/shop.js';
    }

    /**
     * support/shop.d.ts: the TypeScript types of shop.js.
     */
    public static function shopTypes(): string
    {
        return self::root() . '/support/shop.d.ts';
    }

    /**
     * support/setup.js: the Vitest setup file that removes listeners and PrestaShop globals after every test.
     */
    public static function setup(): string
    {
        return self::root() . '/support/setup.js';
    }

    /**
     * vitest.mjs: exports withTestingSupport(config) for the module's _dev/vitest.config.mjs.
     */
    public static function vitest(): string
    {
        return self::root() . '/vitest.mjs';
    }

    /**
     * Every shared file of this package by name, for listings and checks.
     *
     * @return array<string, string>
     */
    public static function all(): array
    {
        return [
            'shop' => self::shop(),
            'shop-types' => self::shopTypes(),
            'setup' => self::setup(),
            'vitest' => self::vitest(),
        ];
    }

    /**
     * The import path of shop.js from a test file in the module's _dev/tests/<folder>/ (front, back).
     */
    public static function importFromTests(): string
    {
        return '../../../' . self::MODULE_PATH . '/support/shop.js';
    }

    /**
     * The copies of the support files a module still has (relative paths of MODULE_COPIES that exist in $moduleDir).
     *
     * @return list<string>
     */
    public static function copiesIn(string $moduleDir): array
    {
        $moduleDir = rtrim(str_replace('\\', '/', $moduleDir), '/');

        return array_values(array_filter(self::MODULE_COPIES, static fn (string $file): bool => is_file($moduleDir . '/' . $file)));
    }
}
