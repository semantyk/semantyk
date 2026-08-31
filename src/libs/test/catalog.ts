/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `catalog.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file holds immutable specification patterns shared by tests (Flyweight).

@created: 2026-08-30 13:11
@modified: 2026-08-31 11:51

@since: 0.1.0-alpha.36
@version: 0.1.0-alpha.41

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

/** `REQ.F|NF.` + 5 hex digits. */
export const REQUIREMENT_ID = /REQ\.(?:F|NF)\.[0-9a-f]{5}/g;

/** Exact requirement id (no global flag). */
export const REQUIREMENT_ID_EXACT = /^REQ\.(F|NF)\.[0-9a-f]{5}$/;

/** SemVer 2.0.0 (core + pre-release + build). */
export const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/** Header `@created` / `@modified` timestamps: `YYYY-MM-DD HH:mm`. */
export const HEADER_DATETIME_PATTERN =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):[0-5]\d$/;

/** Markdown body Created/Modified bullets mirroring header datetimes. */
export const MARKDOWN_DATETIME_BULLET =
  /^\*\s+\*\*(Created|Modified):\*\*\s+\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):[0-5]\d$/;

/** RFC 2119 keywords used in Spanish requirements. */
export const RFC2119_PATTERN = /\b(?:DEBE|DEBERÍA|PUEDE|NO)\b/;

/** Captures `test`/`describe` titles that embed a requirement id. */
export const REQUIREMENT_TITLE =
  /(?:test|describe)\(\s*["'`]([^"'`]*REQ\.(?:F|NF)\.[0-9a-f]{5}[^"'`]*)["'`]/g;

/** `@file:` attribute line. */
export const FILE_FIELD_PATTERN = /@file:\s*(.+)/;

/** Required Semantyk header field names (without `@`). */
export const HEADER_FIELD_NAMES = [
  "organization",
  "project",
  "file",
  "created",
  "modified",
  "since",
  "version",
  "author",
  "maintainer",
  "copyright",
] as const;

export type HeaderFieldName = (typeof HEADER_FIELD_NAMES)[number];

/** Globs for authored files that carry comment headers. */
export const AUTHORED_FILE_GLOBS = [
  "**/*.ts",
  "**/*.md",
  "**/*.yaml",
  "**/*.yml",
  "**/*.puml",
  "**/.gitignore",
  "**/.env*.example",
] as const;

export const HEADER_WINDOW = 1200;
export const FILE_FIELD_PREFIX = "This file";
