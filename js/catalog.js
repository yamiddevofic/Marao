import { productosBase, PRECIO_LENTES } from "./productos.js";
import { agregarAlCarrito } from "./cart.js";

let productoSeleccionadoModal = null;
let cantidadModal = 1;

export function renderLentes(items) {
  const container = document.getElementById("grid-lentes-cafe");
  if (!container) return;
  container.innerHTML = items
    .map(
      (prod) => `
    <div class="product-card-figma">
      <img src="${prod.img}" alt="${prod.nombre}" data-action="open-detail" data-id="${prod.id}">
      <div class="card-info">
        <h4 data-action="open-detail" data-id="${prod.id}" style="cursor:pointer;">${prod.nombre}</h4>
        <p class="price">$${prod.precio.toLocaleString()}</p>
      </div>
      <button class="btn-add-figma" data-action="add-to-cart" data-id="${prod.id}">AÑADIR AL CARRITO</button>
    </div>
  `,
    )
    .join("");
}

export function renderAccesorios(items) {
  const container = document.getElementById("grid-accesorios");
  if (!container) return;
  container.innerHTML = items
    .map(
      (acc) => `
    <div class="product-card-figma">
      <img src="${acc.img}" alt="${acc.nombre}">
      <div class="card-info">
        <h4>${acc.nombre}</h4>
        <p class="price">$${acc.precio.toLocaleString()}</p>
      </div>
      <button class="btn-add-figma" data-action="add-to-cart" data-id="${acc.id}">AÑADIR AL CARRITO</button>
    </div>
  `,
    )
    .join("");
}

export function filtrarLentes(tipo) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  const btnActivo = document.querySelector(`.filter-btn[data-filter="${tipo}"]`);
  if (btnActivo) btnActivo.classList.add("active");

  const lentes = productosBase.filter((p) => p.precio === PRECIO_LENTES);
  renderLentes(tipo === "todos" ? lentes : lentes.filter((l) => l.tipo === tipo));
}

export function abrirModalDetalle(id) {
  const prod = productosBase.find((p) => p.id === id);
  if (!prod) return;
  productoSeleccionadoModal = prod;
  cantidadModal = 1;
  actualizarCantidadModal();

  document.getElementById("modal-img").src = prod.img;
  document.getElementById("modal-title").innerText = prod.nombre;
  document.getElementById("modal-price").innerText =
    `$${prod.precio.toLocaleString()}`;
  document.getElementById("modal-desc").innerText = prod.desc;

  document.getElementById("modal-product-detail").style.display = "flex";
}

export function cerrarModalDetalle() {
  document.getElementById("modal-product-detail").style.display = "none";
}

export function modificarCantidadModal(delta) {
  cantidadModal = Math.max(1, cantidadModal + delta);
  actualizarCantidadModal();
}

function actualizarCantidadModal() {
  const el = document.getElementById("modal-qty");
  if (el) el.textContent = String(cantidadModal);
}

export function agregarDesdeModal() {
  if (!productoSeleccionadoModal) return;
  agregarAlCarrito(productoSeleccionadoModal.id, cantidadModal);
}