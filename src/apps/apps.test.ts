/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `apps.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the apps module specification requirements.

@created: 2026-08-29 23:47
@modified: 2026-09-01 17:40

@since: 0.1.0-alpha.25
@version: 0.1.0-alpha.42

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect } from "@semantyk/test";
import { describe, test } from "bun:test";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;
const maturity = ["poc", "proto", "pilot", "mvp", "gap"] as const;
const promotion = ["dev", "staging", "main"] as const;

describe("PRODUCTOS", () => {
  test("REQ.F.36199 — DEBE contener módulos por madurez", () => {
    expect("doc/mcm/product").toExistInWorkspace();
  });

  test("REQ.F.040ca — DEBE contener el módulo `sandbox`", () => {
    const sandbox = resolve(here, "sandbox");
    expect(existsSync(sandbox)).toBe(true);
    expect(statSync(sandbox).isDirectory()).toBe(true);
  });

  test("REQ.F.8f2a1 — DEBE concentrar la madurez de productos dentro de `sandbox`", () => {
    for (const name of maturity) {
      expect(existsSync(resolve(here, name))).toBe(false);
      expect(existsSync(resolve(here, "sandbox", name))).toBe(true);
      expect(statSync(resolve(here, "sandbox", name)).isDirectory()).toBe(true);
    }
  });

  test("REQ.F.5d9e4 — DEBE contener los entornos `dev`, `staging` y `main` para promover productos", () => {
    for (const name of promotion) {
      const dir = resolve(here, name);
      expect(existsSync(dir)).toBe(true);
      expect(statSync(dir).isDirectory()).toBe(true);
    }
  });

  test("REQ.F.1a6f8 — DEBE iniciar cada producto en `sandbox` antes de promoverlo a `dev`, `staging` y `main`", () => {
    for (const name of maturity) {
      expect(existsSync(resolve(here, "sandbox", name))).toBe(true);
      expect(existsSync(resolve(here, name))).toBe(false);
    }
    for (const name of promotion) {
      expect(existsSync(resolve(here, name))).toBe(true);
      expect(existsSync(resolve(here, "sandbox", name))).toBe(false);
    }
  });
});
