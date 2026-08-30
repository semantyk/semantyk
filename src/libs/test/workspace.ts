/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `workspace.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file is a Facade over monorepo paths and Bun file I/O for tests.

@created: 2026-08-30 13:11
@modified: 2026-08-30 13:21

@since: 0.1.0-alpha.36
@version: 0.1.0-alpha.36

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";

/** Absolute path to the monorepo root (`package.json`). */
export const workspaceRoot = resolve(import.meta.dir, "../../..");

/** Resolve a path from the monorepo root. */
export function resolveFromRoot(...parts: string[]) {
  return resolve(workspaceRoot, ...parts);
}

/** Spec filename for a module folder: `{folder}.test.ts`. */
export function moduleSpecFileName(folderName: string) {
  return `${folderName}.test.ts`;
}

/** Absolute path to a module's `{folder}.test.ts`. */
export function moduleSpecPath(moduleDir: string) {
  return resolve(moduleDir, moduleSpecFileName(basename(moduleDir)));
}

/**
 * Facade: locate and read authored files from the workspace root.
 *
 * @example
 * await workspace.readJson("package.json")
 * workspace.exists("doc/spec/TRIAGE.md")
 */
export const workspace = {
  root: workspaceRoot,
  resolve: resolveFromRoot,
  exists(relativePath: string) {
    return existsSync(resolveFromRoot(relativePath));
  },
  readText(relativePath: string) {
    return Bun.file(resolveFromRoot(relativePath)).text();
  },
  readJson<T = unknown>(relativePath: string) {
    return Bun.file(resolveFromRoot(relativePath)).json() as Promise<T>;
  },
  readYaml<T = unknown>(relativePath: string) {
    return Bun.file(resolveFromRoot(relativePath))
      .text()
      .then((text) => Bun.YAML.parse(text) as T);
  },
};
