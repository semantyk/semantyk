/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `sandbox.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the sandbox apps module specification requirements.

@created: 2026-08-30 13:38
@modified: 2026-08-30 13:38

@since: 0.1.0-alpha.37
@version: 0.1.0-alpha.37

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expectModuleSpec } from "@semantyk/test";
import { describe, test } from "bun:test";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;

describe("SANDBOX", () => {
  test("REQ.F.7a2e1 — PUEDE contener módulos experimentales", () => {
    for (const entry of readdirSync(here, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      expectModuleSpec(resolve(here, entry.name));
    }
  });
});
