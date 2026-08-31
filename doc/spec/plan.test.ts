/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `plan.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the work plan specification requirements.

@created: 2026-08-30 20:18
@modified: 2026-08-31 11:20

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
      "nameWithOwner",
      "-q",
      ".nameWithOwner",
    );
    expect(repo.code, repo.stderr || repo.stdout).toBe(0);
    const [owner, name] = repo.stdout.trim().split("/");
    expect(owner?.length).toBeGreaterThan(0);
    expect(name?.length).toBeGreaterThan(0);

    const projects = await runGh(
      "api",
      "graphql",
      "-f",
      `query=query($owner:String!,$name:String!){repository(owner:$owner,name:$name){projectsV2(first:20){nodes{title url closed}}}}`,
      "-F",
      `owner=${owner}`,
      "-F",
      `name=${name}`,
      "--jq",
      ".data.repository.projectsV2.nodes",
    );
    expect(projects.code, projects.stderr || projects.stdout).toBe(0);

    const nodes = JSON.parse(projects.stdout) as {
      closed?: boolean;
      title?: string;
      url?: string;
    }[];
    expect(Array.isArray(nodes), projects.stdout).toBe(true);
    const open = nodes.filter((project) => !project.closed);
    expect(open.length).toBeGreaterThan(0);
  });

  test("REQ.NF.4d6a2 — PUEDE contener issues", async () => {
    const help = await runGh("project", "item-add", "--help");
    expect(help.code, help.stderr || help.stdout).toBe(0);
    expect(help.stdout + help.stderr).toMatch(/\bissue\b/i);
    expect(help.stdout + help.stderr).toMatch(/--url\b/);
  });
});
