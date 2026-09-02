/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `knowledge.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the knowledge product specification requirements under poc.

@created: 2026-09-02 11:06
@modified: 2026-09-02 12:36

@since: 0.1.0-alpha.42
@version: 0.1.0-alpha.43

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, workspace } from "@semantyk/test";
import { describe, test } from "bun:test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const here = import.meta.dir;
const project = await workspace.readJson<{
  name?: string;
  targets?: Record<string, { command?: string }>;
}>("src/apps/sandbox/poc/knowledge/project.json");
const compose = await workspace.readYaml<{
  services?: Record<
    string,
    {
      build?: string | { context?: string };
      environment?: Record<string, string> | string[];
      env_file?: string | string[] | { path?: string }[];
      volumes?: string[];
    }
  >;
}>("src/apps/sandbox/poc/knowledge/compose.yaml");
const dockerfile = await workspace.readText(
  "src/apps/sandbox/poc/knowledge/Dockerfile",
);

describe("KNOWLEDGE", () => {
  test("REQ.F.eb5d1 — DEBE corresponder al knowledge graph", () => {
    expect(import.meta.dirname).toMatch(/[/\\]knowledge$/);
  });

  test("REQ.F.758c6 — DEBE declarar su proyecto nx en `project.json`", () => {
    expect(existsSync(resolve(here, "project.json"))).toBe(true);
    expect(project.name).toBe("@semantyk/knowledge");
  });

  test("REQ.F.1b336 — DEBE declarar los targets `build`, `dev`, `start`, `stop` y `test` en nx", () => {
    for (const target of ["build", "dev", "start", "stop", "test"] as const) {
      expect(project.targets?.[target]?.command).toBeDefined();
    }
    expect(project.targets?.build?.command).toMatch(/\bdocker compose build\b/);
    expect(project.targets?.dev?.command).toMatch(/\bdocker compose up\b/);
    expect(project.targets?.start?.command).toMatch(/\bdocker compose up -d\b/);
    expect(project.targets?.stop?.command).toMatch(/\bdocker compose down\b/);
    expect(project.targets?.test?.command).toMatch(/\bbun test\b/);
  });

  test("REQ.F.9c4a2 — DEBE definir el servicio en `Dockerfile` y `compose.yaml`", () => {
    expect(existsSync(resolve(here, "Dockerfile"))).toBe(true);
    expect(existsSync(resolve(here, "compose.yaml"))).toBe(true);
    expect(compose.services?.knowledge?.build).toBeDefined();
  });

  test("REQ.F.6c05c — DEBE declarar el dataset `sandbox` en `src/config`", () => {
    const ttl = resolve(here, "src/config/sandbox.config.ttl");
    expect(existsSync(ttl)).toBe(true);
    expect(dockerfile).not.toMatch(/\bFUSEKI_DATASET_/);
    expect(compose.services?.knowledge?.environment).toBeUndefined();
    return Bun.file(ttl)
      .text()
      .then((contents) => {
        expect(contents).toMatch(/fuseki:name\s+"sandbox"/);
        expect(contents).toMatch(/tdb2:location\s+"\/fuseki\/databases\/sandbox"/);
      });
  });

  test("REQ.F.9a2e1 — DEBE cargar credenciales desde `CREDENTIALS` en `.env`", () => {
    const example = resolve(here, ".env.example");
    const shiro = resolve(here, "src/config/shiro.ini");
    const entrypoint = resolve(here, "entrypoint.sh");
    expect(existsSync(example)).toBe(true);
    expect(existsSync(entrypoint)).toBe(true);
    expect(dockerfile).not.toMatch(/\b(ADMIN_(USER|PASSWORD)|CREDENTIALS)\b/);
    expect(dockerfile).toMatch(
      /ENTRYPOINT\s+\[\"\/sbin\/tini\",\s*\"--\",\s*\"sh\",\s*\"\/knowledge-entrypoint\.sh\"\]/,
    );
    const envFile = compose.services?.knowledge?.env_file;
    const files = Array.isArray(envFile) ? envFile : envFile ? [envFile] : [];
    expect(
      files.some((entry) =>
        typeof entry === "string" ? entry === ".env" : entry?.path === ".env",
      ),
    ).toBe(true);
    return Promise.all([
      Bun.file(example).text(),
      Bun.file(shiro).text(),
      Bun.file(entrypoint).text(),
    ]).then(([exampleText, shiroText, entrypointText]) => {
      expect(exampleText).toMatch(/^CREDENTIALS=/m);
      expect(entrypointText).toMatch(/\bCREDENTIALS\b/);
      expect(shiroText).toMatch(/\$\{ADMIN_USER\}=\$\{ADMIN_PASSWORD\}/);
      expect(shiroText).toMatch(/user\[\$\{ADMIN_USER\}\]/);
    });
  });

  test("REQ.F.c464c — DEBE contener `src/config`, `src/data` y `src/logs`", () => {
    for (const name of ["config", "data", "logs"] as const) {
      const dir = resolve(here, "src", name);
      expect(existsSync(dir)).toBe(true);
      expect(statSync(dir).isDirectory()).toBe(true);
    }
  });

  test("REQ.F.01f11 — DEBE montar `src/config`, `src/data` y `src/logs` en el servicio", () => {
    const volumes = compose.services?.knowledge?.volumes ?? [];
    expect(volumes.some((volume) => volume.includes("src/config"))).toBe(true);
    expect(volumes.some((volume) => volume.includes("src/data"))).toBe(true);
    expect(volumes.some((volume) => volume.includes("src/logs"))).toBe(true);
  });

  test("REQ.F.c23c8 — DEBE declarar `shiro.ini` en `src/config` y copiarlo en el `Dockerfile`", () => {
    const shiro = resolve(here, "src/config/shiro.ini");
    expect(existsSync(shiro)).toBe(true);
    expect(statSync(shiro).isFile()).toBe(true);
    expect(dockerfile).toMatch(/COPY\s+src\/config\/shiro\.ini\s+\/jena-fuseki\/shiro\.ini/);
  });

  test("REQ.F.3c903 — Cada dataset DEBE declararse como `{nombre}.config.ttl`", () => {
    const config = resolve(here, "src/config");
    const configs = readdirSync(config).filter((name) => name.endsWith(".ttl"));
    expect(configs.length).toBeGreaterThan(0);
    for (const name of configs) {
      expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.config\.ttl$/);
    }
    expect(existsSync(resolve(config, "sandbox.config.ttl"))).toBe(true);
    expect(dockerfile).toMatch(/COPY\s+src\/config\/\*\.config\.ttl\s+\/fuseki\/configuration\//);
  });

  test("REQ.F.3c95f — DEBE activar logs en archivo bajo `/fuseki/logs`", () => {
    const log4j = resolve(here, "src/config/log4j2.properties");
    expect(existsSync(log4j)).toBe(true);
    expect(statSync(log4j).isFile()).toBe(true);
    const text = Bun.file(log4j).text();
    return text.then((contents) => {
      expect(contents).toMatch(/\/fuseki\/logs\/knowledge\.log/);
      expect(contents).toMatch(/\/fuseki\/logs\/requests\.log/);
      expect(contents).toMatch(/logger\.fuseki-request\.level\s*=\s*INFO/);
      expect(dockerfile).toMatch(
        /COPY\s+src\/config\/log4j2\.properties\s+\/jena-fuseki\/log4j2\.properties/,
      );
    });
  });
});
