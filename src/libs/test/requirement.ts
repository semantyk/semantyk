/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `requirement.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file extracts and validates requirement identifiers in specs.

@created: 2026-08-30 13:21
@modified: 2026-08-30 13:21

@since: 0.1.0-alpha.36
@version: 0.1.0-alpha.36

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import {
  REQUIREMENT_ID,
  REQUIREMENT_ID_EXACT,
  SEMVER_PATTERN,
} from "./catalog.ts";

export function isSemVer(value: string) {
  return SEMVER_PATTERN.test(value.trim());
}

export function isRequirementId(value: string) {
  return REQUIREMENT_ID_EXACT.test(value);
}

export function listRequirementIds(source: string) {
  return [...new Set(source.match(REQUIREMENT_ID) ?? [])];
}

/** True when a requirement id is bound to a `test`/`describe` (literal or title factory). */
export function isRequirementRegistered(source: string, requirementId: string) {
  const escaped = requirementId.replaceAll(".", "\\.");
  if (new RegExp(`(?:test|describe)\\(\\s*["'\`].*${escaped}`).test(source)) {
    return true;
  }
  return (
    new RegExp(`\\bid:\\s*["'\`]${escaped}["'\`]`).test(source) &&
    /test\(\s*(?:title|`\$\{id\})/.test(source)
  );
}
