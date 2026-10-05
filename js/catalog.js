import {
  productosBase,
  getLentes,
  getAccesorios,
  getPestanas,
  getCategoriasConProductos,
  esLente,
} from "./productos.js";
import { COLORES_LENTE } from "./lentes.js";
import { FICHA_LENTE } from "./constantes.js";
import { abrirModal, cerrarModal } from "./modales.js";
import { agregarAlCarrito } from "./cart.js";
import { formatearPrecio } from "./formato.js";
import { actualizarRuta } from "./ui.js";

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
const filtros = { color: "todos", categoria: "todos" };

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
    container.innerHTML = `<p class="catalogo-vacio">No hay lentes con esa combinación de filtros.</p>`;
    return;
  }

  container.innerHTML = items
    .map((prod) => {
      const nombre = escapar(prod.nombre);
      const tono = COLORES_LENTE[prod.color] ?? "";
      // "Cosplay · Cosplay Halloween" repetía lo mismo: si la categoría ya
      // nombra el tono, el tono sobra.
      const tonoRepetido =
        tono && prod.subcategoria?.toLowerCase().includes(tono.toLowerCase());
      const detalle = [
        tonoRepetido ? "" : tono,
        prod.subcategoria,
        prod.cobertura && `${prod.cobertura} cobertura`,
      ]
        .filter(Boolean)
        .join(" · ");
      const comprable = typeof prod.precio === "number";
      const agotado = prod.estado === "agotado";

      return `
    <article class="product-card-figma">
      ${/* Clicable con ratón por comodidad; el camino accesible es el botón del
             título, así la tarjeta no añade una parada de tabulador duplicada. */ ""}
      ${marcaFoto(prod.img ?? IMG_PLACEHOLDER, `Lente de contacto ${nombre}`, `data-action="open-detail" data-id="${prod.id}"`)}
      <div class="card-info">
        <h3><button class="card-title-btn" data-action="open-detail" data-id="${prod.id}">${nombre}</button></h3>
        <p class="card-meta">${escapar(detalle)}</p>
        <p class="price">${comprable ? formatearPrecio(prod.precio) : SIN_PRECIO}</p>
      </div>
      <button class="btn-add-figma" ${comprable && !agotado ? `data-action="add-to-cart" data-id="${prod.id}"` : "disabled"}>${agotado ? "AGOTADO" : comprable ? "AÑADIR" : "PRÓXIMAMENTE"}</button>
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
      ${marcaFoto(acc.img ?? IMG_PLACEHOLDER, escapar(acc.nombre))}
      <div class="card-info">
        <h3 class="card-title">${escapar(acc.nombre)}</h3>
        <p class="price">${formatearPrecio(acc.precio)}</p>
        <p class="card-desc">${escapar(acc.desc)}</p>
      </div>
        <button class="btn-add-figma" ${acc.estado === "agotado" ? "disabled" : `data-action="add-to-cart" data-id="${acc.id}"`}>${acc.estado === "agotado" ? "AGOTADO" : "AÑADIR"}</button>
    </article>
  `,
    )
    .join("");
}

/**
 * Tarjetas del carrusel de pestañas. Antes estaban escritas a mano en
 * `index.html`, con el nombre y el precio repetidos ahí y en los datos: de esa
 * duplicación salieron tarjetas que agregaban al carrito el producto de al lado.
 * `js/carrusel.js` mide `.pestana-card` para calcular el paso, así que esa clase
 * tiene que sobrevivir a cualquier cambio de markup.
 */
export function renderPestanas(items) {
  const container = document.getElementById("pestanas-carrusel");
  if (!container) return;
  container.innerHTML = items
    .map(
      (prod) => `
    <div class="pestana-card">
      <div class="pestana-img-box">
        ${marcaFoto(prod.img ?? IMG_PLACEHOLDER, escapar(prod.nombre))}
      </div>
      <div class="pestana-card-footer">
        <h3>${escapar(prod.nombre)}</h3>
        <p class="price">${formatearPrecio(prod.precio)}</p>
        <button class="btn-add-figma" ${prod.estado === "agotado" ? "disabled" : `data-action="add-to-cart" data-id="${prod.id}"`}>${prod.estado === "agotado" ? "AGOTADO" : "AÑADIR"}</button>
      </div>
    </div>
  `,
    )
    .join("");
}

/**
 * @param {string} valor  opción elegida ("todos", "miel", o el id de una categoría)
 * @param {string} grupo  "color" o "categoria"; cada grupo de botones es independiente.
 */
