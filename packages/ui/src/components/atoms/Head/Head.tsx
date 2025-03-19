/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Head.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Head component.
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
import { HeadProps } from './Head.types';

//* Main
function Head({ children, ...props }: HeadProps) {
    // Return
    return (
        <head id='head' {...props}>
            {children}
        </head>
    );
}

//* Exports
export default Head;
export { Head };
