# MARÃO — Tienda Virtual

Tienda virtual de lentes de contacto cosméticos y pestañas pelo a pelo, desarrollada con HTML, CSS y JavaScript vanilla (sin framework ni proceso de build).

## Módulos

- **Inicio / Tienda** (`#view-store`): hero de portada + catálogo dual (lentes de contacto y pestañas pelo a pelo).
- **Catálogo de lentes** (`#lentes`): grid renderizado desde JS con filtros combinables por tono (café & miel / verde / gris / azul) y por pupila (reducida / estándar), paginado de 6 referencias.
- **Catálogo de pestañas** (`#pestanas`): carrusel horizontal renderizado desde JS (`renderPestanas()`) con los productos de tipo `pestana`. En escritorio ocupa el 55% derecho de la página, llega al borde y la imagen del hero se monta sobre su parte superior.
- **Accesorios** (`#accesorios`): mismo carrusel, renderizado desde JS (`renderAccesorios()`) con los productos de tipo `accesorio`, con nombre, precio y descripción.
- **¿Por qué comprar en MARÃO?** (`#por-que-marao`): tres argumentos de venta estáticos (envíos, calidad, WhatsApp).
- **Modal de detalle**: ficha del lente con imagen, precio, descripción, ficha técnica (tono, pupila, cobertura, borde, efecto, marcas y diámetros) y selector de cantidad.
- **Carrito** (`#view-cart`): vista alterna (no es otra página) con cantidades, selector de envío y resumen de compra.
- **Checkout**: destino de envío y envío del pedido por WhatsApp. No se piden datos de tarjeta: el cobro se coordina por ese mismo canal.
- **Encabezado**: en móvil, menú hamburguesa con las secciones y el acceso al perfil; el carrito permanece visible en la barra. En escritorio el menú es una barra fija y el perfil vuelve al encabezado.
- **Modal de perfil**: foto, nombre y correo de la cuenta, con el botón de cerrar sesión.
- **Login con Google**: acceso con cuenta de Google (SDK GSI). Prellena los datos del cliente en el pedido y separa los datos de envío guardados de cada cuenta en el mismo dispositivo.
- **Contacto** (`#contacto`): datos de la marca en el footer.
- **Panel de administración** (`admin.html`): acceso con la cuenta administradora, resumen del inventario, filtros por categoría/color/estado y CRUD completo (crear, editar ficha y foto, eliminar uno o vaciar el catálogo). La foto se sube a Supabase Storage. El catálogo del cliente carga desde Supabase (`js/catalogo-remoto.js`).
- **Pago ePayco**: Web Checkout hospedado de ePayco para tarjeta y Nequi, con aviso del resultado al volver a la tienda.

La navegación entre tienda y carrito no recarga la página: `mostrarSeccion()` (`js/ui.js`) alterna la clase `hidden` entre `#view-store` y `#view-cart` y conserva la vista en la URL (`?vista=carrito`). Los filtros, la página y el detalle del lente también se pueden compartir mediante los parámetros `color`, `pupila`, `pagina` y `detalle`; Atrás y Adelante restauran ese estado.

## Stack técnico

| Capa     | Tecnología                        |
| -------- | --------------------------------- |
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Módulos  | ES Modules (`type="module"`)      |
| Íconos   | Font Awesome 6.4 (CDN)            |
| Fuentes  | Google Fonts (Montserrat, Bitter, Blinker) |
| Login    | Google Identity Services (GSI)    |
| Backend  | Ninguno (sitio estático)          |
| Pagos    | Ninguno (pedido por WhatsApp)     |

## Estructura de archivos

