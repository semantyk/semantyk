/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Footer.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Footer component.
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
import { FooterProps } from './Footer.types';

//* Main
function Footer({ children, ...props }: FooterProps) {
    // Return
    return (
        <footer id='footer' {...props}>
            {children}
        </footer>
    );
}

//* Exports
export default Footer;
export { Footer };
