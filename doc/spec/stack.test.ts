/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `stack.test.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file defines the stack specification requirements.

@created: 2026-08-29 23:47
@modified: 2026-08-31 10:57

@since: 0.1.0-alpha.6
@version: 0.1.0-alpha.40

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

import { expect, runGh, workspace, workspaceRoot } from "@semantyk/test";
import { Glob } from "bun";
import { describe, test } from "bun:test";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";

const pkg = await workspace.readJson<{
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}>("package.json");
const compose = await workspace.readYaml<{
  networks?: Record<string, unknown>;
  include?: { path?: string }[];
}>("compose.yaml");

async function collectIncludedComposes(
  composePath: string,
  seen = new Set<string>(),
) {
  const normalized =
    relative(workspaceRoot, composePath).replaceAll("\\", "/") || "compose.yaml";
  if (seen.has(normalized)) return seen;
  seen.add(normalized);

  const parsed = Bun.YAML.parse(await Bun.file(composePath).text()) as {
    include?: { path?: string }[];
  };
  for (const entry of parsed.include ?? []) {
    if (!entry.path) continue;
    const child = resolve(dirname(composePath), entry.path);
    await collectIncludedComposes(child, seen);
  }
  return seen;
}

function hasDep(name: string) {
  return Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
}

describe("EL STACK", () => {
  describe("NX", () => {
    test("REQ.NF.1f547 — DEBE usar nx como gestor", () => {
      expect(pkg.devDependencies?.nx).toBeDefined();
      expect("nx.json").toExistInWorkspace();
    });
  });

  describe("BUN", () => {
    test("REQ.NF.acc61 — DEBE usar bun como entorno de ejecución, pruebas y gestor de paquetes", () => {
      expect(pkg.packageManager).toMatch(/^bun@/);
      expect("bun.lock").toExistInWorkspace();
    });
  });

  describe("GH", () => {
    test("REQ.NF.0087b — DEBE usar `gh` para la gestión de proyectos en GitHub", async () => {
      const version = await runGh("--version");
      expect(version.code).toBe(0);
      expect(version.stdout).toMatch(/^gh version /);

      const projectHelp = await runGh("project", "--help");
      expect(projectHelp.code).toBe(0);
      expect(projectHelp.stdout + projectHelp.stderr).toMatch(/\bproject\b/);
    });
  });

  describe("TRIVY", () => {
    test("REQ.NF.0ac5c — DEBE usar Trivy para la política de licencias", async () => {
      expect("trivy.yaml").toExistInWorkspace();

      const workflows: string[] = [];
      for await (const path of new Glob(".github/workflows/*.{yaml,yml}").scan({
        cwd: workspaceRoot,
      })) {
        workflows.push(path.replaceAll("\\", "/"));
      }
      expect(workflows.length).toBeGreaterThan(0);

      for (const path of workflows) {
        const workflow = await workspace.readText(path);
        expect(workflow).toContain("aquasecurity/trivy-action@");
        expect(workflow).toMatch(/\bcomply\s*:/);
        expect(workflow).toMatch(/scanners:\s*license/);
        expect(workflow).toMatch(/severity:\s*CRITICAL/);
        expect(workflow).not.toContain("oss-review-toolkit");
      }
    });
  });

  describe("DOCKER", () => {
    test("REQ.NF.32aa0 — DEBE usar docker como gestor de contenedores", () => {
      expect("compose.yaml").toExistInWorkspace();
    });

    test("REQ.NF.ace68 — DEBE declarar una red `semantyk`", () => {
      expect(compose.networks?.semantyk).toBeDefined();
      expect(
        (compose.networks?.semantyk as { name?: string } | undefined)?.name,
      ).toBe("semantyk");
    });

    test("REQ.NF.94944 — PUEDE tener un compose por módulo", async () => {
      for await (const path of new Glob("**/compose.yaml").scan({
        cwd: workspaceRoot,
      })) {
        const normalized = path.replaceAll("\\", "/");
        if (normalized === "compose.yaml") continue;
        if (normalized.includes("node_modules/") || normalized.includes(".git/"))
          continue;
        const dir = dirname(workspace.resolve(normalized));
        expect(dir).toHaveModuleSpec();
      }
    });

    test("REQ.NF.f2672 — DEBE declarar una red por módulo que forme parte de la red `semantyk`", async () => {
      const included = await collectIncludedComposes(
        workspace.resolve("compose.yaml"),
      );

      for await (const path of new Glob("**/compose.yaml").scan({
        cwd: workspaceRoot,
      })) {
        const normalized = path.replaceAll("\\", "/");
        if (normalized === "compose.yaml") continue;
        if (normalized.includes("node_modules/") || normalized.includes(".git/"))
          continue;

        const module = basename(dirname(normalized));
        const moduleCompose = await workspace.readYaml<{
          networks?: Record<string, { name?: string }>;
        }>(normalized);

        expect(moduleCompose.networks?.[module]).toBeDefined();
        expect(moduleCompose.networks?.[module]?.name).toBe(module);
        expect(included.has(normalized)).toBe(true);
        expect(compose.networks?.semantyk).toBeDefined();
      }
    });

    test("REQ.NF.a5bfb — DEBE concentrar en cada Dockerfile la configuración del servicio que habilita", async () => {
      const dockerfiles: string[] = [];
      for await (const path of new Glob("**/Dockerfile").scan({
        cwd: workspaceRoot,
      })) {
        const normalized = path.replaceAll("\\", "/");
        if (normalized.includes("node_modules/") || normalized.includes(".git/"))
          continue;
        dockerfiles.push(normalized);
      }
      for (const path of dockerfiles) {
        const dockerfile = await workspace.readText(path);
        expect(dockerfile).toMatch(/\bENV\b/);
        expect(dockerfile).toMatch(/\bEXPOSE\b/);
      }

      for await (const path of new Glob("**/compose.yaml").scan({
        cwd: workspaceRoot,
      })) {
        const normalized = path.replaceAll("\\", "/");
        if (normalized.includes("node_modules/") || normalized.includes(".git/"))
          continue;

        const composeDir = dirname(workspace.resolve(normalized));
        const parsed = await workspace.readYaml<{
          services?: Record<
            string,
            {
              build?: string | { context?: string };
              environment?: Record<string, string> | string[];
            }
          >;
        }>(normalized);

        for (const [name, service] of Object.entries(parsed.services ?? {})) {
          if (!service.build) continue;
          const context =
            typeof service.build === "string"
              ? service.build
              : (service.build.context ?? ".");
          const dockerfilePath = resolve(composeDir, context, "Dockerfile");
          if (!existsSync(dockerfilePath)) continue;

          const dockerfile = await Bun.file(dockerfilePath).text();
          const envKeys = new Set<string>();
          let inEnv = false;
          for (const line of dockerfile.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const body = trimmed.startsWith("ENV ")
              ? trimmed.slice(4)
              : inEnv
                ? trimmed
                : null;
            if (body === null) {
              inEnv = false;
              continue;
            }
            for (const part of body.replace(/\\$/, "").split(/\s+/)) {
              const key = part.split("=")[0];
              if (key) envKeys.add(key);
            }
            inEnv = trimmed.endsWith("\\");
          }

          const composeEnv = service.environment;
          const composeKeys = Array.isArray(composeEnv)
            ? composeEnv.map((entry) => entry.split("=")[0]!)
            : Object.keys(composeEnv ?? {});

          for (const key of composeKeys) {
            expect(envKeys.has(key), `${name}: ${key} belongs in Dockerfile`).toBe(
              false,
            );
          }
        }
      }
    });
  });

  describe("ENV", () => {
    test("REQ.NF.4e8c1 — DEBE identificar cada variable de ambiente con ID `ENV_#####` (hex)", async () => {
      const envId = /^ENV_[0-9a-f]{5}$/;
      const assignment = /^ENV_[0-9a-f]{5}=/;
      const ids = new Set<string>();

      const envFiles = (await readdir(workspaceRoot))
        .filter((name) => name.startsWith(".env"))
        .map((name) => workspace.resolve(name));

      for (const path of envFiles) {
        const text = await Bun.file(path).text();
        for (const line of text.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          expect(trimmed, relative(workspaceRoot, path)).toMatch(assignment);
          const id = trimmed.slice(0, trimmed.indexOf("="));
          expect(id).toMatch(envId);
          expect(ids.has(id), `duplicate ${id}`).toBe(false);
          ids.add(id);
        }
      }

      if (envFiles.length > 0) {
        expect(ids.size).toBeGreaterThan(0);
      }
    });
  });

  describe("DATA", () => {});

  describe("LOGIC", () => {});

  describe("UX", () => {
    test("REQ.NF.6152d — DEBE usar React como biblioteca de ux", () => {
      expect(hasDep("react")).toBe(true);
    });

    test("REQ.NF.ad816 — DEBE usar Next.js como marco de ux", () => {
      expect(hasDep("next")).toBe(true);
    });

    test("REQ.NF.15d5e — DEBE usar Tailwind como marco de estilos", () => {
      expect(hasDep("tailwindcss")).toBe(true);
    });

    test("REQ.NF.eba2b — DEBE usar Motion como biblioteca de animaciones", () => {
      expect(hasDep("motion")).toBe(true);
    });

    test("REQ.NF.7c2ae — DEBE usar Tabler como biblioteca de íconos", () => {
      expect(hasDep("@tabler/icons-react")).toBe(true);
    });

    test("REQ.NF.3b089 — DEBE usar shadcn como biblioteca de componentes", () => {
      expect("src/packages/ux/components.json").toExistInWorkspace();
    });
  });
});
