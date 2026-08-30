/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `repo.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the monorepository specification requirements.

@created: 2026-08-29 23:29
@modified: 2026-08-30 00:50

@since: 0.1.0-alpha.0
@version: 0.1.0-alpha.0

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { root } from "#test/helpers";
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const pkg = await Bun.file(resolve(root, "package.json")).json();
const project = await Bun.file(resolve(root, "project.json")).json();

const ENV_BRANCHES = ["sandbox", "dev", "staging", "main"] as const;
type EnvBranch = (typeof ENV_BRANCHES)[number];

async function currentEnvBranch(): Promise<EnvBranch | null> {
  const fromCi =
    process.env.GITHUB_EVENT_NAME === "pull_request"
      ? process.env.GITHUB_BASE_REF
      : process.env.GITHUB_REF_NAME;
  if (fromCi && (ENV_BRANCHES as readonly string[]).includes(fromCi)) {
    return fromCi as EnvBranch;
  }

  const proc = Bun.spawn(["git", "branch", "--show-current"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  const out = (await new Response(proc.stdout).text()).trim();
  await proc.exited;
  return (ENV_BRANCHES as readonly string[]).includes(out)
    ? (out as EnvBranch)
    : null;
}

describe("EL MONOREPOSITORIO", () => {
  test("REQ.NF.eee0b — DEBE tener un nombre", () => {
    expect(typeof pkg.name).toBe("string");
    expect(pkg.name.length).toBeGreaterThan(0);
  });

  test("REQ.NF.73f29 — DEBE tener una descripción", () => {
    expect(typeof pkg.description).toBe("string");
    expect(pkg.description.length).toBeGreaterThan(0);
  });

  test("REQ.NF.0379a — DEBE tener una arquitectura de monorepositorio", () => {
    expect(existsSync(resolve(root, "doc"))).toBe(true);
    expect(existsSync(resolve(root, "src"))).toBe(true);
  });

  test("REQ.NF.901fa — DEBE tener una arquitectura modular", () => {
    expect(existsSync(resolve(root, "src/apps"))).toBe(true);
    expect(existsSync(resolve(root, "src/libs"))).toBe(true);
    expect(existsSync(resolve(root, "src/packages"))).toBe(true);
  });

  test("REQ.NF.7ba58 — DEBE tener un CÓDIGO FUENTE", () => {
    expect(existsSync(resolve(root, "src/src.test.ts"))).toBe(true);
  });

  test("REQ.NF.09da8 — DEBE tener una ESPECIFICACIÓN", () => {
    expect(existsSync(resolve(root, "doc/spec/spec.test.ts"))).toBe(true);
  });

  describe("scripts", () => {
    test("REQ.NF.835d9 — DEBE declarar un script `dev` que ejecute todos los targets en paralelo con nx", () => {
      expect(pkg.scripts?.dev).toMatch(/nx run-many\s+-t\s+dev\b.*--parallel/);
    });

    test("REQ.NF.65ad4 — DEBE declarar un script `build` que ejecute todos los targets en paralelo con nx", () => {
      expect(pkg.scripts?.build).toMatch(/nx run-many\s+-t\s+build\b.*--parallel/);
    });

    test("REQ.NF.e9019 — DEBE declarar un script `start` que ejecute todos los targets en paralelo con nx", () => {
      expect(pkg.scripts?.start).toMatch(/nx run-many\s+-t\s+start\b.*--parallel/);
      expect(project.targets?.start?.command).toMatch(
        /docker compose --all-resources up -d/,
      );
    });

    test("REQ.NF.a4c2f — DEBE declarar un script `stop` que ejecute todos los targets en paralelo con nx", () => {
      expect(pkg.scripts?.stop).toMatch(/nx run-many\s+-t\s+stop\b.*--parallel/);
      expect(project.targets?.stop?.command).toMatch(
        /docker compose --all-resources down/,
      );
    });

    test("REQ.NF.7d1b8 — DEBE declarar un script `test` que ejecute todos los targets en paralelo con nx", () => {
      expect(pkg.scripts?.test).toMatch(/nx run-many\s+-t\s+test\b.*--parallel/);
      expect(project.targets?.test?.command).toMatch(/\bbun test\b/);
    });
  });

  test("REQ.NF.e1085 — DEBE declarar los targets de nx del repositorio en `project.json`", () => {
    expect(existsSync(resolve(root, "project.json"))).toBe(true);
    expect(pkg.nx).toBeUndefined();
  });

  test("REQ.NF.39503 — DEBE mostrar en el README el badge de compliance de la rama de entorno", async () => {
    const branch = await currentEnvBranch();
    if (!branch) return;

    const readme = await Bun.file(resolve(root, "README.md")).text();
    const licenseId = String(pkg.license ?? "");
    expect(licenseId.length).toBeGreaterThan(0);

    const licenseSection = readme.match(/## License\n\n([^\n]+)\n([^\n]+)/);
    expect(licenseSection).not.toBeNull();
    const [, licenseBadge, complianceBadge] = licenseSection!;

    expect(licenseBadge).toMatch(/^\[!\[license\]\(/);
    expect(licenseBadge).toMatch(/img\.shields\.io\/badge\/license-/);
    for (const part of licenseId.split("-")) {
      expect(licenseBadge.toUpperCase()).toContain(part.toUpperCase());
    }

    expect(complianceBadge).toMatch(/^\[!\[compliance\]\(/);
    expect(complianceBadge).toContain(`${branch}.yaml`);
    expect(complianceBadge).toContain(`branch=${branch}`);

    for (const other of ENV_BRANCHES) {
      if (other === branch) continue;
      expect(complianceBadge).not.toContain(`branch=${other}`);
    }
  });
});
