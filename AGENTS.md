# AGENTS.md

Marao es una tienda virtual (e-commerce) de lentes de contacto y accesorios, incluyendo pestañas pelo a pelo. Construida con HTML, CSS y JavaScript vanilla, sin framework. Proyecto en desarrollo activo.

## Entorno de desarrollo

- No hay proceso de build: son archivos estáticos (HTML/CSS/JS).
- Levantar el sitio con un servidor local, no abriendo el `.html` directamente:
  - `npx serve .`
  - o extensión "Live Server" de VS Code
  - o `python -m http.server 8000`
- Abrir con `file://` puede romper módulos JS (`type="module"`) o llamadas `fetch` por restricciones del navegador — usar siempre servidor local.

## Estructura del proyecto

- Una carpeta por responsabilidad (p. ej. `/css`, `/js`, `/assets/img`).
- Cada módulo funcional vive en su propio archivo JS, no en un solo `script.js` gigante.
- Esta sección es orientación general, no un mapa exhaustivo — actualízala solo si cambia la organización real del repo.

## Módulos funcionales del sitio

- Inicio
- Catálogo: lentes de contacto
- Catálogo: pestañas pelo a pelo
- Buscador de productos
- Carrito de compras
- Pasarela de pagos
- Contacto

Antes de tocar cualquiera de estos módulos, revisa cómo están implementados los otros para mantener consistencia (nombres de funciones, estructura del DOM, clases CSS).

## Convenciones de código

### HTML
- HTML5 semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` — no todo en `<div>`.
- Un único `<h1>` por página; jerarquía de encabezados sin saltos.
- `alt` descriptivo en todas las imágenes de producto (vacío `alt=""` solo si es puramente decorativa).
- Cada `<input>` (buscador, checkout, contacto) con su `<label>` asociado.
- HTML válido: etiquetas cerradas, anidamiento correcto, atributos entre comillas.
- Separación de responsabilidades: estructura (HTML), presentación (CSS) y comportamiento (JS) en archivos distintos — nada de estilos inline ni `onclick=""` en el markup.

### CSS
- Nombres de clase consistentes y predecibles (BEM u otro patrón ya usado en el proyecto — revisar antes de mezclar convenciones).
- Mobile-first: estilos base para móvil, `min-width` en media queries para pantallas más grandes.
- Evitar `!important`; si parece necesario, es señal de que el selector está mal planteado.
- Variables CSS (`--color-primary`, `--spacing-md`, etc.) para colores, espaciados y tipografía repetidos, en vez de valores sueltos.
- Evitar selectores muy anidados o acoplados a la estructura HTML exacta — se rompen fácil ante cambios de markup.

### JavaScript
- `const` por defecto, `let` solo si la variable cambia, nunca `var`.
- Un archivo por funcionalidad (`carrito.js`, `buscador.js`, `pagos.js`...), sin mezclar responsabilidades en un solo script.
- Módulos ES (`type="module"`) o funciones/IIFE para evitar contaminar el scope global — nada de variables sueltas en `window`.
- `===`/`!==` en vez de `==`/`!=`.
- Nombres descriptivos y consistentes (elegir español o inglés para nombres de variables/funciones y mantenerlo en todo el proyecto).
- `async`/`await` con `try/catch` explícito para cualquier llamada asíncrona (crítico en pasarela de pagos y en el buscador si consulta una API) — nunca una promesa sin manejo de errores.
- `debounce` en inputs de alta frecuencia (el buscador no debe filtrar en cada tecla sin debounce).
- Preferir métodos inmutables (spread, `toSorted`, `toReversed`, `map`/`filter`) sobre mutar directamente arrays compartidos como el estado del carrito, para evitar bugs difíciles de rastrear.
- Comentarios explican el "por qué", no el "qué" (el código ya dice el qué).

## Pruebas y verificación

No hay framework de testing automatizado todavía. Antes de dar una tarea por terminada:

- Verificar en el navegador que la funcionalidad tocada corre sin errores en consola.
- Si se toca carrito o pagos, probar el flujo completo: agregar producto → ver carrito → iniciar checkout.
- Revisar accesibilidad básica: `alt` en imágenes de producto, `label` en inputs.
- Revisar la vista en móvil, especialmente catálogo y carrito.

## Pasarela de pagos y seguridad

- Nunca manejar ni almacenar datos de tarjeta en el JS del cliente.
- Usar siempre el checkout hospedado o widget oficial del proveedor de pagos.
- Ninguna llave secreta en el código fuente ni en el repo — solo claves públicas si el proveedor lo requiere en cliente.
- Tratar los datos personales de clientes (nombre, dirección, contacto) con el mismo cuidado que los datos de pago.

## Commits

- Conventional Commits en inglés: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`.
- El asunto describe el cambio y el módulo afectado, p. ej. `refactor: split JS into ES modules with event delegation`.
- Cambios grandes (nueva sección, reestructuración de carpetas) se explican brevemente en la descripción.
- No reescribir código funcional solo por preferencia de estilo.