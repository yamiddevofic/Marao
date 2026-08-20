import { renderCarritoPagina } from "./cart.js";

export function mostrarSeccion(seccion) {
  const tienda = document.getElementById("view-store");
  const carrito = document.getElementById("view-cart");
  if (!tienda || !carrito) return;

  const esCarrito = seccion === "carrito";
  tienda.style.display = esCarrito ? "none" : "block";
  carrito.style.display = esCarrito ? "block" : "none";

  if (esCarrito) {
    renderCarritoPagina();
    window.scrollTo(0, 0);
  }
}