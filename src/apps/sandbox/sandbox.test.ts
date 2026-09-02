/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `sandbox.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the sandbox apps module specification requirements.

@created: 2026-08-30 13:38
@modified: 2026-09-02 11:22

@since: 0.1.0-alpha.37
@version: 0.1.0-alpha.43

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, expectModuleSpec } from "@semantyk/test";
import { describe, test } from "bun:test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;
const productTypes = ["poc", "proto", "pilot", "mvp", "gap"] as const;
const promotion = ["dev", "staging", "main"] as const;

describe("SANDBOX", () => {
  test("REQ.F.3c7b2 — DEBE contener los tipos de producto `poc`, `proto`, `pilot`, `mvp` y `gap`", () => {
    for (const name of productTypes) {
      const dir = resolve(here, name);
      expect(existsSync(dir)).toBe(true);
      expect(statSync(dir).isDirectory()).toBe(true);
    }
  });

  test("REQ.F.24c55 — PUEDE contener productos por tipo; cada tipo con productos DEBE tener su especificación", () => {
    for (const name of productTypes) {
      const dir = resolve(here, name);
      const products = readdirSync(dir, { withFileTypes: true }).filter(
        (entry) => entry.isDirectory() && !entry.name.startsWith("."),
      );
      if (products.length === 0) continue;
      expectModuleSpec(dir);
      for (const entry of products) {
        expectModuleSpec(resolve(dir, entry.name));
      }
    }
  });

  test("REQ.F.7e2d5 — NO DEBE contener los entornos `dev`, `staging` ni `main`", () => {
    for (const name of promotion) {
      expect(existsSync(resolve(here, name))).toBe(false);
    }
  });
});
