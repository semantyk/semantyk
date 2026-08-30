/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `spec.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the global specification requirements for Semantyk.

@created: 2026-08-29 21:13
@modified: 2026-08-30 03:52

@since: 0.1.0-alpha.6
@version: 0.1.0-alpha.6

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import {
  RFC2119,
  extractRequirementIds,
  hasFileHeader,
  listHeaderFiles,
  listTestFiles,
  moduleTestPath,
  root,
} from "#test/helpers";
import { Glob } from "bun";
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const here = import.meta.dir;
const helpers = await Bun.file(resolve(root, "test/helpers.ts")).text();

describe("LA ESPECIFICACIÓN", () => {
  test("REQ.NF.a3f73 — DEBE tener un ID con estructura REQ.F|NF.#####", async () => {
    const ids = new Set<string>();
    for (const path of await listTestFiles()) {
      const text = await Bun.file(resolve(root, path)).text();
      for (const id of extractRequirementIds(text)) ids.add(id);
    }
    for (const id of ids) {
      expect(id).toMatch(/^REQ\.(F|NF)\.[0-9a-f]{5}$/);
    }
  });

  test("REQ.NF.1d4c7 — DEBE cumplir con RFC 2119 (DEBE, DEBERÍA, PUEDE, NO)", async () => {
    const reqTest =
      /test\(\s*["'`]([^"'`]*REQ\.(?:F|NF)\.[0-9a-f]{5}[^"'`]*)["'`]/g;

    for (const path of await listTestFiles()) {
      const text = await Bun.file(resolve(root, path)).text();
      for (const match of text.matchAll(reqTest)) {
        expect(match[1]).toMatch(RFC2119);
      }
    }
  });

  test("REQ.NF.08c47 — DEBE contener un triaje global", () => {
    expect(existsSync(resolve(here, "TRIAGE.md"))).toBe(true);
  });

  test("REQ.NF.14504 — PUEDE contener un triaje por módulo", async () => {
    for await (const path of new Glob("**/TRIAGE.md").scan({ cwd: root })) {
      const normalized = path.replaceAll("\\", "/");
      if (normalized === "doc/spec/TRIAGE.md") continue;
      if (normalized.includes("node_modules/") || normalized.includes(".git/")) continue;
      const dir = dirname(resolve(root, normalized));
      expect(existsSync(moduleTestPath(dir))).toBe(true);
    }
  });

  test("REQ.NF.fe953 — PUEDE contener un `NOTES.md` por módulo", async () => {
    for await (const path of new Glob("**/NOTES.md").scan({ cwd: root })) {
      const normalized = path.replaceAll("\\", "/");
      if (normalized === "doc/spec/NOTES.md") continue;
      if (normalized.includes("node_modules/") || normalized.includes(".git/")) continue;
      const dir = dirname(resolve(root, normalized));
      expect(existsSync(moduleTestPath(dir))).toBe(true);
    }
  });

  test("REQ.NF.b763a — DEBE contener requerimientos por especificación", async () => {
    let total = 0;
    for (const path of await listTestFiles()) {
      const text = await Bun.file(resolve(root, path)).text();
      total += extractRequirementIds(text).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  describe("ENCABEZADO", () => {
    function headerAttr(text: string, name: string) {
      return (
        text.slice(0, 1200).match(new RegExp(`@${name}:\\s*(.+)`))?.[1]?.trim() ??
        ""
      );
    }

    test("REQ.NF.a4a26 — DEBE tener un encabezado en cada archivo", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(hasFileHeader(text)).toBe(true);
      }
    });

    test("REQ.NF.0390b — DEBE tener el atributo `@organization`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "organization").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.715de — DEBE tener el atributo `@project`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "project").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.55a42 — DEBE tener el atributo `@file`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "file").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.26d18 — DEBE comenzar el atributo `@file` con \"This file\"", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "file").startsWith("This file"), path).toBe(true);
      }
    });

    test("REQ.NF.e9e52 — DEBE tener el atributo `@created`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "created").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.9afbc — DEBE tener el atributo `@modified`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "modified").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.dabc0 — DEBE tener el atributo `@since`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "since").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.292db — DEBE tener el atributo `@version`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "version").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.22ecc — DEBE tener el atributo `@author`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "author").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.3dcc0 — DEBE tener el atributo `@maintainer`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "maintainer").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.9b14b — DEBE tener el atributo `@copyright`", async () => {
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        expect(headerAttr(text, "copyright").length, path).toBeGreaterThan(0);
      }
    });

    test("REQ.NF.5995e — DEBE usar el año presente en el atributo `@copyright`", async () => {
      const year = String(new Date().getFullYear());
      for (const path of await listHeaderFiles()) {
        const text = await Bun.file(resolve(root, path)).text();
        const copyright = headerAttr(text, "copyright");
        const match = copyright.match(/©\s*(\d{4})/) ?? copyright.match(/\b(\d{4})\b/);
        expect(match?.[1], path).toBe(year);
      }
    });
  });

  test("REQ.NF.3c8e1 — DEBE compartir helpers de prueba desde test/", () => {
    expect(existsSync(resolve(root, "test/helpers.ts"))).toBe(true);
    expect(helpers).toContain("export const root");
    expect(helpers).toContain("export function extractRequirementIds");
  });

  test("REQ.NF.00f3c — DEBE validar cada requerimiento mediante archivos `*.test.ts`", async () => {
    expect((await listTestFiles()).length).toBeGreaterThan(0);
  });

  test("REQ.NF.64b7c — DEBE identificar cada requerimiento con su ID en la prueba", async () => {
    for (const path of await listTestFiles()) {
      const text = await Bun.file(resolve(root, path)).text();
      for (const id of extractRequirementIds(text)) {
        expect(text).toMatch(
          new RegExp(`(?:test|describe)\\(\\s*["'\`].*${id.replaceAll(".", "\\.")}`),
        );
      }
    }
  });
});
