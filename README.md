# MARÃO — Tienda Virtual

Tienda virtual de lentes de contacto cosméticos y pestañas pelo a pelo, desarrollada con HTML, CSS y JavaScript vanilla (sin framework).

## Módulos

- **Inicio / Tienda**: hero con catálogo dual (lentes de contacto + pestañas pelo a pelo).
- **Catálogo de lentes**: grid de productos con filtros por tipo de pupila (reducida / estándar).
- **Catálogo de pestañas**: tarjetas de pestañas punto a punto y pegante.
- **Carrito**: vista de carrito con cantidades, envío (Bogotá/Soacha contraentrega o nacional) y resumen de compra.
- **Checkout**: pedido enviado por WhatsApp al número de la tienda.
- **Login con Google**: acceso con cuenta de Google (SDK oficial) para prellenar datos del cliente.

## Stack técnico

| Capa      | Tecnología                          |
| --------- | ----------------------------------- |
| Frontend  | HTML5, CSS3, JavaScript (vanilla)   |
| Íconos    | Font Awesome 6.4                    |
| Fuentes   | Google Fonts (Montserrat, Playfair) |
| Login     | Google Identity Services (GSI)      |
| Backend   | Ninguno (sitio estático)            |
| Pagos     | Ninguno (pedido por WhatsApp)       |

## Estructura de archivos

```
Pag_Marao/
├── index.html          # Página principal (tienda, carrito, modales)
├── styles.css          # Estilos globales
├── js/
│   ├── main.js         # Punto de entrada: inicialización y delegación de eventos
│   ├── productos.js    # Datos del catálogo (productosBase)
│   ├── catalog.js      # Render de catálogo, filtros y modal de detalle
│   ├── cart.js         # Estado y operaciones del carrito
│   ├── checkout.js     # Costos de envío, validación de pago y pedido por WhatsApp
│   ├── auth.js         # Login con Google
│   └── ui.js           # Navegación entre vistas (tienda / carrito)
├── assets/img/         # Imágenes (productos, marca, hero)
└── CHANGELOG.md        # Historial de cambios
```

## Ejecución local

No requiere build ni dependencias. Abre `index.html` en el navegador o sirve la carpeta con un servidor estático:

```bash
# Opción 1: abrir directamente
start index.html

# Opción 2: servidor estático con Python
python -m http.server 8080
# luego visita http://localhost:8080
```

> **Nota**: el JS está organizado en módulos ES (`type="module"`), por lo que el sitio debe servirse por HTTP (opción 2). Abrir `index.html` directamente con doble clic no ejecutará los módulos.

## Configuración

### Login con Google

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com).
2. Habilita **Google Identity Services** y genera un Client ID (Web).
3. Reemplaza `TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com` en `index.html` (atributo `data-client_id` del bloque `g_id_onload`).
4. Agrega el origen de tu dominio en *Authorized JavaScript origins*.

> El Client ID es información pública del cliente y puede ir en el HTML, pero no debe comprometer secretos (no uses OAuth con secretos aquí sin backend).

### Pedidos por WhatsApp

El checkout construye un mensaje con el detalle del pedido (productos, cantidades, envío, dirección y total) y lo abre en `wa.me`. El número destino se define en `enviarPedidoWhatsApp()` dentro de `js/checkout.js`.

## Reglas de negocio actuales (definidas por el negocio)

- **Lentes cosméticos**: $45.000 (filtrables por pupila reducida / estándar).
- **Pestañas punto a punto** (tabla): $30.000.
- **Pegante Bond & Seal**: $7.000.
- **Kit pestañas + pegante**: $35.000.
- **Envío Bogotá / Soacha**: $10.000 (contraentrega disponible).
- **Envío resto de Colombia**: $22.000.
- **Métodos de pago aceptados**: tarjeta crédito/débito, Nequi, efectivo contraentrega.

## Estado del proyecto y deuda técnica conocida

En desarrollo activo. Puntos pendientes identificados:

- **Pagos**: el número de tarjeta se captura en el cliente y viaja en el mensaje de WhatsApp. Esto no cumple estándares PCI. Migrar a checkout hospedado o widget oficial (Wompi, Epayco, PayU).
- **Catálogo**: productos hardcodeados en `productosBase` (`js/productos.js`). Migrar a un JSON externo o API cuando crezca.
- **Carrito**: vive solo en memoria; se pierde al recargar la página. Persistir en `localStorage`.
- **Inventario/stock**: sin control de disponibilidad.
- **Imágenes**: algunas referencias de producto aún no existen en el repo (lentes Citrina Brown, Choco Dark, accesorios).
- **Responsive**: ya hay layout mobile-first con `min-width` (media query a partir de 769px); falta verificar el pulido en dispositivos reales, especialmente catálogo y carrito.

## Contacto

- WhatsApp: 3243744983
- Instagram: @maraoficiall