/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `main.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the project-level specification requirements.

@created: 2026-08-29 23:28
@modified: 2026-08-29 23:53

@since: 0.1.0-alpha.0
@version: 0.1.0-alpha.0

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { listHeaderFiles, root } from "#test/helpers";
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

describe("EL PROYECTO", () => {
  test("REQ.NF.c5cc6 — DEBE tener un nombre", async () => {
    for (const path of await listHeaderFiles()) {
      const text = await Bun.file(resolve(root, path)).text();
      const name = text.slice(0, 1200).match(/@project:\s*(.+)/)?.[1]?.trim() ?? "";
      expect(name.length, path).toBeGreaterThan(0);
    }
  });

  test("REQ.NF.da742 — DEBE tener un MONOREPOSITORIO", () => {
    expect(existsSync(resolve(root, "doc/spec/repo.test.ts"))).toBe(true);
  });
});
