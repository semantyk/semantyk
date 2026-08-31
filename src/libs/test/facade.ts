/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `facade.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file is the public Facade for `@semantyk/test`.

@created: 2026-08-29 10:33
@modified: 2026-08-31 11:51

@since: 0.1.0-alpha.5
@version: 0.1.0-alpha.41

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import "./matchers.ts";

export { expect } from "bun:test";

export {
  AUTHORED_FILE_GLOBS,
  FILE_FIELD_PATTERN,
  FILE_FIELD_PREFIX,
  HEADER_FIELD_NAMES,
  HEADER_WINDOW,
  HEADER_DATETIME_PATTERN,
  MARKDOWN_DATETIME_BULLET,
  REQUIREMENT_ID,
  REQUIREMENT_ID_EXACT,
  REQUIREMENT_TITLE,
  RFC2119_PATTERN,
  SEMVER_PATTERN,
  type HeaderFieldName,
} from "./catalog.ts";

export {
  hasCompleteHeader,
  readCopyrightYear,
  readHeaderField,
  readHeaderWindow,
} from "./header.ts";

export {
  ignoreJson,
  ignoreThisLib,
  ignoreVcsAndCaches,
  iterateFiles,
  listAuthoredFiles,
  listModuleSpecFiles,
  listSpecFiles,
  mapFiles,
  type PathFilter,
  type WorkspaceFile,
} from "./inventory.ts";

export { expectModuleSpec, isMarkdownDatetimeBullet } from "./matchers.ts";

export {
  isRequirementId,
  isRequirementRegistered,
  isSemVer,
  listRequirementIds,
} from "./requirement.ts";

export { runGh, type GhResult } from "./gh.ts";

export {
  moduleSpecFileName,
  moduleSpecPath,
  resolveFromRoot,
  workspace,
  workspaceRoot,
} from "./workspace.ts";
