import { productosBase, getLentes } from "./productos.js";
import { COLORES_LENTE } from "./lentes.js";
import { FICHA_LENTE } from "./constantes.js";
import { bloquearScroll, desbloquearScroll } from "./scroll-lock.js";
import { agregarAlCarrito } from "./cart.js";
import { formatearPrecio } from "./formato.js";

/** Referencias del catálogo que aún no tienen foto en el set de imágenes. */
const IMG_PLACEHOLDER = "assets/img/placeholder-producto.svg";

/**
 * Cada foto existe en dos formatos: WebP (pesa ~30% menos y es lo que usan casi
 * todos los navegadores) y JPEG junto a ella, como respaldo para los antiguos.
 * El dataset guarda el JPEG y aquí se deriva el WebP, para no duplicar rutas.
 */
const marcaFoto = (src, alt, extras = "") => {
  const esPlaceholder = src.endsWith(".svg");
  const img = `<img src="${escapar(src)}" alt="${alt}" loading="lazy" ${extras}>`;
  if (esPlaceholder) return img;
  return `<picture><source srcset="${escapar(src.replace(/\.jpe?g$/i, ".webp"))}" type="image/webp">${img}</picture>`;
};

let productoSeleccionadoModal = null;
let cantidadModal = 1;

/**
 * Filtros del catálogo de lentes. Se combinan entre sí: el grid muestra las
 * referencias que cumplen los dos a la vez.
 */
const filtros = { color: "todos", pupila: "todos" };

/** Referencias por página del grid de lentes. */
const POR_PAGINA = 6;
let paginaActual = 1;

/** Los datos del catálogo son del negocio, pero igual se escapan antes de innerHTML. */
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

/**
 * Un producto sin precio confirmado se muestra pero no se puede comprar: dejar
 * añadir al carrito algo sin precio mandaría un pedido a $0 por WhatsApp.
 */
const SIN_PRECIO = "Precio por confirmar";

