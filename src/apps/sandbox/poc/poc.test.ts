/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `poc.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the poc maturity module specification requirements.

@created: 2026-09-02 11:22
@modified: 2026-09-02 11:22

@since: 0.1.0-alpha.42
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
const products = ["www", "knowledge"] as const;

describe("POC", () => {
  test("REQ.F.ba472 — DEBE contener el producto `www`", () => {
    const www = resolve(here, "www");
    expect(existsSync(www)).toBe(true);
    expect(statSync(www).isDirectory()).toBe(true);
  });

  test("REQ.F.ed777 — DEBE contener el producto `knowledge`", () => {
    const knowledge = resolve(here, "knowledge");
    expect(existsSync(knowledge)).toBe(true);
    expect(statSync(knowledge).isDirectory()).toBe(true);
  });

  test("REQ.F.0cad8 — PUEDE contener productos; cada uno DEBE tener su especificación", () => {
    for (const name of products) {
      expectModuleSpec(resolve(here, name));
    }
    for (const entry of readdirSync(here, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      expectModuleSpec(resolve(here, entry.name));
    }
  });
});
