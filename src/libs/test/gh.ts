/*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `gh.ts`
@organization: Semantyk
@project: Ecosystem

@file: This file runs the GitHub CLI with CI-friendly authentication.

@created: 2026-08-31 10:57
@modified: 2026-08-31 10:57

@since: 0.1.0-alpha.40
@version: 0.1.0-alpha.40

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/

export type GhResult = {
  code: number;
  stdout: string;
  stderr: string;
};

/** Prefer `GH_TOKEN`; fall back to Actions' `GITHUB_TOKEN`. */
function ghEnv(): Record<string, string | undefined> {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  return {
    ...process.env,
    ...(token ? { GH_TOKEN: token } : {}),
  };
}

export async function runGh(...args: string[]): Promise<GhResult> {
  const proc = Bun.spawn(["gh", ...args], {
    stdout: "pipe",
    stderr: "pipe",
    env: ghEnv(),
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { code, stdout, stderr };
}
