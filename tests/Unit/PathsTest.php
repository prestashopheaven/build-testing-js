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

namespace PrestaShopHeaven\Build\TestingJs\Tests\Unit;

use PHPUnit\Framework\TestCase;
use PrestaShopHeaven\Build\TestingJs\Paths;

/**
 * The paths of the JavaScript test support, their content where PHP can check it, and the copies a module still has.
 */
final class PathsTest extends TestCase
{
    /**
     * Every path is absolute, uses "/" and points to an existing file in the package folder.
     */
    public function testEveryPathExistsInThePackage(): void
    {
        $root = Paths::root();
        self::assertSame(str_replace('\\', '/', (string) realpath(__DIR__ . '/../..')), str_replace('\\', '/', (string) realpath($root)));
        self::assertStringNotContainsString('\\', $root);

        self::assertSame("$root/support/shop.js", Paths::shop());
        self::assertSame("$root/support/shop.d.ts", Paths::shopTypes());
        self::assertSame("$root/support/setup.js", Paths::setup());
        self::assertSame("$root/vitest.mjs", Paths::vitest());

        $all = Paths::all();
        self::assertSame(['shop', 'shop-types', 'setup', 'vitest'], array_keys($all));
        foreach ($all as $file) {
            self::assertFileExists($file);
        }
    }

    /**
     * The files carry the MIT license header and export what the modules' tests import.
     */
    public function testTheFilesHaveTheLicenseHeaderAndTheirExports(): void
    {
        foreach (Paths::all() as $file) {
            self::assertStringStartsWith("/**\n * NOTICE OF LICENSE\n", str_replace("\r\n", "\n", (string) file_get_contents($file)), $file);
        }
        $shop = (string) file_get_contents(Paths::shop());
        $types = (string) file_get_contents(Paths::shopTypes());
        foreach (['installPrestashop', 'installJQuery', 'installAdminComponents', 'runScript', 'flushPromises', 'setReadyState', 'resetReadyState'] as $name) {
            self::assertMatchesRegularExpression('/export (async )?function ' . $name . '\(/', $shop, $name);
            self::assertStringContainsString('export function ' . $name . '(', $types, $name);
        }
        self::assertStringContainsString("import {afterEach} from 'vitest';", (string) file_get_contents(Paths::setup()));
        self::assertStringContainsString('export function withTestingSupport(config)', (string) file_get_contents(Paths::vitest()));
        // The setup file vitest.mjs puts in the config is the one of this package, at its place in a module.
        self::assertStringContainsString("'" . Paths::MODULE_PATH . "/support/setup.js'", (string) file_get_contents(Paths::vitest()));
    }

    /**
     * A test in _dev/tests/<folder>/ reaches shop.js three folders up, in vendor/.
     */
    public function testTheImportPathFromATestFolder(): void
    {
        self::assertSame('../../../vendor/prestashopheaven/build-testing-js/support/shop.js', Paths::importFromTests());
    }

    /**
     * copiesIn() lists the support files a module still carries itself, and nothing for a module without them.
     */
    public function testCopiesInListsTheOldCopiesOfAModule(): void
    {
        $dir = str_replace('\\', '/', sys_get_temp_dir()) . '/testing-js-' . bin2hex(random_bytes(4));
        mkdir($dir . '/_dev/tests/support', 0777, true);
        try {
            self::assertSame([], Paths::copiesIn($dir));
            file_put_contents($dir . '/_dev/tests/support/shop.js', '');
            file_put_contents($dir . '/_dev/tests/support/shop.d.ts', '');

            self::assertSame(['_dev/tests/support/shop.js', '_dev/tests/support/shop.d.ts'], Paths::copiesIn($dir . '\\'));
        } finally {
            foreach (glob($dir . '/_dev/tests/support/*') ?: [] as $file) {
                unlink($file);
            }
            rmdir($dir . '/_dev/tests/support');
            rmdir($dir . '/_dev/tests');
            rmdir($dir . '/_dev');
            rmdir($dir);
        }
    }
}
