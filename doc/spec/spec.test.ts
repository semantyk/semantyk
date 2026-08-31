/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `spec.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the global specification requirements for Semantyk.

@created: 2026-08-29 21:13
@modified: 2026-08-30 20:22

@since: 0.1.0-alpha.6
@version: 0.1.0-alpha.36

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import {
  REQUIREMENT_TITLE,
  expect,
  isRequirementRegistered,
  iterateFiles,
  listAuthoredFiles,
  listRequirementIds,
  listSpecFiles,
  workspace,
  workspaceRoot,
  type HeaderFieldName,
} from "@semantyk/test";
import { Glob } from "bun";
import { describe, test } from "bun:test";
import { dirname, resolve } from "node:path";

const HEADER_ATTR_REQUIREMENTS = [
  { id: "REQ.NF.0390b", field: "organization" as HeaderFieldName },
  { id: "REQ.NF.715de", field: "project" as HeaderFieldName },
  { id: "REQ.NF.55a42", field: "file" as HeaderFieldName },
  { id: "REQ.NF.e9e52", field: "created" as HeaderFieldName },
  { id: "REQ.NF.9afbc", field: "modified" as HeaderFieldName },
  { id: "REQ.NF.dabc0", field: "since" as HeaderFieldName },
  { id: "REQ.NF.292db", field: "version" as HeaderFieldName },
  { id: "REQ.NF.22ecc", field: "author" as HeaderFieldName },
  { id: "REQ.NF.3dcc0", field: "maintainer" as HeaderFieldName },
  { id: "REQ.NF.9b14b", field: "copyright" as HeaderFieldName },
] as const;

describe("LA ESPECIFICACIÓN", () => {
  test("REQ.NF.a3f73 — DEBE tener un ID con estructura REQ.F|NF.#####", async () => {
    const requirementIds = new Set<string>();
    for await (const { text } of iterateFiles(await listSpecFiles())) {
      for (const id of listRequirementIds(text)) requirementIds.add(id);
    }
    expect(requirementIds.size).toBeGreaterThan(0);
    for (const id of requirementIds) expect(id).toBeRequirementId();
  });

  test("REQ.NF.1d4c7 — DEBE cumplir con RFC 2119 (DEBE, DEBERÍA, PUEDE, NO)", async () => {
    for await (const { text } of iterateFiles(await listSpecFiles())) {
      for (const match of text.matchAll(REQUIREMENT_TITLE)) {
        expect(match[1]).toContainRfc2119();
      }
    }
  });

  test("REQ.NF.14504 — PUEDE contener un triaje por módulo", async () => {
    for await (const path of new Glob("**/TRIAGE.md").scan({ cwd: workspaceRoot })) {
      const relativePath = path.replaceAll("\\", "/");
      if (relativePath.includes("node_modules/") || relativePath.includes(".git/")) continue;
      expect(dirname(resolve(workspaceRoot, relativePath))).toHaveModuleSpec();
    }
  });

  test("REQ.NF.fe953 — PUEDE contener un `NOTES.md` por módulo", async () => {
    for await (const path of new Glob("**/NOTES.md").scan({ cwd: workspaceRoot })) {
      const relativePath = path.replaceAll("\\", "/");
      if (relativePath === "doc/spec/NOTES.md") continue;
      if (relativePath.includes("node_modules/") || relativePath.includes(".git/")) continue;
      expect(dirname(resolve(workspaceRoot, relativePath))).toHaveModuleSpec();
    }
  });

  test("REQ.NF.b763a — DEBE contener requerimientos por especificación", async () => {
    let total = 0;
    for await (const { text } of iterateFiles(await listSpecFiles())) {
      total += listRequirementIds(text).length;
    }
    expect(total).toBeGreaterThan(0);
  });

  describe("ENCABEZADO", () => {
    test("REQ.NF.a4a26 — DEBE tener un encabezado en cada archivo", async () => {
      for await (const { path, text } of iterateFiles(await listAuthoredFiles())) {
        expect(text, path).toHaveCompleteHeader();
      }
    });

    for (const { id, field } of HEADER_ATTR_REQUIREMENTS) {
      test(`${id} — DEBE tener el atributo \`@${field}\``, async () => {
        for await (const { path, text } of iterateFiles(await listAuthoredFiles())) {
          expect(text, path).toHaveHeaderField(field);
        }
      });
    }

    test("REQ.NF.26d18 — DEBE comenzar el atributo `@file` con \"This file\"", async () => {
      for await (const { path, text } of iterateFiles(await listAuthoredFiles())) {
        expect(text, path).toHaveFileFieldPrefix("This file");
      }
    });

    test("REQ.NF.5995e — DEBE usar el año presente en el atributo `@copyright`", async () => {
      for await (const { path, text } of iterateFiles(await listAuthoredFiles())) {
        expect(text, path).toHaveCurrentCopyrightYear();
      }
    });
  });

  test("REQ.NF.3c8e1 — DEBE compartir utilidades de prueba en la lib `@semantyk/test`", async () => {
    expect("src/libs/test/package.json").toExistInWorkspace();
    expect("src/libs/test/facade.ts").toExistInWorkspace();
    expect("src/libs/test/matchers.ts").toExistInWorkspace();
    expect(await workspace.readText("src/libs/test/workspace.ts")).toContain(
      "export const workspaceRoot",
    );
    expect(await workspace.readText("src/libs/test/matchers.ts")).toContain(
      "expect.extend",
    );
    expect(await workspace.readText("src/libs/test/facade.ts")).toContain(
      "listRequirementIds",
    );
  });

  test("REQ.NF.00f3c — DEBE validar cada requerimiento mediante archivos `*.test.ts`", async () => {
    expect((await listSpecFiles()).length).toBeGreaterThan(0);
  });

  test("REQ.NF.64b7c — DEBE identificar cada requerimiento con su ID en la prueba", async () => {
    for await (const { text } of iterateFiles(await listSpecFiles())) {
      for (const id of listRequirementIds(text)) {
        expect(isRequirementRegistered(text, id), id).toBe(true);
      }
    }
  });
});
