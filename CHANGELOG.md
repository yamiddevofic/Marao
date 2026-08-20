# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- El sitio ahora se sirve con módulos JS: requiere servidor HTTP local (abrir con doble clic ya no funciona).
- El diseño se adapta a móvil (mobile-first) y las imágenes del catálogo usan carga diferida (lazy loading).

### Fixed

- El botón "Añadir al carrito" del modal de detalle no hacía nada.
- La tarjeta "Tabla de Pestañas Punto a Punto" agregaba el kit combo ($35.000) en vez de la tabla ($30.000).
- La tarjeta "Pegante para Pestañas (Bond & Seal)" no agregaba nada al carrito.
- La imagen del lente Ángeles Ámbar no cargaba (referencia con nombre incorrecto).
- El campo de vencimiento de tarjeta (MM/AA) no formateaba la entrada.

## [0.1.0] - 2026-08-19

### Added

- Versión inicial de la tienda MARÃO: catálogo de lentes de contacto cosméticos
  (filtros por pupila), tarjetas de pestañas, carrito con costos de envío, flujo
  de pedido por WhatsApp y login con Google (SDK GSI).

[unreleased]: https://github.com/erickR2007/Pag_Marao/compare/main...developer
[0.1.0]: https://github.com/erickR2007/Pag_Marao/releases/tag/v0.1.0
[SemVer]: https://semver.org