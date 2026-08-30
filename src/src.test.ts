/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `src.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the source code module specification requirements.

@created: 2026-08-29 23:29
@modified: 2026-08-30 13:21

@since: 0.1.0-alpha.31
@version: 0.1.0-alpha.36

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, workspace } from "@semantyk/test";
import { describe, test } from "bun:test";

const pkg = await workspace.readJson<{
  version: string;
  packageManager?: string;
}>("package.json");
const compose = await workspace.readText("compose.yaml");

describe("EL CÓDIGO FUENTE", () => {
  test("REQ.NF.c80ae — DEBE usar versionamiento semántico", () => {
    expect(pkg.version).toBeSemVer();

    const composeVersion = compose.match(/@version:\s*(\S+)/)?.[1];
    expect(composeVersion).toBeDefined();
    expect(composeVersion!).toBeSemVer();

    const packageManager = String(pkg.packageManager ?? "");
    const packageManagerVersion = packageManager.includes("@")
      ? packageManager.split("@").pop()!
      : "";
    expect(packageManagerVersion.length).toBeGreaterThan(0);
    expect(packageManagerVersion).toBeSemVer();
  });
});
