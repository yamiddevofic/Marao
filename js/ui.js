import { renderCarritoPagina } from "./cart.js";

export function mostrarSeccion(seccion) {
  const tienda = document.getElementById("view-store");
  const carrito = document.getElementById("view-cart");
  if (!tienda || !carrito) return;

  const esCarrito = seccion === "carrito";
  tienda.classList.toggle("hidden", esCarrito);
  carrito.classList.toggle("hidden", !esCarrito);

  if (esCarrito) {
    renderCarritoPagina();
    window.scrollTo(0, 0);
  }
}