/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `sandbox.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the sandbox apps module specification requirements.

@created: 2026-08-30 13:38
@modified: 2026-09-01 17:40

@since: 0.1.0-alpha.37
@version: 0.1.0-alpha.42

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, expectModuleSpec } from "@semantyk/test";
import { describe, test } from "bun:test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;
const maturity = ["poc", "proto", "pilot", "mvp", "gap"] as const;
const promotion = ["dev", "staging", "main"] as const;

describe("SANDBOX", () => {
  test("REQ.F.3c7b2 — DEBE contener los módulos de madurez `poc`, `proto`, `pilot`, `mvp` y `gap`", () => {
    for (const name of maturity) {
      const dir = resolve(here, name);
      expect(existsSync(dir)).toBe(true);
      expect(statSync(dir).isDirectory()).toBe(true);
    }
  });

  test("REQ.F.9b3c7 — DEBE contener el producto `www` en `poc`", () => {
    const www = resolve(here, "poc", "www");
    expect(existsSync(www)).toBe(true);
    expect(statSync(www).isDirectory()).toBe(true);
  });

  test("REQ.F.24c55 — PUEDE contener productos (aplicaciones, servicios, etc.) por módulo de madurez", () => {
    for (const name of maturity) {
      const dir = resolve(here, name);
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
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