export function renderLentes(items) {
  const container = document.getElementById("grid-lentes-cafe");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p class="catalogo-vacio">No hay lentes con esa combinación de tono y pupila.</p>`;
    return;
  }

  container.innerHTML = items
    .map((prod) => {
      const nombre = escapar(prod.nombre);
      const tono = COLORES_LENTE[prod.color] ?? "";
      const detalle = [
        tono,
        prod.categoria,
        prod.cobertura && `${prod.cobertura} cobertura`,
      ]
        .filter(Boolean)
        .join(" · ");
      const comprable = typeof prod.precio === "number";

      return `
    <article class="product-card-figma">
      ${marcaFoto(prod.img ?? IMG_PLACEHOLDER, `Lente de contacto ${nombre}`, `data-action="open-detail" data-id="${prod.id}"`)}
      <div class="card-info">
        <h3 data-action="open-detail" data-id="${prod.id}">${nombre}</h3>
        <p class="card-meta">${escapar(detalle)}</p>
        <p class="price">${comprable ? formatearPrecio(prod.precio) : SIN_PRECIO}</p>
      </div>
      <button class="btn-add-figma" ${comprable ? `data-action="add-to-cart" data-id="${prod.id}"` : "disabled"}>${comprable ? "AÑADIR" : "PRÓXIMAMENTE"}</button>
    </article>
  `;
    })
    .join("");
}

export function renderAccesorios(items) {
  const container = document.getElementById("grid-accesorios");
  if (!container) return;
  container.innerHTML = items
    .map(
      (acc) => `
    <article class="product-card-figma">
      ${marcaFoto(acc.img, escapar(acc.nombre))}
      <div class="card-info">
        <h3>${escapar(acc.nombre)}</h3>
        <p class="price">${formatearPrecio(acc.precio)}</p>
        <p class="card-desc">${escapar(acc.desc)}</p>
      </div>
      <button class="btn-add-figma" data-action="add-to-cart" data-id="${acc.id}">AÑADIR</button>
    </article>
  `,
    )
    .join("");
}

/**
 * @param {string} valor  opción elegida ("todos", "miel", "reducida"...)
 * @param {string} grupo  "color" o "pupila"; cada grupo de botones es independiente.
 */
export function filtrarLentes(valor, grupo = "pupila") {
  if (!(grupo in filtros)) return;
  filtros[grupo] = valor;

  const botones = document.querySelectorAll(
    `.pupil-filters[data-group="${grupo}"] .filter-btn`,
  );
  botones.forEach((b) => b.classList.toggle("active", b.dataset.filter === valor));

  // Un filtro nuevo puede dejar menos páginas que la actual: se vuelve a la 1.
  actualizarCatalogoLentes({ volverAlInicio: true });
}

function lentesFiltrados() {
  return getLentes().filter(
    (l) =>
      (filtros.color === "todos" || l.color === filtros.color) &&
      (filtros.pupila === "todos" || l.tipo === filtros.pupila),
  );
}

/**
 * Render del catálogo con los filtros y la página vigentes.
 * Es el único punto que pinta el grid: filtros, paginación y carga inicial
 * pasan por aquí.
 */
export function actualizarCatalogoLentes({ volverAlInicio = false } = {}) {
  if (volverAlInicio) paginaActual = 1;

  const filtrados = lentesFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  paginaActual = Math.min(paginaActual, totalPaginas);

  const desde = (paginaActual - 1) * POR_PAGINA;
  renderLentes(filtrados.slice(desde, desde + POR_PAGINA));
  renderPaginacion(totalPaginas, filtrados.length);
}

export function irAPaginaLentes(pagina) {
  const destino = Number(pagina);
  if (!Number.isInteger(destino) || destino < 1) return;

  paginaActual = destino;
  actualizarCatalogoLentes();
  document.getElementById("lentes")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Ventana de como mucho 5 números alrededor de la página actual, para que el
 * control no crezca sin límite a medida que entren más referencias.
 */
function ventanaPaginas(total, actual, maximo = 5) {
  const desde = Math.max(1, Math.min(actual - Math.floor(maximo / 2), total - maximo + 1));
  const hasta = Math.min(total, desde + maximo - 1);
  return Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);
}

function renderPaginacion(totalPaginas, totalItems) {
  const nav = document.getElementById("paginacion-lentes");
  if (!nav) return;

  if (totalPaginas <= 1) {
    nav.innerHTML = "";
    nav.hidden = true;
    return;
  }
  nav.hidden = false;

  const flecha = (pagina, etiqueta, simbolo, deshabilitada) => `
    <button class="pagina-btn pagina-flecha" data-action="pagina-lentes"
            data-pagina="${pagina}" aria-label="${etiqueta}"
            ${deshabilitada ? "disabled" : ""}>${simbolo}</button>`;

  const numeros = ventanaPaginas(totalPaginas, paginaActual)
    .map(
      (n) => `
    <button class="pagina-btn${n === paginaActual ? " active" : ""}"
            data-action="pagina-lentes" data-pagina="${n}"
            aria-label="Página ${n}"${n === paginaActual ? ' aria-current="page"' : ""}>${n}</button>`,
    )
    .join("");

  nav.innerHTML = `
    ${flecha(paginaActual - 1, "Página anterior", "&lsaquo;", paginaActual === 1)}
    ${numeros}
    ${flecha(paginaActual + 1, "Página siguiente", "&rsaquo;", paginaActual === totalPaginas)}
    <span class="paginacion-info">${totalItems} referencia${totalItems === 1 ? "" : "s"}</span>`;
}

/**
 * Collage de fotos del lente. El diseño muestra una cuadrícula de cuatro; se
 * pintan las que la referencia tenga y con una sola ocupa todo el recuadro.
 */
function renderGaleria(prod) {
  const galeria = document.getElementById("modal-galeria");
  if (!galeria) return;

  const fotos = prod.imagenes?.length ? prod.imagenes : [prod.img ?? IMG_PLACEHOLDER];
  galeria.dataset.cantidad = String(Math.min(fotos.length, 4));
  galeria.innerHTML = fotos
    .slice(0, 4)
    .map((src, i) =>
      marcaFoto(src, `${escapar(prod.nombre)}${i ? ` (foto ${i + 1})` : ""}`),
    )
    .join("");
}

export function abrirModalDetalle(id) {
  const prod = productosBase.find((p) => p.id === id);
  if (!prod) return;
  productoSeleccionadoModal = prod;
  cantidadModal = 1;
  actualizarCantidadModal();

  renderGaleria(prod);
  const texto = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.innerText = valor;
  };
  texto("modal-categoria", FICHA_LENTE.categoria);
  texto("modal-title", prod.nombre);
  const comprable = typeof prod.precio === "number";
  texto("modal-price", comprable ? formatearPrecio(prod.precio) : SIN_PRECIO);
  const btnAnadir = document.querySelector(".btn-add-modal");
  if (btnAnadir) {
    btnAnadir.disabled = !comprable;
    btnAnadir.textContent = comprable ? "AÑADIR AL CARRITO" : "PRÓXIMAMENTE";
  }
  texto("modal-desc", `${prod.desc}\n${FICHA_LENTE.notaComodidad}`);
  texto("modal-duracion", FICHA_LENTE.duracion);
  texto("modal-tipo", FICHA_LENTE.tipo);

  document.getElementById("modal-product-detail").classList.add("open");
  bloquearScroll();
}

export function cerrarModalDetalle() {
  const modal = document.getElementById("modal-product-detail");
  // Sin esta guarda, cerrar un modal ya cerrado descontaría un bloqueo que
  // nunca se pidió y devolvería el scroll con otro modal todavía abierto.
  if (!modal.classList.contains("open")) return;

  modal.classList.remove("open");
  desbloquearScroll();
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
  if (typeof productoSeleccionadoModal.precio !== "number") return;
  agregarAlCarrito(productoSeleccionadoModal.id, cantidadModal);
  cerrarModalDetalle();
}
