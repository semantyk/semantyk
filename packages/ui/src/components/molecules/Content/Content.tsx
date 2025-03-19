/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Content.tsx`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Content component.
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
import { Footer, Header, Main } from '../../atoms';
import { ContentProps } from './Content.types';

//* Main
function Content({ children, ...props }: ContentProps) {
    // Return
    return (
        <div id='content' {...props}>
            <Header />
            <Main>
                {children}
            </Main>
            <Footer />
        </div>
    );
}

//* Exports
export default Content;
export { Content };