```
Pag_Marao/
├── index.html          # Página principal (tienda, carrito, modales, footer)
├── admin.html          # Panel de administración (login, inventario, CRUD)
├── css/
│   ├── styles.css      # Estilos globales + design tokens (variables CSS)
│   └── admin.css       # Estilos del panel de administración
├── js/
│   ├── main.js         # Punto de entrada: render inicial y delegación de eventos
│   ├── constantes.js   # Constantes compartidas (IMG_PATH, PRECIO_LENTES)
│   ├── lentes.js       # Catálogo cosmético: 102 referencias con ficha técnica
│   ├── cosplay.js      # Línea cosplay: 19 referencias
│   ├── productos.js    # Une lentes + pestañas + accesorios en productosBase
│   ├── catalogo-remoto.js # Carga el catálogo desde Supabase
│   ├── catalog.js      # Render de catálogo, filtros y modal de detalle
│   ├── buscador.js     # Buscador del header (lupa, resultados en vivo)
│   ├── admin.js        # Panel: sesión, inventario, editor de fichas y CRUD
│   ├── cart.js         # Estado y operaciones del carrito
│   ├── checkout.js     # Costos de envío, medios de pago y checkout
│   ├── epayco.js       # Web Checkout hospedado de ePayco
│   ├── pago-respuesta.js # Resultado del pago al volver de ePayco
│   ├── auth.js         # Login con Google (inicializa GSI y decodifica el JWT)
│   ├── carrusel.js     # Desplazamiento de los carruseles (pestañas y accesorios)
│   ├── scroll-lock.js  # Congela el scroll de la página con un modal abierto
│   ├── almacenamiento.js # Persistencia en localStorage (carrito, sesión, envío)
│   ├── formato.js      # Formato de precios en pesos colombianos
│   └── ui.js           # Navegación entre vistas (tienda / carrito)
├── supabase/
│   └── admin-rls.sql   # Políticas RLS de productos y del Storage de fotos
├── worker/
│   ├── index.js        # (Sin activar) Endpoint de creación de sesión de pago
│   └── payment.js      # Precio autoritativo y comunicación con ePayco
├── tests/
│   └── payment.test.js # Pruebas del cálculo y creación de sesión
├── assets/img/         # Imágenes (productos, marca, hero)
│   └── lentes/         # Fotos por tono (miel, verde, gris, azul) + cosplay/
├── docs/               # Documentación adicional (vacío por ahora)
├── AGENTS.md           # Convenciones de código y guía para agentes/colaboradores
└── CHANGELOG.md        # Historial de cambios (Keep a Changelog + SemVer)
```

### Arquitectura JS

- **Sin estado global en `window`**: cada módulo exporta lo que necesita. La única excepción es `window.handleCredentialResponse`, requerida por el SDK de Google.
- **Delegación de eventos**: `main.js` escucha `click`, `change` e `input` a nivel de `document` y despacha según el atributo `data-action` del elemento (`add-to-cart`, `open-detail`, `checkout`, `filtrar-lentes`, etc.). No hay `onclick` en el markup.
- **Comunicación del carrito**: `cart.js` emite el evento `cart:updated` en `window`; `main.js` lo escucha para refrescar el badge del header y recalcular los costos de envío.
- **Categorías de producto**: cada producto lleva un `tipo` (`reducida` / `estandar` para lentes, `pestana`, `accesorio`). Los helpers `getLentes()`, `getAccesorios()` y `getPestanas()` de `productos.js` son la única fuente de esa partición — no filtres por precio ni por rango de `id`.
- **Subcategorías**: tabla `categorias` de Supabase (`id`, `nombre`, `seccion`, `orden`) y columna `productos.categoria_id` (SQL en `supabase/categorias.sql`). No hay ninguna en el código: las crea la administradora en el panel. En Lentes son pupila reducida, pupila estándar y cosplay Halloween; la tienda ya no filtra lentes por `tipo` (los tres valores de lente se conservan por compatibilidad: al editar se mantiene el que tenía y un lente nuevo entra como `estandar`). `establecerProductos(productos, categorias)` las resuelve a `categoriaId` y `subcategoria`, y `getCategoriasConProductos(seccion)` devuelve solo las que tienen productos. El campo `categoria` de los lentes cosplay locales es otra cosa (agrupación temática) y no se mezcla.
- **Productos sin precio**: hoy no hay ninguno, pero la salvaguarda sigue activa — un producto con `precio: null` se publica mostrando "Precio por confirmar", con el botón deshabilitado, y `agregarAlCarrito()` lo rechaza. Dejar entrar algo sin precio mandaría un pedido a $0 por WhatsApp.
- **Datos de lentes**: `js/lentes.js` es un archivo generado a partir del documento del catálogo y del set de fotos; cada referencia añade `color`, `cobertura`, `borde`, `efecto`, `promocion`, `alias` y `presentaciones` (marca + diámetro + pupila). `constantes.js` existe para que `lentes.js` y `productos.js` compartan `IMG_PATH` y `PRECIO_LENTES` sin ciclo de imports.
- **Persistencia**: `js/almacenamiento.js` envuelve `localStorage` con `try/catch` en cada acceso, porque en modo privado o con el almacenamiento bloqueado el solo hecho de tocarlo lanza; si falla, el sitio sigue funcionando sin memoria. Guarda tres cosas bajo el prefijo `marao:`:
  - **Carrito** (`marao:carrito`): solo `id` y `cantidad`. Al restaurar se revalida contra `productosBase`, así que una referencia retirada o sin precio no vuelve y un carrito viejo nunca manda un precio desactualizado por WhatsApp.
  - **Sesión** (`marao:sesion`): el perfil de Google, para que recargar no cierre la sesión. No es autenticación (ver deuda técnica).
  - **Datos de envío** (`marao:envio:<email>`, o `marao:envio:anonimo` sin sesión): dirección y destino. Se reasignan **siempre** al cambiar de cuenta, incluso cuando no hay datos guardados: reponer solo cuando hay valor dejaría en pantalla el destino de quien usó el navegador antes, y con él una tarifa de envío que esa persona no eligió. Nunca se guarda nada del método de pago.
