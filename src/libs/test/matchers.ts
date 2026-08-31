/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `matchers.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file adapts domain checks to Bun `expect` via `expect.extend` (Adapter).

@created: 2026-08-30 13:11
@modified: 2026-08-31 11:51

@since: 0.1.0-alpha.36
@version: 0.1.0-alpha.41

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect } from "bun:test";
import { existsSync } from "node:fs";
import {
  FILE_FIELD_PREFIX,
  HEADER_DATETIME_PATTERN,
  MARKDOWN_DATETIME_BULLET,
  RFC2119_PATTERN,
  type HeaderFieldName,
} from "./catalog.ts";
import {
  hasCompleteHeader,
  readCopyrightYear,
  readHeaderField,
} from "./header.ts";
import { isRequirementId, isSemVer } from "./requirement.ts";
import { moduleSpecPath, resolveFromRoot } from "./workspace.ts";

expect.extend({
  toBeSemVer(received: unknown) {
    const pass = typeof received === "string" && isSemVer(received);
    return {
      pass,
      message: () =>
        `expected ${Bun.inspect(received)} ${pass ? "not " : ""}to be SemVer 2.0.0`,
    };
  },

  toBeRequirementId(received: unknown) {
    const pass = typeof received === "string" && isRequirementId(received);
    return {
      pass,
      message: () =>
        `expected ${Bun.inspect(received)} ${pass ? "not " : ""}to match REQ.F|NF.#####`,
    };
  },

  toContainRfc2119(received: unknown) {
    const pass = typeof received === "string" && RFC2119_PATTERN.test(received);
    return {
      pass,
      message: () =>
        `expected ${Bun.inspect(received)} ${pass ? "not " : ""}to contain RFC 2119 keyword`,
    };
  },

  toBeHeaderDatetime(received: unknown) {
    const pass =
      typeof received === "string" && HEADER_DATETIME_PATTERN.test(received);
    return {
      pass,
      message: () =>
        `expected ${Bun.inspect(received)} ${pass ? "not " : ""}to match YYYY-MM-DD HH:mm`,
    };
  },

  toHaveCompleteHeader(received: unknown) {
    const pass = typeof received === "string" && hasCompleteHeader(received);
    return {
      pass,
      message: () =>
        `expected text ${pass ? "not " : ""}to include a complete Semantyk file header`,
    };
  },

  toHaveHeaderField(received: unknown, fieldName: HeaderFieldName | string) {
    const value = typeof received === "string" ? readHeaderField(received, fieldName) : "";
    const pass = value.length > 0;
    return {
      pass,
      message: () =>
        `expected header ${pass ? "not " : ""}to declare @${fieldName}${pass ? "" : ` (got ${Bun.inspect(value)})`}`,
    };
  },

  toHaveHeaderDatetimeField(
    received: unknown,
    fieldName: "created" | "modified",
  ) {
    const value =
      typeof received === "string" ? readHeaderField(received, fieldName) : "";
    const pass = HEADER_DATETIME_PATTERN.test(value);
    return {
      pass,
      message: () =>
        `expected @${fieldName} ${pass ? "not " : ""}to be YYYY-MM-DD HH:mm (got ${Bun.inspect(value)})`,
    };
  },

  toHaveFileFieldPrefix(received: unknown, prefix = FILE_FIELD_PREFIX) {
    const value = typeof received === "string" ? readHeaderField(received, "file") : "";
    const pass = value.startsWith(prefix);
    return {
      pass,
      message: () =>
        `expected @file ${pass ? "not " : ""}to start with ${Bun.inspect(prefix)} (got ${Bun.inspect(value)})`,
    };
  },

  toHaveCurrentCopyrightYear(received: unknown) {
    const expectedYear = String(new Date().getFullYear());
    const foundYear = typeof received === "string" ? readCopyrightYear(received) : "";
    const pass = foundYear === expectedYear;
    return {
      pass,
      message: () =>
        `expected @copyright year ${pass ? "not " : ""}to be ${expectedYear} (got ${Bun.inspect(foundYear)})`,
    };
  },

  toExistInWorkspace(received: unknown) {
    const pass =
      typeof received === "string" && existsSync(resolveFromRoot(received));
    return {
      pass,
      message: () =>
        `expected ${Bun.inspect(received)} ${pass ? "not " : ""}to exist in the workspace`,
    };
  },

  toHaveModuleSpec(received: unknown) {
    if (typeof received !== "string" || !existsSync(received)) {
      return { pass: true, message: () => "optional module absent" };
    }
    const specPath = moduleSpecPath(received);
    const pass = existsSync(specPath);
    return {
      pass,
      message: () =>
        `expected module at ${received} ${pass ? "not " : ""}to include ${specPath}`,
    };
  },
});

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toBeSemVer(): T;
    toBeRequirementId(): T;
    toContainRfc2119(): T;
    toBeHeaderDatetime(): T;
    toHaveCompleteHeader(): T;
    toHaveHeaderField(fieldName: HeaderFieldName | string): T;
    toHaveHeaderDatetimeField(fieldName: "created" | "modified"): T;
    toHaveFileFieldPrefix(prefix?: string): T;
    toHaveCurrentCopyrightYear(): T;
    toExistInWorkspace(): T;
    toHaveModuleSpec(): T;
  }
}

/** Assert an optional module directory ships its `{folder}.test.ts`. */
export function expectModuleSpec(moduleDir: string) {
  expect(moduleDir).toHaveModuleSpec();
}

/** True when a markdown Created/Modified bullet uses the canonical datetime form. */
export function isMarkdownDatetimeBullet(line: string) {
  return MARKDOWN_DATETIME_BULLET.test(line.trim());
}
