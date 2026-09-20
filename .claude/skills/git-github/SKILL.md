# Git y GitHub

## Propósito

Usa esta skill para cualquier tarea que cambie el repositorio, cree commits, publique ramas, abra o actualice issues/PRs, o necesite revisar el estado de Git. El objetivo es preservar cambios existentes, mantener un historial claro y evitar publicar secretos o cambios no revisados.

## Reglas de seguridad

- Nunca ejecutes `git reset --hard`, `git checkout --`, `git clean`, `git push --force` ni borres ramas sin autorización explícita.
- Nunca modifiques la configuración global o local de Git para saltarte hooks, firmas, permisos o revisiones.
- Nunca incluyas secretos: `.env`, tokens, claves privadas, credenciales, dumps, datos personales ni archivos generados con información sensible.
- Revisa siempre `git status`, `git diff` y `git diff --cached` antes de confirmar.
- No reviertas cambios de otra persona. Si un cambio ajeno entra en conflicto con la tarea, detente y pregunta.
- No hagas commit de todo el worktree por comodidad. Prepara solo los archivos y hunks relacionados con la tarea.
- No uses `--no-verify`, `--force`, `--amend` ni commits vacíos salvo que la persona lo pida explícitamente.
- No cierres un issue hasta que la solución esté publicada y verificada en la rama correcta.

## Flujo de trabajo

1. Lee `AGENTS.md`, identifica la rama actual y revisa `git status --short`.
2. Consulta el issue o PR con `gh issue view`, `gh pr view` o la orden apropiada antes de cambiar código.
3. Inspecciona `git log --oneline -10`, `git diff` y los archivos afectados. No asumas que el worktree está limpio.
4. Define el alcance mínimo. Separa cambios de documentación, código, pruebas y assets cuando eso mejore la revisión.
5. Implementa y ejecuta las verificaciones disponibles antes de preparar el commit.
6. Revisa el diff completo, incluyendo nombres y contenido de archivos nuevos. Busca secretos con revisión manual y, si está disponible, `git diff --check`.
7. Usa Conventional Commits en inglés: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`. El asunto debe ser breve y específico.
8. Después del commit comprueba `git status --short`, `git log -1 --stat` y el hash creado.
9. Publica solo cuando la persona lo haya pedido o el flujo de la tarea lo requiera: `git push origin <rama>`.
10. Tras publicar, verifica el estado remoto y actualiza GitHub con `gh`. Enlaza el commit, PR o issue en el resultado.

## Commits

- Un commit debe representar una unidad lógica revisable.
- No mezcles cambios preexistentes no relacionados solo porque estén en los mismos archivos.
- Si un archivo contiene cambios propios y ajenos, prepara hunks selectivos con `git add -p` o `git apply --cached`; nunca borres los ajenos para facilitar el commit.
- Antes de commitear, revisa nombres de archivos nuevos, permisos, binarios grandes y rutas inesperadas.
- Después de commitear no reescribas el commit: crea otro commit correctivo si hace falta.

## GitHub

- Usa `gh`, no llamadas manuales a APIs ni ediciones web simuladas.
- Antes de publicar, confirma `git remote -v`, la rama actual y su relación con el remoto.
- Para issues, comenta el resultado con el hash o PR y cierra solo si el criterio de aceptación está cumplido.
- Para PRs, revisa todos los commits incluidos, el diff contra la base y los checks antes de afirmar que está listo.
- No hagas merge, no cambies permisos y no borres ramas sin autorización explícita.
- Si el push falla por divergencia, no fuerces: inspecciona el remoto y pregunta cómo resolverlo.

## Verificación final

- `git diff --check` y `git diff --cached --check` no deben reportar errores.
- Ejecuta las pruebas o validaciones propias del proyecto y documenta las que no existan.
- Confirma que el worktree queda limpio o enumera claramente los cambios que siguen pendientes.
- Reporta el commit, la rama, el resultado de las pruebas y el enlace de GitHub si se publicó.