- **Evento `sesion:cambiada`**: entrar o salir de una cuenta se notifica con este `CustomEvent` en `window`, igual que `cart:updated`. Quien dependa de la sesión se suscribe en vez de que `auth.js` lo llame directamente.
- **Accesibilidad de controles**: todo lo que acciona algo es un `<button>` con su área táctil de 44px; el estado de los filtros va en `aria-pressed` y el resultado del catálogo se anuncia en una región `role="status"` oculta a la vista (`.solo-lector`).
- **Modales**: `js/modales.js` centraliza apertura, cierre, pila de modales abiertos, foco y trampa de tabulador. Escape cierra el de encima; el clic en el fondo cierra ese mismo. El bloqueo de scroll se pide desde ahí y no desde cada modal, que es lo que antes se repetía en tres sitios.
- **Modales y scroll**: al abrir un modal se llama a `bloquearScroll()` (`js/scroll-lock.js`) y al cerrarlo a `desbloquearScroll()`. Usa `position: fixed` sobre el `body` porque `overflow: hidden` no frena el scroll en iOS, y lleva un contador interno para soportar un modal sobre otro. Si añades un modal nuevo, engánchalo a ese par de funciones.
- **Render del catálogo**: `actualizarCatalogoLentes()` (`js/catalog.js`) es el único punto que pinta el grid; filtros, paginación y carga inicial pasan por ahí en vez de llamar a `renderLentes()` directamente.
- **URL del catálogo**: `js/ui.js` mantiene la vista en el historial del navegador y `js/catalog.js` serializa filtros, página y detalle en query params. Añadir un producto no saca a la clienta del catálogo; el carrito se abre desde su control dedicado.
- **Precios**: siempre con `formatearPrecio()` (`js/formato.js`), que fuerza el formato `es-CO`. Nunca `toLocaleString()` sin locale.
- **Formatos de imagen**: cada foto existe en `.webp` (lo que sirve el navegador) y `.jpeg` junto a ella como respaldo. El dataset guarda solo el `.jpeg` y `marcaFoto()` (`js/catalog.js`) arma el `<picture>` derivando el WebP; una regla global `picture { display: contents }` evita que ese envoltorio altere el layout. Las fotos se guardan a 600px de lado máximo, que es lo que se ve incluso en pantallas retina.
- **Imágenes de producto**: un listener global de `error` en `main.js` (fase de captura, porque `error` no burbujea) reemplaza cualquier imagen rota por `assets/img/placeholder-producto.svg`.
- **Design tokens**: los colores, tipografías y espaciados viven en variables CSS bajo `:root` (`--color-*`, `--font-body`, `--font-display`, `--font-ui`, `--spacing-*`, `--radius-*`, `--gutter`, `--hero-overlap`). Usarlas en vez de valores sueltos.
- **Tipografías**: Bitter (`--font-display`) en el hero, Blinker (`--font-ui`) en catálogos, carrusel y secciones de accesorios / "por qué comprar", Montserrat (`--font-body`) en el resto.
- **Fondo de estrellas**: la clase `.starry-section` aplica el mosaico `assets/img/estrellas.svg`; reutilízala en secciones nuevas que necesiten ese fondo.
- **Responsive**: mobile-first, con un único breakpoint `@media (min-width: 769px)`. En escritorio `.dual-catalog` es un grid de dos mitades iguales; el solape de la imagen del hero se controla con la variable `--hero-overlap`.
- **Carrusel de pestañas**: es scroll horizontal nativo (swipe y teclado); las flechas solo empujan ese scroll. No usa `scroll-snap`: como la última tarjeta asoma parcialmente, su punto de anclaje cae fuera del scroll máximo y el navegador devolvía la vista al inicio.

