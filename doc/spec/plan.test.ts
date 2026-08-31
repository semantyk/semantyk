/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `plan.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the work plan specification requirements.

@created: 2026-08-30 20:18
@modified: 2026-08-31 10:57

@since: 0.1.0-alpha.40
@version: 0.1.0-alpha.40

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, runGh } from "@semantyk/test";
import { describe, test } from "bun:test";

describe("EL PLAN DE TRABAJO", () => {
  test("REQ.NF.c1d92 — DEBE ubicarse en un proyecto de GitHub", async () => {
    const repo = await runGh(
      "repo",
      "view",
      "--json",
      "owner",
      "-q",
      ".owner.login",
    );
    expect(repo.code, repo.stderr || repo.stdout).toBe(0);
    const owner = repo.stdout.trim();
    expect(owner.length).toBeGreaterThan(0);

    const projects = await runGh(
      "project",
      "list",
      "--owner",
      owner,
      "--format",
      "json",
      "--limit",
      "100",
    );
    expect(projects.code, projects.stderr || projects.stdout).toBe(0);

    const parsed = JSON.parse(projects.stdout) as {
      projects?: { closed?: boolean; title?: string; url?: string }[];
    };
    const open = (parsed.projects ?? []).filter((project) => !project.closed);
    expect(open.length).toBeGreaterThan(0);
  });

  test("REQ.NF.4d6a2 — PUEDE contener issues", async () => {
    const help = await runGh("project", "item-add", "--help");
    expect(help.code, help.stderr || help.stdout).toBe(0);
    expect(help.stdout + help.stderr).toMatch(/\bissue\b/i);
    expect(help.stdout + help.stderr).toMatch(/--url\b/);
  });
});
