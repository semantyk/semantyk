/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `layout.tsx`
 * @organization: Semantyk
 * @project: Client
 *
 * @file: This file contains the layout for the client.
 *
 * @created: Mar 19, 2025
 * @modified: Mar 19, 2025
 *
 * @author: Semantyk Team
 * @maintainer: Daniel Bakas <https://id.danielbakas.com>
 *
 * @copyright: Semantyk © 2025. All rights reserved.
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 */

//* Imports
import { Body, HTML, HTMLProps } from '@semantyk/ui';

//* Main
function RootLayout({ children }: HTMLProps) {
    // Return
    return (
        <HTML>
            <Body>
                {children}
            </Body>
        </HTML>
    );
}

//* Exports
export default RootLayout;