## Ejecución local

No requiere build ni dependencias:

```bash
python -m http.server 8080
```

Luego visita <http://localhost:8080>.

> **Importante**: el JS usa módulos ES (`type="module"`), así que el sitio **debe** servirse por HTTP. Abrir `index.html` con doble clic (`file://`) no ejecutará los módulos. Alternativas: `npx serve .` o la extensión *Live Server* de VS Code.

## Configuración

### Login con Google

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com).
2. Habilita **Google Identity Services** y genera un Client ID (Web).
3. Reemplaza `TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com` en `index.html` (atributo `data-client-id` del div `#google-login-config`). Mientras siga el valor de ejemplo, el login queda deshabilitado y `auth.js` lo avisa por consola.
4. Agrega el origen de tu dominio en *Authorized JavaScript origins*.

> El Client ID es información pública del cliente y puede ir en el HTML, pero no debe comprometer secretos (no uses OAuth con secretos aquí sin backend).

### ePayco

Las opciones **Tarjeta de Crédito / Débito** y **Nequi** abren el Web Checkout hospedado de ePayco (`checkout.js` clásico) con el método seleccionado. **Contraentrega** continúa por WhatsApp. MARAO no captura ni almacena números de tarjeta, vencimientos ni CVV. El frontend requiere estos atributos en el script de `js/main.js`:

- `data-epayco-public-key`: llave pública de producción.
- `data-epayco-test`: `true` para sandbox y `false` para producción (hoy `false`: cobros reales).

La llave pública es visible en el HTML por diseño; no pongas allí la llave privada.

**Worker pendiente** (`worker/`, sin activar): crea sesiones de Smart Checkout con el monto calculado en el servidor desde los precios de Supabase. Se publicó el 2026-10-09 sin las llaves en Cloudflare y los pagos dejaron de abrir, así que se retiró. Para activarlo: cargar `EPAYCO_PUBLIC_KEY` y `EPAYCO_PRIVATE_KEY` con `npx wrangler secret put`, confirmar con `npx wrangler secret list`, y recién entonces volver a apuntar `wrangler.jsonc` (`main`, `binding`, `run_worker_first`), `js/epayco.js` y el script de `index.html` al flujo del Worker. Para desarrollo local, `.dev.vars` (ignorado por Git) con las mismas variables y `npx wrangler dev`.

Al volver de ePayco (`/?pago=respuesta&ref_payco=…`), `js/pago-respuesta.js` consulta el estado de la transacción y le muestra a la clienta si el pago fue aprobado, quedó pendiente o no se completó (con el motivo, p. ej. «Saldo insuficiente»). Es solo informativo: el pedido se sigue verificando en el panel de ePayco antes de despachar.

Las pruebas automatizadas no llaman a ePayco ni generan cobros: `npm test`.

### Pedidos por WhatsApp

El checkout construye un mensaje con el detalle del pedido (productos, cantidades, envío, dirección y total) y lo abre en `wa.me`. El número destino está en `enviarPedidoWhatsApp()` (`js/checkout.js`), actualmente `573243744983`.

## Reglas de negocio actuales (definidas por el negocio)

Catálogo (`js/lentes.js` y `js/productos.js`):

| Producto                              | Precio  | Estado                     |
| ------------------------------------- | ------- | -------------------------- |
| Lentes cosméticos (102 referencias en `js/lentes.js`) | $45.000 | Publicado (filtros por tono y pupila, paginado de 6) |
| Lentes cosplay (19 referencias en `js/cosplay.js`) | $45.000 | Publicado (filtro "Cosplay"; sin clasificación por pupila) |
| Pestañas cartón                       | $10.000 | Publicado                  |
| Pestañas libro                        | $30.000 | Publicado                  |
| Pegante Bond & Seal                   | $10.000 | Publicado                  |
| Removedor de pestañas                 | $10.000 | Publicado                  |
| Combo pegante + removedor             | $20.000 | Publicado                  |
| Combo pegante + removedor + pinzas    | $23.000 | Publicado                  |
| Pinzas para pestañas                  | $5.000  | Publicado                  |
| Solución de lentes                    | $17.000 | Publicado (sin imagen)     |
| Kit aplicador + pinza                 | $5.000  | Publicado (sin imagen)     |
| Kit viajero con espejo                | $10.000 | Publicado                  |
| Kit viajero completo                  | $12.000 | Publicado                  |
| Lavadora manual para lentes           | $10.000 | Publicado                  |
| Lavadora ultrasónica                  | $30.000 | Publicado                  |
| Pinzas abre ojos                      | $10.000 | Publicado                  |
| Masajeador facial                     | $7.000  | Publicado                  |
| Jabón para manos                      | $10.000 | Publicado                  |

