import { renderCarritoPagina } from "./cart.js";

export function actualizarRuta(cambios = {}, { reemplazar = false } = {}) {
  const parametros = new URLSearchParams(window.location.search);
  Object.entries(cambios).forEach(([clave, valor]) => {
    if (valor === null || valor === undefined || valor === "" || valor === "tienda") {
      parametros.delete(clave);
    } else {
      parametros.set(clave, String(valor));
    }
  });
  const query = parametros.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  const metodo = reemplazar ? "replaceState" : "pushState";
  window.history[metodo]({}, "", url);
}

export function mostrarSeccion(seccion, { historial = true } = {}) {
  const tienda = document.getElementById("view-store");
  const carrito = document.getElementById("view-cart");
  const admin = document.getElementById("view-admin");
  if (!tienda || !carrito || !admin) return;

  const esCarrito = seccion === "carrito";
  const esAdmin = seccion === "admin";
  if (historial) actualizarRuta({ vista: esCarrito ? "carrito" : esAdmin ? "admin" : null, detalle: null });
  tienda.classList.toggle("hidden", esCarrito);
  carrito.classList.toggle("hidden", !esCarrito);
  admin.classList.toggle("hidden", !esAdmin);

  if (esCarrito) {
    renderCarritoPagina();
    window.scrollTo(0, 0);
  }
}

export function vistaDesdeRuta() {
  const vista = new URLSearchParams(window.location.search).get("vista");
  return vista === "carrito" || vista === "admin" ? vista : "tienda";
}
