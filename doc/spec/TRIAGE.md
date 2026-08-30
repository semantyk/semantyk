<!--––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `TRIAGE.md`
@organization: Semantyk
@project: Ecosystem

@file: This file holds pending requirements before they are placed in their respective specification spaces.

@created: 2026-08-29 23:36
@modified: 2026-08-30 05:11

@since: 0.1.0-alpha.6
@version: 0.1.0-alpha.35

@author: Semantyk Team
@maintainer: Daniel Bakas <daniel@semantyk.com>
@copyright: Semantyk © 2026
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––-->

# TRIAJE

## Especificación

- La especificación DEBE tener un `ROADMAP`.
- El `ROADMAP` DEBE delimitar el alcance de cada tren `X.Y.Z` (qué entra en alpha/beta/rc/stable).

## Flujo de ramas y versionamiento (pendiente de especificar)

- `sandbox` es laboratorio: NO forma parte del flujo de promoción.
- Lo útil de `sandbox` se materializa en una o más ramas `feat/*`.
- Cada feature DEBE nacer de un issue de GitHub; la rama DEBE usar el número de issue (p. ej. `feat/42-slug`).
- `dev` es la primera integración real; cada integración/actualización en `dev` se versiona con `X.Y.Z-{alpha|beta|rc}.N`.
- Si algo falla, se repara en la rama `feat/*` (nunca en `staging` ni `main`) y se reintegra por `dev`.
- `staging` y `main` solo reciben merge o PR de promoción; NO se modifican en sitio.
- Cadena de promoción: `dev` → `staging` → `main`.
- Un tren empieza en `X.Y.Z-alpha.0`; al cerrar alpha se congela el último `.N`, se promueve, y el trabajo vivo abre `X.Y.Z-beta.0` (análogo para rc → stable).