export function filtrarLentes(valor, grupo = "categoria") {
  if (!(grupo in filtros)) return;
  filtros[grupo] = valor;
  actualizarRuta({ [grupo]: valor === "todos" ? null : valor, pagina: null, detalle: null });

  const botones = document.querySelectorAll(
    `.pupil-filters[data-group="${grupo}"] .filter-btn`,
  );
  botones.forEach((b) => {
    const activo = b.dataset.filter === valor;
    b.classList.toggle("active", activo);
    // El estado no puede vivir solo en una clase CSS: sin esto, quien usa lector
    // de pantalla no sabe qué filtro está aplicado.
    b.setAttribute("aria-pressed", String(activo));
  });

  // Un filtro nuevo puede dejar menos páginas que la actual: se vuelve a la 1.
  actualizarCatalogoLentes({ volverAlInicio: true });
}

function lentesFiltrados() {
  return getLentes().filter(
    (l) =>
      (filtros.color === "todos" || l.color === filtros.color) &&
      (filtros.categoria === "todos" || String(l.categoriaId) === filtros.categoria),
  );
}

/* --- Filtros por subcategoría (las crea la administradora desde el panel) --- */

const botonFiltro = ({ accion, filtro, etiqueta, activo, extras = "" }) =>
  `<button class="filter-btn${activo ? " active" : ""}" data-action="${accion}" aria-pressed="${activo}" data-filter="${escapar(filtro)}" ${extras}>${escapar(etiqueta)}</button>`;

const opcionesFiltro = (categorias) => [
  { id: "todos", nombre: "TODAS" },
  ...categorias.map((c) => ({ id: String(c.id), nombre: c.nombre.toUpperCase() })),
];

/**
 * Pinta los botones de subcategoría de lentes. Si la sección no tiene
 * ninguna, el bloque queda oculto y la tienda se ve como antes.
 */
function pintarFiltrosCategoriaLentes() {
  const bloque = document.getElementById("filtros-categoria-lentes");
  const grupo = bloque?.querySelector(".pupil-filters");
  if (!bloque || !grupo) return;

  const categorias = getCategoriasConProductos("lente");
  // Una categoría que ya no existe (enlace viejo) no puede dejar el grid vacío.
  if (!categorias.some((c) => String(c.id) === filtros.categoria)) filtros.categoria = "todos";

  bloque.hidden = categorias.length === 0;
  grupo.innerHTML = opcionesFiltro(categorias)
    .map((c) =>
      botonFiltro({
        accion: "filtrar-lentes",
        filtro: c.id,
        etiqueta: c.nombre,
        activo: filtros.categoria === c.id,
        extras: 'data-group="categoria"',
      }),
    )
    .join("");
}

/* Pestañas y accesorios comparten el mismo mecanismo: una pista de carrusel
   y una fila de botones encima. */
const CARRUSELES = {
  pestana: {
    param: "categoria_pestanas",
    filtros: "filtros-categoria-pestanas",
    items: getPestanas,
    render: renderPestanas,
    pista: "pestanas-carrusel",
  },
  accesorio: {
    param: "categoria_accesorios",
    filtros: "filtros-categoria-accesorios",
    items: getAccesorios,
    render: renderAccesorios,
    pista: "grid-accesorios",
  },
};

const filtrosCarrusel = { pestana: "todos", accesorio: "todos" };

const itemsCarrusel = (seccion) =>
  CARRUSELES[seccion].items().filter(
    (p) =>
      filtrosCarrusel[seccion] === "todos" || String(p.categoriaId) === filtrosCarrusel[seccion],
  );

function pintarCarrusel(seccion, { volverAlInicio = false } = {}) {
  const { filtros: idFiltros, render, pista } = CARRUSELES[seccion];
  const categorias = getCategoriasConProductos(seccion);
  if (!categorias.some((c) => String(c.id) === filtrosCarrusel[seccion])) {
    filtrosCarrusel[seccion] = "todos";
  }

  const contenedor = document.getElementById(idFiltros);
  if (contenedor) {
    contenedor.hidden = categorias.length === 0;
    contenedor.innerHTML = opcionesFiltro(categorias)
      .map((c) =>
        botonFiltro({
          accion: "filtrar-carrusel",
          filtro: c.id,
          etiqueta: c.nombre,
          activo: filtrosCarrusel[seccion] === c.id,
          extras: `data-seccion="${seccion}"`,
        }),
      )
      .join("");
  }

  render(itemsCarrusel(seccion));
  if (volverAlInicio) document.getElementById(pista)?.scrollTo({ left: 0 });
}

