# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `README.md` con descripción del proyecto, stack, instrucciones de ejecución,
  configuración (login de Google y pedidos por WhatsApp), reglas de negocio y
  deuda técnica conocida.
- Documentación de la estructura modular del frontend bajo `js/`.

### Changed

- Se dividió el monolítico `script.js` (~470 líneas, todo en scope global) en
  módulos ES por responsabilidad:
  - `js/productos.js` — datos del catálogo.
  - `js/catalog.js` — render de catálogo, filtros por pupila y modal de detalle.
  - `js/cart.js` — estado y operaciones del carrito.
  - `js/checkout.js` — costos de envío, detección de tipo de tarjeta y pedido
    por WhatsApp.
  - `js/auth.js` — login con Google.
  - `js/ui.js` — navegación entre vistas (tienda / carrito).
  - `js/main.js` — punto de entrada, inicialización y delegación de eventos.
- Se reemplazaron los manejadores inline (`onclick`, `onchange`, `oninput`) por
  delegación de eventos con atributos `data-action`.
- El sitio ahora se carga con `<script type="module">`, por lo que debe servirse
  por HTTP (p. ej. `python -m http.server`); abrir `index.html` con doble clic
  deja de funcionar.

### Fixed

- HTML roto: sección `dual-catalog` anidada duplicada y `<<div` con carácter
  inválido.
- La tarjeta "Pegante para Pestañas (Bond & Seal)" no agregaba nada al carrito
  (referenciaba el id 100, inexistente). Se agregaron los productos id 98 (tabla
  de pestañas, $30.000) y id 100 (pegante, $7.000), alineados con los precios
  mostrados en las tarjetas.
- La tarjeta "Tabla de Pestañas Punto a Punto" agregaba el kit combo (id 99,
  $35.000) en vez del producto de $30.000 mostrado.
- Se renombró `ANGELES AMBER.jpg` a `ANGELES-AMBER.jpg` para coincidir con la
  referencia del catálogo.
- El botón "Añadir al carrito" del modal de detalle no tenía manejador (no hacía
  nada). Ahora agrega el producto respetando la cantidad seleccionada.
- `formatearFechaExp` (formato MM/AA del campo de vencimiento) se referenciaba
  en el HTML pero nunca se implementó.

### Notes

- `main` permanece como rama estable; el desarrollo ocurre en `developer`.
- Pendiente conocido: el checkout captura datos de tarjeta en el cliente y los
  envía por WhatsApp (no cumple estándares PCI). Ver README → "Estado del
  proyecto y deuda técnica conocida".

## [0.1.0] - 2026-08-19

### Added

- Versión inicial de la tienda MARÃO: catálogo de lentes de contacto cosméticos
  (filtros por pupila), tarjetas de pestañas, carrito con costos de envío, flujo
  de pedido por WhatsApp y login con Google (SDK GSI).

[unreleased]: https://github.com/erickR2007/Pag_Marao/compare/main...developer
[0.1.0]: https://github.com/erickR2007/Pag_Marao/releases/tag/v0.1.0
[SemVer]: https://semver.org