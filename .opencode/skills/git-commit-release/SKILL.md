---
name: git-commit-release
description: Crear commits siguiendo Conventional Commits y gestionar releases/changelog de Marao. Usar cuando el usuario pida commitear cambios, crear un commit, o preparar un release.
---

## Commits

La convención vive en `AGENTS.md` de este repo — este skill la aplica, no la reemplaza. Si `AGENTS.md` cambia, sigue lo que diga ahí.

Formato: `<type>(<scope opcional>): <descripción>`, en inglés, imperativo.

Types permitidos:
- `feat`: funcionalidad nueva visible para el usuario
- `fix`: corrección de bug
- `refactor`: cambio de estructura sin cambiar comportamiento
- `docs`: solo documentación (AGENTS.md, README, comentarios)
- `chore`: mantenimiento, config, dependencias
- `perf`: mejora de rendimiento

Cambios incompatibles: usar `!` después del type/scope y agregar un footer `BREAKING CHANGE: <detalle>`.

### Procedimiento al commitear

1. Ejecutar `git status` y `git diff` para ver qué cambió realmente — nunca asumir el contenido del cambio.
2. Si hay cambios de distinta naturaleza mezclados (p. ej. un fix en `carrito.js` junto con un ajuste de estilos en `pagos.js`), separarlos en commits distintos e independientes en vez de uno solo genérico.
3. Redactar el mensaje siguiendo el formato de arriba, basado en el diff real, no en lo que se cree haber hecho.
4. Mostrar el mensaje propuesto (y los archivos que incluye) antes de ejecutar el commit — esperar confirmación, no commitear directamente sin mostrarlo primero.
5. No agregar trailers tipo `Co-authored-by` ni menciones de generación por IA en el mensaje.

## Releases

Marao es un sitio estático sin pipeline de build, así que un "release" acá equivale a un punto estable del sitio listo para desplegar.

1. Mantener un `CHANGELOG.md` en la raíz, formato [Keep a Changelog](https://keepachangelog.com): secciones `### Added`, `### Fixed`, `### Changed` bajo un encabezado `## [Unreleased]`.
2. Cada commit `feat`/`fix`/`refactor` relevante para el usuario final agrega una línea corta al changelog, en español (el changelog es para Yamid, no para agentes).
3. Al preparar un release: mover las entradas de `## [Unreleased]` a una nueva sección con la fecha, p. ej. `## [2026-08-20]`, y crear un tag de git `vX.Y.Z` siguiendo semver (`fix`/`refactor` → patch, `feat` → minor, breaking change → major).
4. No inventar número de versión sin revisar el último tag existente (`git tag --sort=-v:refname | head -1`).