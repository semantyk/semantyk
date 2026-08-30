/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `helpers.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file provides shared test helpers for the Semantyk monorepo.

@created: 2026-08-29 10:33
@modified: 2026-08-30 00:50

@since: 0.1.0-alpha.0
@version: 0.1.0-alpha.0

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { Glob } from "bun";
import { expect } from "bun:test";
import { existsSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

/** Monorepo root (directory that contains `package.json`). */
export const root = resolve(import.meta.dir, "..");

const REQ_ID = /REQ\.(?:F|NF)\.[0-9a-f]{5}/g;

/** SemVer 2.0.0 (core + pre-release + build). */
export const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/** RFC 2119 keywords used in Spanish requirements. */
export const RFC2119 = /\b(?:DEBE|DEBERÍA|PUEDE|NO)\b/;

/** Metadata fields required in every file header. */
export const HEADER_FIELDS = [
  "@organization",
  "@project",
  "@file",
  "@created",
  "@modified",
  "@since",
  "@version",
  "@author",
  "@maintainer",
  "@copyright",
] as const;

const HEADER_GLOBS = [
  "**/*.ts",
  "**/*.md",
  "**/*.yaml",
  "**/*.yml",
  "**/*.puml",
  "**/.gitignore",
  "**/.env*.example",
];

const FILE_ATTR = /@file:\s*(.+)/;

export function isSemVer(value: string) {
  return SEMVER.test(value.trim());
}

export function extractRequirementIds(text: string) {
  return [...new Set(text.match(REQ_ID) ?? [])];
}

/** Module test filename: `{folder}.test.ts`. */
export function testFileName(folder: string) {
  return `${folder}.test.ts`;
}

export function moduleTestPath(dir: string) {
  return resolve(dir, testFileName(basename(dir)));
}

/** If `dir` exists, it must be a module with `{folder}.test.ts`. */
export function expectOptionalModule(dir: string) {
  if (!existsSync(dir)) return;
  expect(existsSync(moduleTestPath(dir))).toBe(true);
}

export function hasFileHeader(text: string) {
  const head = text.slice(0, 1200);
  if (!HEADER_FIELDS.every((field) => head.includes(field))) return false;
  const fileAttr = head.match(FILE_ATTR)?.[1]?.trim() ?? "";
  return fileAttr.startsWith("This file");
}

/** Authored files that support comment headers (excludes JSON, locks, placeholders). */
export async function listHeaderFiles() {
  const paths = new Set<string>();
  for (const pattern of HEADER_GLOBS) {
    for await (const path of new Glob(pattern).scan({ cwd: root })) {
      const normalized = path.replaceAll("\\", "/");
      if (normalized.includes("node_modules/") || normalized.includes(".git/")) continue;
      if (normalized.includes(".nx/") || normalized.endsWith(".gitkeep")) continue;
      if (extname(normalized) === ".json") continue;
      paths.add(normalized);
    }
  }
  return [...paths].sort();
}

/** All `*.test.ts` files except helpers under `test/`. */
export async function listTestFiles() {
  const paths: string[] = [];
  for await (const path of new Glob("**/*.test.ts").scan({ cwd: root })) {
    const normalized = path.replaceAll("\\", "/");
    if (normalized.includes("node_modules/") || normalized.includes(".git/")) continue;
    if (normalized.startsWith("test/")) continue;
    paths.push(normalized);
  }
  return paths;
}

/** Module tests: `{name}/{name}.test.ts`. */
export async function listModuleTestFiles() {
  const paths: string[] = [];
  for (const normalized of await listTestFiles()) {
    const segments = normalized.split("/");
    const file = segments.at(-1)!;
    const folder = segments.at(-2)!;
    if (file !== testFileName(folder)) continue;
    paths.push(normalized);
  }
  return paths;
}
