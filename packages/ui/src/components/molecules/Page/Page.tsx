/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Page.tsx`
 *
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the Page component.
 *
 * @created: Mar 20, 2025
 * @modified: Mar 20, 2025
 *
 * @author: Semantyk Team
 * @maintainer: Daniel Bakas <https://id.danielbakas.com>
 *
 * @copyright: Semantyk © 2025. All rights reserved.
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 */

//* Imports
import type { PageProps } from './Page.types';

//* Main
function Page(props: PageProps) {
    // Props
    const { children } = props;
    // Return
    return (
        <div id="page">
            {children}
        </div>
    );
}

//* Exports
export default Page;
export { Page };