export function filtrarCarrusel(seccion, valor) {
  if (!(seccion in CARRUSELES)) return;
  filtrosCarrusel[seccion] = valor;
  actualizarRuta({ [CARRUSELES[seccion].param]: valor === "todos" ? null : valor });
  pintarCarrusel(seccion, { volverAlInicio: true });
  // Mismo aviso que el catálogo de lentes: el cambio no se ve con lector de pantalla.
  const total = itemsCarrusel(seccion).length;
  const estado = document.getElementById("catalogo-estado");
  if (estado) estado.textContent = `${total} producto${total === 1 ? "" : "s"}.`;
}

/** Pinta los dos carruseles con el filtro que traiga la URL. */
export function restaurarCarruselesDesdeRuta() {
  const parametros = new URLSearchParams(window.location.search);
  Object.entries(CARRUSELES).forEach(([seccion, { param }]) => {
    filtrosCarrusel[seccion] = parametros.get(param) ?? "todos";
    pintarCarrusel(seccion);
  });
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
  anunciarResultado(filtrados.length, totalPaginas);
}

/* El grid se repinta sin avisar: para quien no ve el cambio, la página parece
   no haber respondido. Esta región lo dice en voz alta. */
function anunciarResultado(total, totalPaginas) {
  const estado = document.getElementById("catalogo-estado");
  if (!estado) return;

  estado.textContent =
    total === 0
      ? "No hay lentes con esa combinación de filtros."
      : `${total} referencia${total === 1 ? "" : "s"}, página ${paginaActual} de ${totalPaginas}.`;
}

export function irAPaginaLentes(pagina) {
  const destino = Number(pagina);
  if (!Number.isInteger(destino) || destino < 1) return;

  paginaActual = destino;
  actualizarRuta({ pagina: destino === 1 ? null : destino, detalle: null });
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

export function abrirModalDetalle(id, { historial = true } = {}) {
  const prod = productosBase.find((p) => p.id === id);
  /* El modal es la ficha del lente. Pestañas y accesorios no tienen tono,
     cobertura ni pupila, así que no deben abrir esta ficha: si llega un id que
     no es lente (por ejemplo desde `?detalle=`), se ignora. */
  if (!prod || !esLente(prod)) return;
  if (historial) actualizarRuta({ vista: null, detalle: id });
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
  const ficha = document.getElementById("modal-ficha");
  const esLenteConFicha = esLente(prod);
  if (ficha) ficha.hidden = !esLenteConFicha;
  if (esLenteConFicha) {
    texto("modal-color", COLORES_LENTE[prod.color] ?? prod.color);
    texto("modal-cobertura", prod.cobertura ?? "No especificada");
    texto("modal-borde", prod.borde ?? "No especificado");
    texto("modal-efecto", prod.efecto ?? "Ninguno");
    texto(
      "modal-presentaciones",
      prod.presentaciones
        .map(({ marca, diametro, pupila }) =>
          `${marca}${diametro ? `, ${diametro} DM` : ""} (${pupila})`,
        )
        .join("; "),
    );
    texto("modal-alias", prod.alias?.length ? prod.alias.join(", ") : "No tiene");
  }

  abrirModal("modal-product-detail");
}

export function restaurarCatalogoDesdeRuta() {
  const parametros = new URLSearchParams(window.location.search);
  const color = parametros.get("color");
  const categoria = parametros.get("categoria");
  const pagina = Number(parametros.get("pagina"));

  if (color && ["miel", "verde", "gris", "azul"].includes(color)) {
    filtros.color = color;
  }
  filtros.categoria = categoria ?? "todos";
  if (Number.isInteger(pagina) && pagina > 0) paginaActual = pagina;

  pintarFiltrosCategoriaLentes();
  actualizarCatalogoLentes();
  document.querySelectorAll(".pupil-filters .filter-btn").forEach((boton) => {
    const grupo = boton.closest(".pupil-filters")?.dataset.group;
    boton.classList.toggle("active", boton.dataset.filter === filtros[grupo]);
    boton.setAttribute("aria-pressed", String(boton.dataset.filter === filtros[grupo]));
  });
}

export function cerrarModalDetalle({ historial = true } = {}) {
  if (historial) actualizarRuta({ detalle: null });
  cerrarModal("modal-product-detail");
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
