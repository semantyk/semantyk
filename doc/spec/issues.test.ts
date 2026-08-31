/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `issues.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the GitHub issues specification requirements.

@created: 2026-08-30 20:22
@modified: 2026-08-31 10:57

@since: 0.1.0-alpha.40
@version: 0.1.0-alpha.40

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, runGh, workspace, workspaceRoot } from "@semantyk/test";
import { Glob } from "bun";
import { describe, test } from "bun:test";

/** p. ej. `feat/42-slug` */
export const FEAT_BRANCH_PATTERN = /^feat\/\d+-[a-z0-9-]+$/;

describe("LOS ISSUES", () => {
  test("REQ.NF.a3e71 — Cada feature DEBE nacer de un issue de GitHub", async () => {
    const issues = await runGh("issue", "list", "--limit", "1", "--json", "number");
    expect(issues.code, issues.stderr || issues.stdout).toBe(0);
    expect(JSON.parse(issues.stdout)).toBeArray();
  });

  test("REQ.NF.f2b84 — La rama DEBE usar el número de issue (p. ej. `feat/42-slug`)", () => {
    expect("feat/42-slug").toMatch(FEAT_BRANCH_PATTERN);
    expect("feat/1-a").toMatch(FEAT_BRANCH_PATTERN);
    expect("feature/42-slug").not.toMatch(FEAT_BRANCH_PATTERN);
    expect("feat/slug").not.toMatch(FEAT_BRANCH_PATTERN);
  });

  test("REQ.NF.8c19d — DEBE tener una plantilla de issue por tipo", async () => {
    const templates: string[] = [];
    for await (const path of new Glob(".github/ISSUE_TEMPLATE/*.yaml").scan({
      cwd: workspaceRoot,
    })) {
      templates.push(path.replaceAll("\\", "/"));
    }
    expect(templates.length).toBeGreaterThanOrEqual(8);

    for (const path of templates) {
      const text = await workspace.readText(path);
      expect(text).toMatch(/^type:\s/m);
    }
  });
});
