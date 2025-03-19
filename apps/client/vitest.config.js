/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `vitest.config.js`
 * @organization: Semantyk
 * @project: Client
 *
 * @file: This file contains the configuration for the Vitest test runner.
 *
 * @created: Mar 18, 2025
 * @modified: Mar 18, 2025
 *
 * @author: Semantyk Team
 * @maintainer: Daniel Bakas <https://id.danielbakas.com>
 *
 * @copyright: Semantyk © 2025. All rights reserved.
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 */

//* Imports
import { defineConfig } from 'vitest/config';

//* Main
const config = defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        passWithNoTests: true
    }
});

//* Exports
export default config;