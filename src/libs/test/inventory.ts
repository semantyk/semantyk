/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `inventory.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file inventories authored and spec files via Iterator + filter Strategy.

@created: 2026-08-30 13:11
@modified: 2026-08-30 13:21

@since: 0.1.0-alpha.36
@version: 0.1.0-alpha.36

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { Glob } from "bun";
import { extname } from "node:path";
import { AUTHORED_FILE_GLOBS } from "./catalog.ts";
import { moduleSpecFileName, workspace, workspaceRoot } from "./workspace.ts";

export type WorkspaceFile = { path: string; text: string };

/** Strategy: whether a relative path should be ignored while scanning. */
export type PathFilter = (relativePath: string) => boolean;

export const ignoreVcsAndCaches: PathFilter = (relativePath) =>
  relativePath.includes("node_modules/") ||
  relativePath.includes(".git/") ||
  relativePath.includes(".nx/") ||
  relativePath.endsWith(".gitkeep");

export const ignoreThisLib: PathFilter = (relativePath) =>
  relativePath.startsWith("src/libs/test/");

export const ignoreJson: PathFilter = (relativePath) =>
  extname(relativePath) === ".json";

function passes(relativePath: string, filters: PathFilter[]) {
  return filters.every((filter) => !filter(relativePath));
}

async function collectGlobs(globs: readonly string[], filters: PathFilter[]) {
  const paths = new Set<string>();
  for (const pattern of globs) {
    for await (const path of new Glob(pattern).scan({ cwd: workspaceRoot })) {
      const relativePath = path.replaceAll("\\", "/");
      if (!passes(relativePath, filters)) continue;
      paths.add(relativePath);
    }
  }
  return [...paths].sort();
}

/** Authored files that support Semantyk comment headers. */
export function listAuthoredFiles() {
  return collectGlobs(AUTHORED_FILE_GLOBS, [ignoreVcsAndCaches, ignoreJson]);
}

/** Spec files (`*.test.ts`), excluding this lib. */
export function listSpecFiles() {
  return collectGlobs(["**/*.test.ts"], [ignoreVcsAndCaches, ignoreThisLib]);
}

/** Module specs: `{name}/{name}.test.ts`. */
export async function listModuleSpecFiles() {
  const paths: string[] = [];
  for (const relativePath of await listSpecFiles()) {
    const segments = relativePath.split("/");
    const fileName = segments.at(-1)!;
    const folderName = segments.at(-2)!;
    if (fileName !== moduleSpecFileName(folderName)) continue;
    paths.push(relativePath);
  }
  return paths;
}

/** Iterator: yield `{ path, text }` for each relative path. */
export async function* iterateFiles(relativePaths: Iterable<string>) {
  for (const path of relativePaths) {
    yield { path, text: await workspace.readText(path) } satisfies WorkspaceFile;
  }
}

export async function mapFiles<T>(
  relativePaths: Iterable<string>,
  map: (file: WorkspaceFile) => T | Promise<T>,
) {
  const results: T[] = [];
  for await (const file of iterateFiles(relativePaths)) {
    results.push(await map(file));
  }
  return results;
}
