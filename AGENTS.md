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
- `index.html` es la única página: la tienda (`#view-store`) y el carrito (`#view-cart`) son vistas que se alternan con la clase `hidden`, no páginas distintas.
- El mapa detallado de archivos está en el [README](README.md#estructura-de-archivos) — mantén ambos documentos en sincronía si cambia la organización real del repo.

## Módulos funcionales del sitio

Implementados:

- Inicio (hero de portada)
- Catálogo: lentes de contacto (`js/catalog.js`, con filtros por pupila)
- Catálogo: pestañas pelo a pelo (carrusel de tarjetas estáticas en `index.html` + `js/carrusel.js`)
- Modal de detalle de producto
- Carrito de compras (`js/cart.js`)
- Checkout con pedido por WhatsApp (`js/checkout.js`)
- Login con Google (`js/auth.js`)
- Accesorios y "¿Por qué comprar en MARÃO?" (secciones con fondo de estrellas, clase `.starry-section`)
- Contacto (footer)

Previstos, todavía no implementados:

- Buscador de productos
- Pasarela de pagos real (hoy los datos de tarjeta se capturan en el cliente — ver la sección de seguridad)

Antes de tocar cualquiera de estos módulos, revisa cómo están implementados los otros para mantener consistencia (nombres de funciones, estructura del DOM, clases CSS).

## Patrones ya establecidos (respétalos)

- **Delegación de eventos**: `js/main.js` escucha `click`, `change` e `input` en `document` y despacha por el atributo `data-action`. Para agregar una interacción, añade un `data-action` en el HTML y su `case` en el switch — nunca un `addEventListener` suelto por tarjeta ni un `onclick` en el markup.
- **Evento `cart:updated`**: cualquier cambio del carrito se notifica con este `CustomEvent` en `window`. Quien necesite reaccionar (badge, resumen de envío) se suscribe; no se llama al render desde `cart.js`.
- **Evento `sesion:cambiada`**: entrar o salir de una cuenta se notifica con este `CustomEvent` en `window`, igual que `cart:updated`. Quien dependa de la sesión se suscribe; `auth.js` no llama a los módulos que dependen de ella.
- **Persistencia**: todo lo que se guarda pasa por `js/almacenamiento.js`, nunca por `localStorage` directo — ese módulo envuelve cada acceso en `try/catch` porque en modo privado el solo hecho de tocarlo lanza. El carrito se guarda como `{id, cantidad}` y se revalida contra `productosBase` al restaurar; los datos de envío van por cuenta (`claveEnvio`). No se persiste nada del método de pago.
- **Design tokens**: usa las variables CSS de `:root` (`--color-*`, `--font-body`, `--font-display`, `--spacing-*`, `--radius-*`, `--gutter`) en vez de valores literales.
- **Idioma del código**: nombres de variables y funciones en español (`agregarAlCarrito`, `calcularCostosEnvio`); nombres de archivos y mensajes de commit en inglés.
- **Breakpoint único**: `@media (min-width: 769px)` en `css/styles.css`. No introduzcas breakpoints nuevos sin motivo.
- **Convenciones de móvil**: están en la skill `mobile-web` (`.claude/skills/mobile-web/`) — áreas táctiles, alturas `dvh`, zoom de iOS en formularios, desbordes y modales. Aplícalas al tocar cualquier vista y verifica con `scripts/audit-mobile.js` antes de dar el trabajo por terminado.
- **Categorías de producto**: usa `getLentes()` / `getAccesorios()` de `js/productos.js`, nunca filtres el catálogo por precio ni por rango de `id`.
- **Tipografías**: `--font-display` (Bitter) para el hero, `--font-ui` (Blinker) para catálogos, carrusel y secciones con estrellas, `--font-body` (Montserrat) para el resto. Los controles de formulario no heredan la fuente: hay que declararla.
- **Precios**: siempre con `formatearPrecio()` de `js/formato.js` (formato `es-CO`), nunca `toLocaleString()` sin locale.
- **Google Identity Services**: la inicialización se hace desde `js/auth.js` (hook `window.onGoogleLibraryLoad`), no con los atributos `data-callback` / `g_id_onload` de GSI: la librería resuelve esa configuración antes de que corran los módulos ES.
- **Datos externos en el DOM**: lo que venga de Google (nombre, email, foto) se asigna con `textContent` o como atributo, nunca interpolado en `innerHTML`.

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

> **Estado actual (deuda técnica)**: el checkout pide número de tarjeta, vencimiento y CVV pero no hay pasarela: el pedido sale por WhatsApp con solo los últimos 4 dígitos y el CVV nunca se usa. Se están pidiendo datos sensibles sin procesarlos. No amplíes esa lógica: cualquier trabajo sobre pagos debe ir hacia quitar esos campos o integrar un checkout hospedado.

## Commits

- Conventional Commits en inglés: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`.
- El asunto describe el cambio y el módulo afectado, p. ej. `refactor: split JS into ES modules with event delegation`.
- Cambios grandes (nueva sección, reestructuración de carpetas) se explican brevemente en la descripción.
- No reescribir código funcional solo por preferencia de estilo.