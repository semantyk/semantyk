/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `main.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the project-level specification requirements.

@created: 2026-08-29 23:28
@modified: 2026-08-30 13:21

@since: 0.1.0-alpha.6
@version: 0.1.0-alpha.36

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
});
