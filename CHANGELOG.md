# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- El panel de administración permite ver la contraseña mientras se escribe (botón del ojo, en el acceso y al cambiarla) y, desde «Mi cuenta» en el encabezado, cambiar la contraseña: pide la actual, la nueva dos veces y exige al menos 8 caracteres.
- ePayco pasó a producción: los pagos con tarjeta y Nequi son cobros reales. Se quitó la URL de confirmación, que apuntaba a una ruta inexistente; los pagos se verifican en el panel de ePayco.
- El footer enlaza Instagram, TikTok y WhatsApp con las cuentas oficiales de la marca, y TikTok se sumó a los datos estructurados.

- El footer muestra los iconos de redes sociales (Instagram y WhatsApp enlazados; TikTok y Facebook listos para activar cuando haya enlace) y el teléfono de contacto es un enlace que llama.
- SEO: título y descripción pensados para búsquedas, URL canónica, datos estructurados de tienda en línea (schema.org), `robots.txt`, `sitemap.xml`, favicon con la «M» del logo y el panel marcado como `noindex`.
- Al compartir el enlace (WhatsApp, Instagram, Facebook, X) aparece una vista previa con título, descripción y una captura de la página de inicio completa, con la modelo de la portada sin recortar (`assets/img/og-image.jpg`, 1200×630).
- En el panel, los filtros se adaptan a la sección: el de categoría solo ofrece las de esa sección y se oculta si no tiene ninguna, y el de color solo aparece en Lentes.

- En Lentes, pupila reducida, pupila estándar y cosplay Halloween pasaron a ser categorías: en la tienda reemplazan la fila fija «Pupila» y el botón de tono «COSPLAY», y en el panel se eligen en el selector de categoría. Los 121 lentes existentes quedaron asignados a la suya.
- El panel de administración se rediseñó: encabezado con buscar, ver tienda y cerrar sesión; acciones «Categorías» y «Nuevo producto» siempre a la vista (desaparece el botón flotante); indicadores con color por estado; filtros en una sola barra; el inventario es una lista de filas con miniatura, sección y categoría, precio y estado; «Eliminar todos» se movió a una zona de peligro al final.

- Categorías dentro de cada sección (lentes, pestañas y accesorios), creadas por la administradora desde el panel: el botón «Categorías» del panel permite crearlas, renombrarlas, reordenarlas y eliminarlas (sus productos no se borran, quedan sin categoría). Cada ficha de producto tiene su selector de categoría y la lista del panel un filtro nuevo. En la tienda aparecen como botones de filtro en cada sección, solo si tienen productos, y quedan en la URL. Las secciones son tres: Lentes, Pestañas y Accesorios.

- La tienda y el panel tienen un buscador con lupa en el encabezado. Abre un diálogo con resultados en vivo por nombre y alias; en la tienda un lente abre su ficha y las pestañas o accesorios se resaltan en su sección, y en el panel cada resultado se puede editar.

- El CRUD del panel quedó completo: se pueden crear productos nuevos, eliminar uno desde su ficha (con confirmación) y vaciar el catálogo (confirmando con la palabra ELIMINAR). Las acciones viven en un botón flotante «+» abajo a la derecha, sobrepuesto al contenido.

- El panel de administración permite editar la ficha completa de cada producto (nombre, descripción, precio, categoría, estado, orden y, en los lentes, tono, cobertura, borde, efecto, alias y presentaciones) y cambiar su foto, que se sube a Supabase Storage con la sesión de la administradora.
- El panel de administración se rediseñó en clave negra: resumen del inventario, tarjetas con miniatura y filtros por categoría, color y estado. Cerrar sesión es ahora un icono.

- La tienda, el carrito, los filtros, la paginación y el detalle de lentes ahora tienen enlaces compartibles y restauran su estado con el historial del navegador.
- Cuatro lentes nuevos del documento del catálogo, con su foto y su ficha: Kitty Pink, Bluersht Pink, Taylor Violet y Gem Pink ($45.000 cada uno).
- Trece referencias que tenían foto pero no ficha entraron por fin al catálogo con la versión nueva del documento: Aqua Blue, Melburth, 3 Con Hazel, Mel Beige, Queen Chocolate, Rio Ocre, Angeles Emarald, Awaken Green, Breeze Green, Cambusi Green, Rio Buzio, OMG Black y Pattaya Black. El catálogo pasó de 85 a 102 lentes.
- Siri Brown ya no se vende a ciegas: llegó su foto y dejó de mostrarse con el placeholder.
- Once productos nuevos de pestañas y accesorios, con foto y precio del documento del negocio: pestañas cartón ($10.000), pestañas libro ($30.000), removedor ($10.000), combo pegante + removedor ($20.000), combo pegante + removedor + pinzas ($23.000), pinzas para pestañas ($5.000), kit viajero completo ($12.000), lavadora ultrasónica ($30.000), pinzas abre ojos ($10.000), masajeador facial ($7.000) y jabón para manos ($10.000).
- Los accesorios que se vendían sin que nadie pudiera verlos ya tienen foto real: kit viajero con espejo y lavadora manual. Solo quedan dos con placeholder (solución de lentes y kit aplicador + pinza), que no vienen en el documento.
- Los accesorios pasaron a carrusel, como las pestañas: se deslizan con el dedo, con el teclado o con las flechas.

