/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `main.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the project-level specification requirements.

@created: 2026-08-29 23:28
@modified: 2026-08-31 11:47

@since: 0.1.0-alpha.6
@version: 0.1.0-alpha.41

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, iterateFiles, listAuthoredFiles } from "@semantyk/test";
import { describe, test } from "bun:test";

describe("EL PROYECTO", () => {
  test("REQ.NF.c5cc6 — DEBE tener un nombre", async () => {
    for await (const { path, text } of iterateFiles(await listAuthoredFiles())) {
      expect(text, path).toHaveHeaderField("project");
    }
  });

  test("REQ.NF.da742 — DEBE tener un MONOREPOSITORIO", () => {
    expect("doc/spec/repo.test.ts").toExistInWorkspace();
  });

  test("REQ.NF.b8e4f — DEBE tener un plan de trabajo", () => {
    expect("doc/spec/plan.test.ts").toExistInWorkspace();
  });

  test("REQ.NF.6f1a3 — DEBE gestionar el trabajo con issues de GitHub", () => {
    expect("doc/spec/issues.test.ts").toExistInWorkspace();
  });

  test("REQ.NF.01cf5 — DEBE tener una especificación de desarrollo", () => {
    expect("doc/spec/dev.test.ts").toExistInWorkspace();
  });
});

