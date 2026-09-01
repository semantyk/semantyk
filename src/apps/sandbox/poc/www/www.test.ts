/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `www.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the www product specification requirements under poc.

@created: 2026-09-01 17:35
@modified: 2026-09-01 17:45

@since: 0.1.0-alpha.42
@version: 0.1.0-alpha.42

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, workspace } from "@semantyk/test";
import { describe, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;
const project = await workspace.readJson<{
  name?: string;
  targets?: Record<string, { command?: string }>;
}>("src/apps/sandbox/poc/www/project.json");

describe("WWW", () => {
  test("REQ.F.c4e8a — DEBE corresponder al sitio web en semantyk.com", () => {
    expect(import.meta.dirname).toMatch(/[/\\]www$/);
  });

  test("REQ.F.2d8f1 — DEBE declarar su proyecto nx en `project.json`", () => {
    expect(existsSync(resolve(here, "project.json"))).toBe(true);
    expect(project.name).toBe("@semantyk/www");
  });

  test("REQ.F.6a1c3 — DEBE declarar los targets `build`, `dev`, `start` y `test` en nx", () => {
    for (const target of ["build", "dev", "start", "test"] as const) {
      expect(project.targets?.[target]?.command).toBeDefined();
    }
    expect(project.targets?.build?.command).toMatch(/\bnext build\b/);
    expect(project.targets?.dev?.command).toMatch(/\bnext dev\b/);
    expect(project.targets?.start?.command).toMatch(/\bnext start\b/);
    expect(project.targets?.test?.command).toMatch(/\bbun test\b/);
  });
});
