/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `ux.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the global UX specification requirements.

@created: 2026-08-30 01:51
@modified: 2026-08-30 01:51

@since: 0.1.0-alpha.0
@version: 0.1.0-alpha.0

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { root } from "#test/helpers";
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, relative, resolve } from "node:path";

function listFiles(dir: string, found: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) listFiles(path, found);
    else found.push(path);
  }
  return found;
}

function listUxModules(dir = resolve(root, "src"), found: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    if (entry.name === "node_modules") continue;
    const path = resolve(dir, entry.name);
    if (entry.name === "ux") found.push(path);
    else listUxModules(path, found);
  }
  return found;
}

describe("UX", () => {
  describe("REQ.F.a7e2b — DEBE tener una arquitectura de componentes atómicos", () => {
    test("REQ.F.b8f3c — DEBE contener la carpeta `components`", () => {
      const modules = listUxModules();
      expect(modules.length).toBeGreaterThan(0);
      for (const ux of modules) {
        const components = resolve(ux, "components");
        expect(existsSync(components), relative(root, ux)).toBe(true);
        expect(statSync(components).isDirectory()).toBe(true);
      }
    });

    test("REQ.F.c9a4d — DEBE contener el módulo `atoms`", () => {
      for (const ux of listUxModules()) {
        const atoms = resolve(ux, "components/atoms");
        expect(existsSync(atoms), relative(root, ux)).toBe(true);
        expect(statSync(atoms).isDirectory()).toBe(true);
      }
    });

    test("REQ.F.d0b5e — DEBE contener el módulo `molecules`", () => {
      for (const ux of listUxModules()) {
        const molecules = resolve(ux, "components/molecules");
        expect(existsSync(molecules), relative(root, ux)).toBe(true);
        expect(statSync(molecules).isDirectory()).toBe(true);
      }
    });

    test("REQ.F.e1c6f — DEBE contener el módulo `organisms`", () => {
      for (const ux of listUxModules()) {
        const organisms = resolve(ux, "components/organisms");
        expect(existsSync(organisms), relative(root, ux)).toBe(true);
        expect(statSync(organisms).isDirectory()).toBe(true);
      }
    });

    test("REQ.F.f2d70 — DEBE contener el módulo `pages`", () => {
      for (const ux of listUxModules()) {
        const pages = resolve(ux, "components/pages");
        expect(existsSync(pages), relative(root, ux)).toBe(true);
        expect(statSync(pages).isDirectory()).toBe(true);
      }
    });

    test("REQ.F.03e81 — DEBE contener el módulo `templates`", () => {
      for (const ux of listUxModules()) {
        const templates = resolve(ux, "components/templates");
        expect(existsSync(templates), relative(root, ux)).toBe(true);
        expect(statSync(templates).isDirectory()).toBe(true);
      }
    });
  });

  test("REQ.F.9d41b — Cada componente DEBE tener un archivo `{nombre}.tsx`", () => {
    const component = /^[a-z0-9]+(-[a-z0-9]+)*\.tsx$/;
    const companion = /^[a-z0-9]+(-[a-z0-9]+)*\.(logic|hook)\.ts$/;

    for (const ux of listUxModules()) {
      const components = resolve(ux, "components");
      if (!existsSync(components)) continue;
      for (const path of listFiles(components)) {
        const name = basename(path);
        const id = relative(root, path);
        if (companion.test(name)) {
          expect(
            existsSync(path.replace(/\.(logic|hook)\.ts$/, ".tsx")),
            id,
          ).toBe(true);
          continue;
        }
        expect(component.test(name), id).toBe(true);
      }
    }
  });

  test("REQ.F.4e8a2 — Cada componente PUEDE tener un archivo `{nombre}.logic.ts`", () => {
    const logic = /^[a-z0-9]+(-[a-z0-9]+)*\.logic\.ts$/;

    for (const ux of listUxModules()) {
      const components = resolve(ux, "components");
      if (!existsSync(components)) continue;
      for (const path of listFiles(components)) {
        const name = basename(path);
        if (!name.endsWith(".logic.ts")) continue;
        expect(logic.test(name), relative(root, path)).toBe(true);
      }
    }
  });

  test("REQ.F.6b3c1 — Cada componente PUEDE tener un archivo `{nombre}.hook.ts`", () => {
    const hook = /^[a-z0-9]+(-[a-z0-9]+)*\.hook\.ts$/;

    for (const ux of listUxModules()) {
      const components = resolve(ux, "components");
      if (!existsSync(components)) continue;
      for (const path of listFiles(components)) {
        const name = basename(path);
        if (!name.endsWith(".hook.ts")) continue;
        expect(hook.test(name), relative(root, path)).toBe(true);
      }
    }
  });
});
