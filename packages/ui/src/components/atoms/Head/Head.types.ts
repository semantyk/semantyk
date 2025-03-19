/**
 * –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * # `Head.types.ts`
 * @organization: Semantyk
 * @project: UI
 *
 * @file: This file contains the types for the Head component.
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
type HeadProps = HTMLAttributes<HTMLHeadElement> & {
    children?: ReactNode | undefined;
};

//* Exports
export type { HeadProps };
