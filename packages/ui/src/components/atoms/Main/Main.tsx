/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Main.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Main component.
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
import { MainProps } from './Main.types';

//* Main
function Main({ children, ...props }: MainProps) {
    // Return
    return (
        <main id='main' {...props}>
            {children}
        </main>
    );
}

//* Exports
export default Main;
export { Main };
