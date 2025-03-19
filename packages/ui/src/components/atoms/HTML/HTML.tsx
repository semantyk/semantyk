/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `HTML.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the HTML component.
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
import { HTMLProps } from './HTML.types';

//* Main
function HTML({ children, ...props }: HTMLProps) {
    // Return
    return (
        <html id='html' {...props}>
            {children}
        </html>
    );
}

//* Exports
export default HTML;
export { HTML };