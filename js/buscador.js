import { productosBase, esLente } from "./productos.js";
import { formatearPrecio } from "./formato.js";
import { abrirModal, cerrarModal } from "./modales.js";
import { abrirModalDetalle } from "./catalog.js";

/**
 * Buscador del catálogo.
 *
 * Es la lupa del header: abre un diálogo con un campo y resultados en vivo.
 * Como el catálogo remoto ya está en `productosBase`, la búsqueda es local y no
 * consulta a Supabase en cada tecla. Al tocar un resultado, un lente abre su
 * ficha y las pestañas o accesorios se resaltan en su sección (esos no tienen
 * ficha de lente).
 */

const IMG_PLACEHOLDER = "assets/img/placeholder-producto.svg";
const MAX_RESULTADOS = 8;

const escapar = (texto) =>
  String(texto ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );

const normalizar = (texto) =>
  String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function coincidencias(termino) {
  const buscado = normalizar(termino).trim();
  if (!buscado) return [];
  return productosBase
    .filter((producto) =>
      [producto.nombre, ...(producto.alias ?? [])].some((campo) =>
        normalizar(campo).includes(buscado),
      ),
    )
    .slice(0, MAX_RESULTADOS);
}

function pintarResultados(lista, termino) {
  const contenedor = document.getElementById("search-results");
  const estado = document.getElementById("search-status");
  if (!contenedor) return;

  if (!termino) {
    contenedor.innerHTML =
      '<p class="search-hint">Escribe el nombre de un lente, una pestaña o un accesorio.</p>';
    if (estado) estado.textContent = "";
    return;
  }

  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="search-hint">Sin resultados para “${escapar(termino)}”.</p>`;
    if (estado) estado.textContent = `Sin resultados para ${termino}.`;
    return;
  }

  contenedor.innerHTML = lista
    .map(
      (producto) => `
    <button type="button" class="search-result" data-action="search-open" data-id="${producto.id}">
      <img src="${escapar(producto.img ?? IMG_PLACEHOLDER)}" alt="" loading="lazy" />
      <span class="search-result-info">
        <span class="search-result-nombre">${escapar(producto.nombre)}</span>
        <span class="search-result-precio">${
          typeof producto.precio === "number"
            ? formatearPrecio(producto.precio)
            : "Precio por confirmar"
        }</span>
      </span>
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>`,
    )
    .join("");

  if (estado) estado.textContent = `${lista.length} resultado${lista.length === 1 ? "" : "s"}.`;
}

export function abrirBuscador() {
  const input = document.getElementById("search-input");
  if (input) input.value = "";
  pintarResultados([], "");
  abrirModal("modal-busqueda");
  input?.focus();
}

export function cerrarBuscador() {
  cerrarModal("modal-busqueda");
}

export function buscar(texto) {
  const termino = String(texto ?? "").trim();
  const boton = document.querySelector('[data-action="close-search"]');
  if (boton) {
    boton.setAttribute("aria-label", termino ? "Borrar búsqueda" : "Cerrar búsqueda");
  }
  pintarResultados(coincidencias(termino), termino);
}

/* Pestañas y accesorios no tienen ficha, así que el resultado los lleva a su
   sección y los ilumina un momento en vez de abrir un modal que no existe. */
function resaltarProducto(id) {
  const control = document.querySelector(`[data-action="add-to-cart"][data-id="${id}"]`);
  const tarjeta = control?.closest(".product-card-figma, .pestana-card");
  if (!tarjeta) return;
  tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
  tarjeta.classList.add("resaltado");
  setTimeout(() => tarjeta.classList.remove("resaltado"), 1800);
}

export function abrirResultado(id) {
  const producto = productosBase.find((p) => p.id === id);
  if (!producto) return;
  cerrarBuscador();
  if (esLente(producto)) abrirModalDetalle(id);
  else resaltarProducto(id);
}
