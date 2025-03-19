/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Header.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Header component.
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
import { HeaderProps } from './Header.types';

//* Main
function Header({ children, ...props }: HeaderProps) {
    // Return
    return (
        <header id='header' {...props}>
            {children}
        </header>
    );
}

//* Exports
export default Header;
export { Header };
