/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `src.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the source code module specification requirements.

@created: 2026-08-29 23:29
@modified: 2026-08-29 23:49

@since: 0.1.0-alpha.0
@version: 0.1.0-alpha.0

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { isSemVer, root } from "#test/helpers";
import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";

const pkg = await Bun.file(resolve(root, "package.json")).json();
const compose = await Bun.file(resolve(root, "compose.yaml")).text();

describe("EL CÓDIGO FUENTE", () => {
  test("REQ.NF.c80ae — DEBE usar versionamiento semántico", () => {
    expect(isSemVer(pkg.version)).toBe(true);

    const composeVersion = compose.match(/@version:\s*(\S+)/)?.[1];
    expect(composeVersion).toBeDefined();
    expect(isSemVer(composeVersion!)).toBe(true);

    const pm = String(pkg.packageManager ?? "");
    const pmVersion = pm.includes("@") ? pm.split("@").pop()! : "";
    expect(pmVersion.length).toBeGreaterThan(0);
    expect(isSemVer(pmVersion)).toBe(true);
  });
});