- En celular la navegación se agrupa en un menú hamburguesa, con el carrito siempre a la vista junto al botón del menú. El encabezado pasó de ocupar el 20% de la pantalla a menos del 10%, y el menú dejó de partirse en dos filas.
- El perfil es ahora una opción del menú con foto y nombre: al tocar "Ver perfil" se abre un modal con los datos de la cuenta y el botón de cerrar sesión.

- El carrito ya no se pierde al recargar ni al volver de WhatsApp: se guarda en el navegador y se recupera al abrir la página. Si una referencia salió del catálogo mientras tanto, no reaparece.
- La sesión de Google sobrevive a la recarga: ya no hay que volver a entrar cada vez.
- Al iniciar sesión, el dispositivo recuerda la dirección y el destino de envío de esa cuenta y los repone en la próxima compra. En un celular compartido, cada cuenta ve solo lo suyo.

- Se sumaron al catálogo los 19 lentes de cosplay (Sharingan, Nezuko, Tanjiro, blancos de terror, fantasía...) a $45.000, con su propio botón de filtro "COSPLAY" junto a los tonos.
- El catálogo de lentes pasó a tener las 85 referencias reales del documento del catálogo, cada una con su foto, descripción y ficha técnica (tono, cobertura, borde, efecto, marcas y diámetros disponibles).
- Se pueden filtrar los lentes por tono (café & miel, verde, gris y azul), y ese filtro se combina con el de pupila.
- Las fotos del catálogo pesan ahora una cuarta parte: se ajustaron al tamaño en que realmente se ven y se sirven en un formato más liviano (WebP), con la versión anterior como respaldo para navegadores antiguos. La portada abre con unos 320 KB de imágenes en vez de 858 KB.
- Con un modal abierto la página de atrás ya no se desplaza: queda congelada en el mismo punto y al cerrar vuelve exactamente a donde estaba.
- El catálogo se muestra de a 6 lentes por página, con controles para pasar de página.
- El detalle del lente se rediseñó según Figma: collage de fotos, categoría, nombre, precio, descripción, duración y tipo, con el botón de añadir y el selector de cantidad centrados abajo.
- El detalle de cada lente muestra ahora su ficha técnica completa y los otros nombres comerciales con los que se conoce la referencia.
- Tres lentes nuevos en el catálogo: Pataya Green, Estonia Blue y Estonia Green ($45.000 cada uno).
- Nueva sección "¿Por qué comprar en MARÃO?" con los tres argumentos de venta: envíos nacionales, calidad premium y pedidos por WhatsApp.
- Las tarjetas de pestañas ahora son un carrusel: se deslizan con el dedo, con el teclado o con las flechas del bloque.
- Se publicó la sección "Accesorios y cuidado para tus lentes" (solución, kit aplicador + pinza, estuche porta-lentes y lavadora manual), que estaba definida pero no se mostraba en la página. Cada accesorio muestra ahora su descripción.
- Al finalizar el pedido aparece el aviso "Enviar comprobante de pago por WhatsApp": recuerda capturar el comprobante del pago, ofrece continuar al pago seguro (ePayco solo se abre cuando se le pide) y muestra el número del vendedor con un botón para copiarlo. Con destino nacional, el aviso aclara además que el envío se acuerda por ahí.

### Removed

- Salieron del catálogo "Tabla de pestañas punto a punto" ($30.000) y "Bandeja pestañas + Bond & Seal" ($35.000): el documento nuevo del negocio las reemplaza por pestañas cartón y pestañas libro. La segunda, además, nunca llegó a mostrarse en la tienda.
- El checkout ya no pide número de tarjeta, vencimiento ni CVV. No había pasarela que procesara esos datos: el pedido siempre se coordinó por WhatsApp, así que pedirlos solo exponía a la clienta sin ninguna contrapartida. En su lugar, el resumen indica que el pago se acuerda por WhatsApp.
- Elegir "Tarjeta" o "Nequi" ya no obliga a escribir un número para poder enviar el pedido.
- El resumen de compras dejó de mostrar el selector de método de pago: la intención de pago ya no se pide antes de llegar al checkout, y con ella desaparecieron su etiqueta y su nota de ePayco.

### Changed

- El envío a toda Colombia ya no se suma al total: no tiene tarifa fija, así que el resumen muestra «A acordar por WhatsApp», ePayco cobra solo los productos y el aviso del comprobante aclara que el envío se acuerda por ese canal. Solo Bogotá y Soacha mantienen el envío de $10.000.
- El panel da feedback visual: avisos flotantes de éxito o error, indicador de carga mientras trae el catálogo y botones ocupados ("Guardando…", "Eliminando…") durante la acción. Los desplegables dejaron la flecha del sistema por una propia, más limpia.

