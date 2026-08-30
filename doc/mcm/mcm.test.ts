/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `mcm.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the MCM module specification requirements.

@created: 2026-08-30 13:45
@modified: 2026-08-30 13:45

@since: 0.1.0-alpha.38
@version: 0.1.0-alpha.38

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, workspace, workspaceRoot } from "@semantyk/test";
import { Glob } from "bun";
import { describe, test } from "bun:test";
import { resolve } from "node:path";

const PLANTUML_JAR =
  /^(\/opt\/homebrew|\/usr\/local)\/opt\/plantuml\/libexec\/plantuml\.jar$/;

describe("DIAGRAMAS", () => {
  test("REQ.NF.91769 — DEBE usar `plantuml` para diagramar", async () => {
    const pumls: string[] = [];
    for await (const path of new Glob("**/*.puml").scan({
      cwd: resolve(workspaceRoot, "doc/mcm"),
    })) {
      pumls.push(path);
    }
    expect(pumls.length).toBeGreaterThan(0);
  });

  test("REQ.NF.ee911 — DEBE configurar la extensión PlantUML para render local con `plantuml.jar` de Homebrew", async () => {
    expect(".vscode/settings.json").toExistInWorkspace();

    const settings = await workspace.readJson<{
      "plantuml.render"?: string;
      "plantuml.jar"?: string;
    }>(".vscode/settings.json");

    expect(settings["plantuml.render"]).toBe("Local");
    expect(settings["plantuml.jar"]).toMatch(PLANTUML_JAR);
  });
});
