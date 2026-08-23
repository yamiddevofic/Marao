# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Tres lentes nuevos en el catálogo: Pataya Green, Estonia Blue y Estonia Green ($45.000 cada uno).
- Nueva sección "¿Por qué comprar en MARÃO?" con los tres argumentos de venta: envíos nacionales, calidad premium y pedidos por WhatsApp.
- Las tarjetas de pestañas ahora son un carrusel: se deslizan con el dedo, con el teclado o con las flechas del bloque.
- Se publicó la sección "Accesorios y cuidado para tus lentes" (solución, kit aplicador + pinza, estuche porta-lentes y lavadora manual), que estaba definida pero no se mostraba en la página. Cada accesorio muestra ahora su descripción.

### Changed

- En escritorio, la portada y el catálogo se ven a dos mitades iguales: el bloque de pestañas ocupa media página, llega al borde derecho y la imagen del hero se monta sobre su parte superior.
- Las tarjetas de producto se rediseñaron: imagen cuadrada con margen, nombre y precio centrados y botón negro a lo ancho del borde inferior.
- Los slides de pestañas son verticales y más altos, como en el diseño.
- El botón de las tarjetas ahora dice "AÑADIR" (antes "AÑADIR AL CARRITO") y se ve más grande.
- Las secciones de accesorios y "por qué comprar" comparten el fondo con estrellas del diseño, separadas de los catálogos por una franja marrón.
- Los catálogos, el carrusel y las secciones nuevas usan la tipografía Blinker.
- Se actualizaron los precios y textos de los accesorios según el diseño: solución $17.000, kit aplicador + pinza $5.000, estuche porta-lentes $10.000 y lavadora manual $10.000.
- El hero de la portada se rediseñó: imagen vertical (proporción 500×834) sin distorsión, tipografía Bitter más grande, texto de presentación ampliado y botones redondeados alineados al párrafo.
- El sitio ahora se sirve con módulos JS: requiere servidor HTTP local (abrir con doble clic ya no funciona).
- El diseño se adapta a móvil (mobile-first) y las imágenes del catálogo usan carga diferida (lazy loading).

### Fixed

- El botón de "Iniciar sesión con Google" no respondía: la librería de Google se cargaba antes que el código del sitio y descartaba la configuración. Ahora el login se inicializa cuando la librería avisa que está lista.
- Los precios calculados en la página (catálogo, carrito y resumen) se mostraban con formato extranjero ("$45,000") si el navegador estaba en otro idioma; ahora siempre usan el formato colombiano ("$45.000").
- Los productos sin imagen en el repositorio (Citrina Brown y Choco Dark) mostraban una imagen rota; ahora se ve una imagen de reemplazo de la marca.
- Al añadir un producto desde el modal de detalle, el modal se quedaba abierto.
- Un número de Nequi que empezara por 34 o 37 se marcaba como American Express; ahora el tipo se toma del método de pago seleccionado.
- El botón "Añadir al carrito" del modal de detalle no hacía nada.
- La tarjeta "Tabla de Pestañas Punto a Punto" agregaba el kit combo ($35.000) en vez de la tabla ($30.000).
- La tarjeta "Pegante para Pestañas (Bond & Seal)" no agregaba nada al carrito.
- La imagen del lente Ángeles Ámbar no cargaba (referencia con nombre incorrecto).
- El campo de vencimiento de tarjeta (MM/AA) no formateaba la entrada.

### Security

- El nombre y el correo de la cuenta de Google se insertaban en la página como HTML; ahora se insertan como texto, evitando que un nombre de cuenta manipulado inyecte código.

## [0.1.0] - 2026-08-19

### Added

- Versión inicial de la tienda MARÃO: catálogo de lentes de contacto cosméticos
  (filtros por pupila), tarjetas de pestañas, carrito con costos de envío, flujo
  de pedido por WhatsApp y login con Google (SDK GSI).

[unreleased]: https://github.com/erickR2007/Pag_Marao/compare/main...developer
[0.1.0]: https://github.com/erickR2007/Pag_Marao/releases/tag/v0.1.0
[SemVer]: https://semver.org