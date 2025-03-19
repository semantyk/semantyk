/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `HTML.types.ts`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the types for the HTML component.
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
import { ReactNode } from 'react';
import type { HTMLAttributes } from 'react';

//* Main
type HTMLProps = HTMLAttributes<HTMLHtmlElement> & {
    children?: ReactNode;
};

//* Exports
export type { HTMLProps };
