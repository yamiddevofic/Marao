# MARÃO — Tienda Virtual

Tienda virtual de lentes de contacto cosméticos y pestañas pelo a pelo, desarrollada con HTML, CSS y JavaScript vanilla (sin framework ni proceso de build).

## Módulos

- **Inicio / Tienda** (`#view-store`): hero de portada + catálogo dual (lentes de contacto y pestañas pelo a pelo).
- **Catálogo de lentes** (`#lentes`): grid renderizado desde JS con filtros por tipo de pupila (reducida / estándar / todos).
- **Catálogo de pestañas** (`#pestanas`): carrusel horizontal con tarjetas estáticas en el HTML (tabla punto a punto y pegante Bond & Seal) que agregan al carrito por `data-id`. En escritorio ocupa la mitad derecha de la página, llega al borde y la imagen del hero se monta sobre su parte superior.
- **Accesorios** (`#accesorios`): grid renderizado desde JS con los productos de tipo `accesorio`, con nombre, precio y descripción.
- **¿Por qué comprar en MARÃO?** (`#por-que-marao`): tres argumentos de venta estáticos (envíos, calidad, WhatsApp).
- **Modal de detalle**: ficha del lente con imagen, precio, descripción y selector de cantidad.
- **Carrito** (`#view-cart`): vista alterna (no es otra página) con cantidades, selector de envío y resumen de compra.
- **Checkout**: selección de método de pago y envío del pedido por WhatsApp.
- **Login con Google**: acceso con cuenta de Google (SDK GSI) para prellenar los datos del cliente.
- **Contacto** (`#contacto`): datos de la marca en el footer.

