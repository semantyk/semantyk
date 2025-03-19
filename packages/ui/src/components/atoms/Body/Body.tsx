/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Body.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Body component.
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
import { BodyProps } from './Body.types';

//* Main
function Body({ children, ...props }: BodyProps) {
    // Return
    return (
        <body id='body' {...props}>
            {children}
        </body>
    );
}

//* Exports
export default Body;
export { Body };