- El precio pasa a mandar sobre el nombre en todas las tarjetas: más grande y más pesado, con el nombre en peso medio. Las tarjetas de pestañas además subieron un punto de tamaño de letra.
- En computador el catálogo de lentes ocupa el 45% de la fila y el de pestañas el 55%. Antes la rejilla decía mitad y mitad, pero el carrusel de pestañas no dejaba encoger su columna y se quedaba con tres cuartos de la fila, así que los lentes salían apretados.
- El pegante Bond & Seal pasó de $7.000 a $10.000, según el documento nuevo del negocio.
- El estuche porta-lentes se llama ahora "Kit viajero con espejo", para distinguirlo del kit viajero completo.
- Los modales de iniciar sesión y de perfil se rediseñaron: fondo claro en vez del beige, más aire entre bloques y una ficha de datos con líneas finas. El texto apagado pasó de leerse a duras penas sobre el beige a tener contraste holgado.
- En computador el carrito y el perfil quedaron juntos en la esquina derecha (carrito a la izquierda, perfil a la derecha) siguiendo el diseño, y más cerca del borde.
- El modal de perfil muestra ahora la dirección de envío guardada de esa cuenta.

- El modal de login decía "guardar tus datos de envío" sin que se guardara nada. Ahora lo hace de verdad, y el texto aclara que es en ese dispositivo.

- Los iconos del encabezado (carrito y perfil) pasaron de morado a negro.
- En celular el primer botón de la portada dice solo "CATÁLOGO"; en pantallas grandes sigue diciendo "CATÁLOGO LENTES".

- Los seis lentes de ejemplo (Citrina Brown, Choco Dark, Estonia Blue y Estonia Green, entre otros) salieron del catálogo: cuatro de ellos no tenían foto y el catálogo real del negocio los reemplaza.

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

- El producto «Pestañas cortón» se llama en realidad «Pestañas cartón».
- El detalle del lente ya no muestra la ficha técnica en productos que no son lentes: pestañas y accesorios no tienen tono, cobertura ni pupila, así que ese bloque (y el modal) quedan solo para lentes.

- En una misma fila, el precio y el botón de todas las tarjetas caen ahora a la misma altura. Un nombre que ocupaba dos renglones corría hacia abajo el resto de su tarjeta y la fila quedaba despareja.

- El logo del encabezado, el enlace "Volver al inicio" y el nombre de cada lente ya se pueden usar con el teclado: antes eran texto o imágenes que solo respondían al ratón.
- El selector de método de pago no tenía etiqueta asociada; ahora sí.
- Los botones de filtro comunican cuál está aplicado, y el catálogo anuncia cuántas referencias quedan y en qué página, para quien navega con lector de pantalla.
- En la vista del carrito, el botón de quitar producto, los selectores de envío y pago y el enlace de volver eran más pequeños que el mínimo para tocarlos con el dedo.

- Los modales (detalle del lente, iniciar sesión y perfil) ya se pueden cerrar con la tecla Escape o tocando fuera de la tarjeta; antes solo respondían al botón de cerrar.
- Con un modal abierto, el tabulador ya no se escapa al catálogo de detrás: se queda dentro y al cerrar el foco vuelve al elemento que lo abrió.
- Los modales se anuncian como diálogos con su título, de modo que un lector de pantalla informa de dónde está la persona al abrirlos.
- En celular, Escape también cierra el menú desplegable.

- Al iniciar sesión el logo del encabezado se corría del centro y quedaba pegado al borde derecho, en celular y en computador. El centrado dependía de un ancho fijo que no podía compensar un lado que crece al entrar a la cuenta.
- El botón de cerrar sesión medía 13x15 px, por debajo del mínimo para tocarlo con el dedo. Ahora vive dentro del modal de perfil con un tamaño cómodo.

- Los accesorios que todavía no tienen foto (solución, kit aplicador, estuche y lavadora) mostraban un hueco roto; ahora se ve la imagen de reemplazo de la marca.

- Los campos del checkout (ciudad, dirección, datos de pago) hacían que el iPhone ampliara la pantalla al tocarlos y la vista quedaba descuadrada: ahora usan un tamaño de letra que no dispara ese zoom.
- Botones e enlaces demasiado pequeños para tocarlos con el dedo (iconos del encabezado, menú, flechas del carrusel, cerrar del detalle y paginación) ahora tienen un área de toque acorde a la guía de accesibilidad.

- En celulares de pantalla baja, el detalle del lente se salía de la pantalla y el botón "Añadir al carrito" quedaba fuera de alcance, sin forma de desplazarse hasta él. Ahora el detalle nunca supera el alto de la pantalla: el título y el botón quedan fijos y solo se desplaza el contenido.

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
