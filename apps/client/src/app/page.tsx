/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `page.tsx`
 *
 * @organization: Semantyk
 * @project: Client
 *
 * @file: This file contains the page for the client.
 *
 * @created: Mar 19, 2025
 * @modified: Mar 28, 2025
 *
 * @author: Semantyk Team
 * @maintainer: Daniel Bakas <https://id.danielbakas.com>
 *
 * @copyright: Semantyk © 2025. All rights reserved.
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 */

//*
import { Page, PageProps } from "@semantyk/ui";

//* Main
function RootPage(props: PageProps) {
    // Return
    return (
        <Page {...props} />
    );
}
//* Exports
export default RootPage;