La navegación entre tienda y carrito no recarga la página: `mostrarSeccion()` (`js/ui.js`) alterna la clase `hidden` entre `#view-store` y `#view-cart`.

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
├── css/styles.css      # Estilos globales + design tokens (variables CSS)
├── js/
│   ├── main.js         # Punto de entrada: render inicial y delegación de eventos
│   ├── productos.js    # Datos del catálogo (productosBase) y constantes de precio
│   ├── catalog.js      # Render de catálogo, filtros y modal de detalle
│   ├── cart.js         # Estado y operaciones del carrito
│   ├── checkout.js     # Costos de envío, medios de pago y pedido por WhatsApp
│   ├── auth.js         # Login con Google (inicializa GSI y decodifica el JWT)
│   ├── carrusel.js     # Desplazamiento del carrusel de pestañas
│   ├── formato.js      # Formato de precios en pesos colombianos
│   └── ui.js           # Navegación entre vistas (tienda / carrito)
├── assets/img/         # Imágenes (productos, marca, hero)
├── docs/               # Documentación adicional (vacío por ahora)
├── AGENTS.md           # Convenciones de código y guía para agentes/colaboradores
└── CHANGELOG.md        # Historial de cambios (Keep a Changelog + SemVer)
```

### Arquitectura JS

- **Sin estado global en `window`**: cada módulo exporta lo que necesita. La única excepción es `window.handleCredentialResponse`, requerida por el SDK de Google.
- **Delegación de eventos**: `main.js` escucha `click`, `change` e `input` a nivel de `document` y despacha según el atributo `data-action` del elemento (`add-to-cart`, `open-detail`, `checkout`, `filtrar-lentes`, etc.). No hay `onclick` en el markup.
- **Comunicación del carrito**: `cart.js` emite el evento `cart:updated` en `window`; `main.js` lo escucha para refrescar el badge del header y recalcular los costos de envío.
- **Categorías de producto**: cada producto lleva un `tipo` (`reducida` / `estandar` para lentes, `pestana`, `accesorio`). Los helpers `getLentes()` y `getAccesorios()` de `productos.js` son la única fuente de esa partición — no filtres por precio ni por rango de `id`.
- **Precios**: siempre con `formatearPrecio()` (`js/formato.js`), que fuerza el formato `es-CO`. Nunca `toLocaleString()` sin locale.
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

### Pedidos por WhatsApp

El checkout construye un mensaje con el detalle del pedido (productos, cantidades, envío, dirección y total) y lo abre en `wa.me`. El número destino está en `enviarPedidoWhatsApp()` (`js/checkout.js`), actualmente `573243744983`.

## Reglas de negocio actuales (definidas por el negocio)

Catálogo (`js/productos.js`):

| Producto                              | Precio  | Estado                     |
| ------------------------------------- | ------- | -------------------------- |
| Lentes cosméticos (Ángeles Ámbar, Citrina Brown, Choco Dark, Pataya Green, Estonia Blue, Estonia Green) | $45.000 | Publicado (con filtros por pupila) |
| Tabla de pestañas punto a punto       | $30.000 | Publicado                  |
| Bandeja pestañas + Bond & Seal (kit)  | $35.000 | Publicado                  |
| Pegante Bond & Seal                   | $7.000  | Publicado                  |
| Solución de lentes                    | $17.000 | Publicado (sin imagen)     |
| Kit aplicador + pinza                 | $5.000  | Publicado (sin imagen)     |
| Estuche porta-lentes                  | $10.000 | Publicado (sin imagen)     |
| Lavadora manual para lentes           | $10.000 | Publicado (sin imagen)     |

Envíos y pagos (`js/checkout.js`):

- **Envío Bogotá / Soacha**: $10.000 (contraentrega disponible).
- **Envío resto de Colombia**: $22.000.
- **Métodos de pago aceptados**: tarjeta crédito/débito, Nequi, efectivo contraentrega.

## Estado del proyecto y deuda técnica conocida

En desarrollo activo. Puntos pendientes identificados:

- **Pagos (crítico)**: el formulario pide número de tarjeta, vencimiento y CVV, pero **no hay pasarela**: el mensaje de WhatsApp solo lleva los últimos 4 dígitos y el CVV no se usa en ninguna parte. Es decir, se piden datos sensibles al cliente sin procesarlos, lo que da una falsa sensación de pago en línea y mete al sitio en alcance PCI sin necesidad. Decisión pendiente del negocio: quitar esos campos, o integrar un checkout hospedado / widget oficial (Wompi, Epayco, PayU).
- **Imágenes faltantes**: `assets/img/` solo tiene `ANGELES-AMBER.jpg`, `pestanas-1.jpg` y `pegante-1.jpg` como imágenes de producto. Faltan `lentes-citrina-brown.jpg`, `lentes-choco-dark.jpg`, `lentes-pataya-green.jpg`, `lentes-estonia-blue.jpg`, `lentes-estonia-green.jpg`, `estuche.jpg`, `solucion.jpg`, `pinzas.jpg` y `lavadora.jpg`. Mientras tanto se muestra `placeholder-producto.svg` en su lugar.
- **Carrito sin persistencia**: vive solo en memoria; se pierde al recargar. Persistir en `localStorage`.
- **Catálogo hardcodeado**: `productosBase` en `js/productos.js`. Migrar a JSON externo o API cuando crezca.
- **Inventario/stock**: sin control de disponibilidad.
- **Buscador de productos**: previsto en `AGENTS.md`, aún no implementado.
- **Login con Google**: el JWT se decodifica en el cliente sin verificar la firma; sirve para prellenar datos, no como autenticación real. Requiere backend para validarlo.
- **Precios de pestañas hardcodeados en el HTML**: las dos tarjetas de `#pestanas` repiten nombre y precio en el markup, así que un cambio en `productos.js` no se refleja ahí. Renderizarlas desde los datos como el resto del catálogo.
- **Testing**: no hay pruebas automatizadas; la verificación es manual en el navegador.
- **Responsive**: layout mobile-first funcionando con un solo breakpoint (769px); falta pulir en dispositivos reales, especialmente catálogo y carrito.

## Contacto

- WhatsApp: 3243744983
- Instagram: @maraoficiall
