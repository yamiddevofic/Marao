import { productosBase } from "./productos.js";

let carrito = [];

function notificarActualizacion() {
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
      '<p style="padding: 1rem 0;">El carrito está vacío.</p>';
    notificarActualizacion();
    return;
  }

  container.innerHTML = carrito
    .map(
      (item) => `
    <div class="cart-item-row">
      <img src="${item.img}" alt="${item.nombre}">
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
        <span class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString()}</span>
      </div>
    </div>
    <hr class="dashed-divider">
  `,
    )
    .join("");

  notificarActualizacion();
}