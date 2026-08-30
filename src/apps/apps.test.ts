/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `apps.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the apps module specification requirements.

@created: 2026-08-29 23:47
@modified: 2026-08-30 13:38

@since: 0.1.0-alpha.25
@version: 0.1.0-alpha.37

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, expectModuleSpec } from "@semantyk/test";
import { describe, test } from "bun:test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;
const maturity = ["poc", "proto", "pilot", "mvp", "prod"] as const;

function expectOptionalMaturity(dir: string) {
  if (!existsSync(dir)) return;
  expect(statSync(dir).isDirectory()).toBe(true);
}

describe("PRODUCTOS", () => {
  test("REQ.F.36199 — DEBE contener módulos por madurez", () => {
    expect("doc/mcm/product").toExistInWorkspace();
  });

  test("REQ.F.e80d8 — DEBE contener el módulo `poc`", () => {
    const poc = resolve(here, "poc");
    expect(existsSync(poc)).toBe(true);
    expect(statSync(poc).isDirectory()).toBe(true);
  });

  test("REQ.F.b4da1 — PUEDE contener el módulo `proto`", () => {
    expectOptionalMaturity(resolve(here, "proto"));
  });

  test("REQ.F.34d01 — PUEDE contener el módulo `pilot`", () => {
    expectOptionalMaturity(resolve(here, "pilot"));
  });

  test("REQ.F.3807b — PUEDE contener el módulo `mvp`", () => {
    expectOptionalMaturity(resolve(here, "mvp"));
  });

  test("REQ.F.b4a66 — PUEDE contener el módulo `prod`", () => {
    expectOptionalMaturity(resolve(here, "prod"));
  });

  test("REQ.F.040ca — DEBE contener el módulo `sandbox`", () => {
    const sandbox = resolve(here, "sandbox");
    expect(existsSync(sandbox)).toBe(true);
    expect(statSync(sandbox).isDirectory()).toBe(true);
  });

  test("REQ.F.24c55 — PUEDE contener productos (aplicaciones, servicios, etc.) por módulo", () => {
    for (const name of maturity) {
      const dir = resolve(here, name);
      if (!existsSync(dir)) continue;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
        expectModuleSpec(resolve(dir, entry.name));
      }
    }
  });
});