Los precios de pestañas y accesorios vienen del documento "PRODUCTOS WORD3", donde cada uno va escrito sobre la foto del producto.

Envíos y pagos (`js/checkout.js`):

- **Envío Bogotá / Soacha**: $10.000 (contraentrega disponible).
- **Envío resto de Colombia**: sin tarifa fija; se acuerda por WhatsApp según el destino y no se suma al total.
- **Métodos de pago aceptados**: tarjeta crédito/débito mediante ePayco, Nequi y efectivo contraentrega por WhatsApp.

## Estado del proyecto y deuda técnica conocida

En desarrollo activo. Puntos pendientes identificados:

- **Confirmación automática de pedidos**: todavía no hay persistencia de órdenes ni webhook de ePayco. Antes de automatizar el despacho se debe implementar y probar la confirmación server-to-server.
- **7 referencias sin foto — pendiente del proveedor**: tienen ficha completa en el documento del catálogo (marca, diámetro, pupila, borde y, salvo dos, descripción) pero su foto no venía en el set. Se publican con `placeholder-producto.svg` hasta que lleguen las imágenes:

  | Referencia | Tono | Ficha |
  | ---------- | ---- | ----- |
  | Brazil Girl Amber | Miel | Eyeshare DM 14.0, pupila estándar, sin borde |
  | Brazil Girl Grafito | Gris | Eyeshare DM 14.0, pupila estándar, sin borde |
  | Nigth Storn | Azul | Freshlady DM 14.5, pupila realista, con borde |
  | Violet Mirage | Azul | Freshlady DM 14.2, efecto medialuna, con borde |
  | Peacock Blue | Azul | Eyeshare DM 14.5, pupila realista, con borde |
  | Vaadhoo | Azul | Freshlady DM 14.2, pupila realista, sin borde — **sin descripción** |
  | Zafiro / Ocean Blue | Azul | Freshlady DM 14.2, media cobertura, con borde — **sin descripción** |

  Se comprobó por similitud de nombre contra las 101 fotos del set, sin filtrar por tono: ninguna corresponde a estas siete. Las coincidencias altas son falsas (`zafiro/ocean blue` ↔ `ocean-brown` es de tono miel). Al recibirlas, basta con dejarlas en `assets/img/lentes/<tono>/` (600px de lado, `.jpeg` + `.webp`) y poner la ruta en `img`/`imagenes` de la referencia en `js/lentes.js`.

- **4 fotos sin ficha — pendiente del proveedor** (`lentesSinFicha` en `js/lentes.js`): el caso inverso. Hay foto pero el documento no las describe, así que falta su tipo de pupila y su cobertura, que no se pueden deducir de la imagen. No se publican para no inventar datos de producto. Empezaron siendo 18: la versión "CATALOGO PAGINA #2 (Autoguardado)" trajo la ficha de 13 y `RIO BUSIO` resultó ser la misma referencia que `RIO BUZIO`. Quedan `ANGELES N ESMERALD`, `CAT BELL`, `OCEAN BROWN` y `RUSIAN BROWN`.
- **2 accesorios sin foto**: solución de lentes y kit aplicador + pinza no aparecen en "PRODUCTOS WORD3"; se muestran con el placeholder (`img: null`).
- **Catálogo hardcodeado**: `js/lentes.js` (102 referencias) y `js/productos.js` son archivos estáticos. Con este volumen ya conviene migrar a JSON externo o API, y cargarlo bajo demanda.
- **Inventario/stock**: sin control de disponibilidad.
- **Buscador de productos**: previsto en `AGENTS.md`, aún no implementado.
- **Login con Google**: el JWT se decodifica en el cliente sin verificar la firma; sirve para prellenar datos, no como autenticación real. Requiere backend para validarlo.
- **Testing**: no hay pruebas automatizadas; la verificación es manual en el navegador.
- **Responsive**: layout mobile-first funcionando con un solo breakpoint (769px); falta pulir en dispositivos reales, especialmente catálogo y carrito.

## Contacto

- WhatsApp: 3243744983
- Instagram: @maraoficiall
