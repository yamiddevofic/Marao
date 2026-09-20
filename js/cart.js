import { productosBase } from "./productos.js";
import { formatearPrecio } from "./formato.js";
import { CLAVE_CARRITO, leer, guardar } from "./almacenamiento.js";

let carrito = restaurarCarrito();

/**
 * Del almacenamiento solo vuelven `id` y `cantidad`; el resto se reconstruye
 * desde el catálogo vigente. Guardar el producto entero dejaría el precio y el
 * nombre congelados en el momento en que se añadió, y un carrito viejo podría
 * mandar por WhatsApp un pedido con un precio que ya no existe.
 *
 * Una referencia que desapareció del catálogo, o que perdió el precio, no
 * vuelve: es la misma regla que aplica `agregarAlCarrito`.
 */
function restaurarCarrito() {
  const guardado = leer(CLAVE_CARRITO, []);
  if (!Array.isArray(guardado)) return [];

  return guardado.flatMap((item) => {
    const prod = productosBase.find((p) => p.id === item?.id);
    if (!prod || typeof prod.precio !== "number") return [];

    const cantidad = Number(item?.cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) return [];

    return [{ ...prod, cantidad }];
  });
}

/* Solo la referencia y cuántas: ver `restaurarCarrito`. */
function persistirCarrito() {
  guardar(
    CLAVE_CARRITO,
    carrito.map(({ id, cantidad }) => ({ id, cantidad })),
  );
}

/* Todo cambio del carrito pasa por aquí, así que persistir en este punto cubre
   añadir, quitar y cambiar cantidades sin repartir escrituras por el módulo. */
function notificarActualizacion() {
  persistirCarrito();
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function getCarrito() {
  return carrito;
}

export function agregarAlCarrito(id, cantidad = 1) {
  const prod = productosBase.find((p) => p.id === id);
  if (!prod) {
    console.warn(`[cart] Producto con id ${id} no existe en el catálogo.`);
    return;
  }
  if (prod.estado === "agotado") {
    console.warn(`[cart] "${prod.nombre}" está agotado.`);
    return;
  }
  // Última barrera: la UI ya deshabilita el botón, pero un producto sin precio
  // confirmado no puede entrar al carrito ni acabar en el pedido de WhatsApp.
  if (typeof prod.precio !== "number") {
    console.warn(`[cart] "${prod.nombre}" todavía no tiene precio confirmado.`);
    return;
  }
  const existe = carrito.find((item) => item.id === id);
  if (existe) {
    existe.cantidad += cantidad;
  } else {
    carrito.push({ ...prod, cantidad });
  }
  notificarActualizacion();
}

export function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  notificarActualizacion();
  renderCarritoPagina();
}

export function cambiarCantidadCart(id, delta) {
  const item = carrito.find((i) => i.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }
  notificarActualizacion();
  renderCarritoPagina();
}

export function renderCarritoPagina() {
  const container = document.getElementById("cart-products-container");
  if (!container) return;

  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);
  const titulo = document.getElementById("cart-title-count");
  if (titulo) titulo.innerText = `TU CARRITO (${totalItems})`;

  if (carrito.length === 0) {
    container.innerHTML =
      '<p class="cart-empty-message">El carrito está vacío.</p>';
    return;
  }

  container.innerHTML = carrito
    .map(
      (item) => `
    <div class="cart-item-row">
      <img src="${item.img}" alt="${item.nombre}" loading="lazy">
      <div class="cart-item-details">
        <p><strong>Producto:</strong> ${item.nombre}</p>
        <p><strong>Detalle:</strong> Lente / Accesorio original MARÃO</p>
        <div class="qty-btn-group">
          <button data-action="change-qty" data-id="${item.id}" data-delta="-1">-</button>
          <span>${item.cantidad}</span>
          <button data-action="change-qty" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <div class="cart-item-price-actions">
        <button class="btn-remove-item" data-action="remove-item" data-id="${item.id}" title="Quitar del carrito">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <span class="cart-item-price">${formatearPrecio(item.precio * item.cantidad)}</span>
      </div>
    </div>
    <hr class="dashed-divider">
  `,
    )
    .join("");
}
