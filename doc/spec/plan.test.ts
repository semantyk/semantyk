/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `plan.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the work plan specification requirements.

@created: 2026-08-30 20:18
@modified: 2026-08-31 11:08

@since: 0.1.0-alpha.40
@version: 0.1.0-alpha.40

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, runGh } from "@semantyk/test";
import { describe, test } from "bun:test";

/** Org Projects V2 board linked to this repository (work plan). */
const WORK_PLAN_PROJECT_NUMBER = 3;

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

    const project = await runGh(
      "api",
      "graphql",
      "-f",
      "query=query($owner:String!,$number:Int!){organization(login:$owner){projectV2(number:$number){title url closed}}}",
      "-F",
      `owner=${owner}`,
      "-F",
      `number=${WORK_PLAN_PROJECT_NUMBER}`,
      "--jq",
      ".data.organization.projectV2",
    );

    // Prefer GraphQL when the token can read Projects V2.
    if (project.code === 0) {
      const parsed = JSON.parse(project.stdout) as {
        closed?: boolean;
        title?: string;
        url?: string;
      } | null;
      if (parsed?.url) {
        expect(parsed.closed).toBe(false);
        expect(parsed.url).toContain(`/orgs/${owner}/projects/${WORK_PLAN_PROJECT_NUMBER}`);
        return;
      }
    }

    // Actions' GITHUB_TOKEN often cannot read Projects V2; the public board still must exist.
    const page = await fetch(
      `https://github.com/orgs/${owner}/projects/${WORK_PLAN_PROJECT_NUMBER}`,
    );
    expect(page.status, await page.text().then((t) => t.slice(0, 200))).toBe(200);
  });

  test("REQ.NF.4d6a2 — PUEDE contener issues", async () => {
    const help = await runGh("project", "item-add", "--help");
    expect(help.code, help.stderr || help.stdout).toBe(0);
    expect(help.stdout + help.stderr).toMatch(/\bissue\b/i);
    expect(help.stdout + help.stderr).toMatch(/--url\b/);
  });
});
