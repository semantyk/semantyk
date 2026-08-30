/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `header.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file parses Semantyk file-header metadata for specification tests.

@created: 2026-08-30 13:11
@modified: 2026-08-30 13:21

@since: 0.1.0-alpha.36
@version: 0.1.0-alpha.36

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import {
  FILE_FIELD_PATTERN,
  FILE_FIELD_PREFIX,
  HEADER_FIELD_NAMES,
  HEADER_WINDOW,
  type HeaderFieldName,
} from "./catalog.ts";

export function readHeaderWindow(source: string) {
  return source.slice(0, HEADER_WINDOW);
}

export function readHeaderField(source: string, fieldName: HeaderFieldName | string) {
  const name = fieldName.startsWith("@") ? fieldName.slice(1) : fieldName;
  return (
    readHeaderWindow(source).match(new RegExp(`@${name}:\\s*(.+)`))?.[1]?.trim() ?? ""
  );
}

export function hasCompleteHeader(source: string) {
  const window = readHeaderWindow(source);
  if (!HEADER_FIELD_NAMES.every((field) => window.includes(`@${field}`))) return false;
  const fileField = window.match(FILE_FIELD_PATTERN)?.[1]?.trim() ?? "";
  return fileField.startsWith(FILE_FIELD_PREFIX);
}

export function readCopyrightYear(source: string) {
  const copyright = readHeaderField(source, "copyright");
  return (
    copyright.match(/©\s*(\d{4})/)?.[1] ?? copyright.match(/\b(\d{4})\b/)?.[1] ?? ""
  );
}
