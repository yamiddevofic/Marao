import { exigirSupabase } from "./supabase.js";
import { formatearPrecio } from "./formato.js";
import { abrirModal, cerrarModal, cerrarModalSuperior, hayModalAbierto } from "./modales.js";

const CORREO_ADMIN = "admin@marao.com";
const ESTADOS = ["disponible", "agotado", "oculto"];
const TIPOS = ["reducida", "estandar", "cosplay", "pestana", "accesorio"];
const TIPOS_LENTE = ["reducida", "estandar", "cosplay"];
const IMG_PLACEHOLDER = "assets/img/placeholder-producto.svg";

/* Bucket de Supabase Storage donde ya viven las fotos del catálogo. El admin
   sube ahí con su propia sesión; la clave de servicio solo se usa en los
   scripts locales, nunca en el navegador. */
const BUCKET = "productos";
const MAX_IMAGEN_BYTES = 5 * 1024 * 1024;
const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"];
const EXTENSIONES_IMAGEN = ["jpg", "jpeg", "png", "webp"];

/** Último catálogo cargado, para abrir el editor y leer sus fotos sin otra consulta. */
let productos = [];
let productoEditado = null;
let urlVistaPrevia = null;

function obtenerSupabase() {
  return exigirSupabase();
}

function esAdmin(usuario) {
  return usuario?.email?.toLowerCase() === CORREO_ADMIN;
}

function esTipoLente(tipo) {
  return TIPOS_LENTE.includes(tipo);
}

/**
 * El panel y la tarjeta de acceso están uno a la vista del otro, así que el
 * mensaje tiene que ir al que se ve: escribirlo siempre en `#admin-mensaje`
 * dejaba las confirmaciones ocultas dentro del login ya cerrado.
 */
function mostrarMensaje(mensaje, error = false) {
  const panel = document.getElementById("admin-panel-contenido");
  const visible = panel && !panel.hidden;
  const elemento = visible
    ? document.getElementById("admin-estado")
    : document.getElementById("admin-mensaje");
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.classList.toggle("admin-mensaje--error", error);
}

function precioTexto(precio) {
  return typeof precio === "number" ? formatearPrecio(precio) : "Precio por confirmar";
}

/* Los errores de guardado se muestran dentro del editor: el mensaje del panel
   queda detrás del modal y no se leería. */
function mostrarMensajeEditor(mensaje, error = false) {
  const elemento = document.getElementById("admin-editor-mensaje");
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.classList.toggle("admin-mensaje--error", error);
}

/** Aviso flotante que confirma o niega una acción y se va solo. */
let temporizadorToast;

function mostrarToast(mensaje, error = false) {
  const toast = document.getElementById("admin-toast");
  if (!toast) return;
  clearTimeout(temporizadorToast);
  toast.textContent = mensaje;
  toast.classList.remove("admin-toast--exito", "admin-toast--error");
  toast.classList.add(error ? "admin-toast--error" : "admin-toast--exito");
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("visible"));
  temporizadorToast = setTimeout(() => {
    toast.classList.remove("visible");
    temporizadorToast = setTimeout(() => {
      toast.hidden = true;
    }, 250);
  }, 3200);
}

/** Mientras carga el catálogo, el grid muestra un indicador en vez de quedar vacío. */
function pintarCargando(mensaje = "Cargando catálogo…") {
  const contenedor = document.getElementById("admin-productos");
  if (!contenedor) return;
  contenedor.replaceChildren();

  const bloque = document.createElement("div");
  bloque.className = "admin-cargando";
  bloque.setAttribute("role", "status");
  const spinner = document.createElement("span");
  spinner.className = "admin-spinner";
  spinner.setAttribute("aria-hidden", "true");
  const texto = document.createElement("span");
  texto.textContent = mensaje;
  bloque.append(spinner, texto);
  contenedor.append(bloque);
}

/** Deja un botón ocupado mientras corre la acción y lo restaura al terminar. */
function ocuparBoton(boton, texto) {
  if (!boton) return () => {};
  const original = boton.textContent;
  boton.disabled = true;
  boton.textContent = texto;
  return () => {
    boton.disabled = false;
    boton.textContent = original;
  };
}

function pintarResumen(lista) {
  const resumen = document.getElementById("admin-resumen");
  if (!resumen) return;

  const cuenta = { disponible: 0, agotado: 0, oculto: 0 };
  lista.forEach((producto) => {
    if (producto.estado in cuenta) cuenta[producto.estado] += 1;
  });

  const asignar = (id, valor) => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = String(valor);
  };
  asignar("admin-total", lista.length);
  asignar("admin-disponibles", cuenta.disponible);
  asignar("admin-agotados", cuenta.agotado);
  asignar("admin-ocultos", cuenta.oculto);
}

function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  /* Misma tarjeta que el catálogo de inicio; solo cambia la acción del botón. */
  tarjeta.className = "product-card-figma";
  if (producto.estado === "oculto") tarjeta.classList.add("admin-producto--oculto");

  const imagen = document.createElement("img");
  imagen.src = producto.imagen ?? IMG_PLACEHOLDER;
  imagen.alt = "";
  imagen.loading = "lazy";
  imagen.addEventListener("error", () => {
    imagen.src = IMG_PLACEHOLDER;
  });

  const info = document.createElement("div");
  info.className = "card-info";
  const nombre = document.createElement("h3");
  nombre.className = "card-title";
  nombre.textContent = producto.nombre;
  const precio = document.createElement("p");
  precio.className = "price";
  precio.textContent = precioTexto(producto.precio);
  info.append(nombre, precio);

  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "btn-add-figma";
  editar.dataset.action = "admin-edit";
  editar.dataset.id = String(producto.id);
  editar.textContent = "EDITAR";

  tarjeta.append(imagen, info, editar);
  return tarjeta;
}

function pintarProductos(lista, { vacio = "No hay productos en el catálogo." } = {}) {
  const contenedor = document.getElementById("admin-productos");
  if (!contenedor) return;
  contenedor.replaceChildren();

  if (lista.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "admin-vacio";
    mensaje.textContent = vacio;
    contenedor.append(mensaje);
    return;
  }

  lista.forEach((producto) => contenedor.append(crearTarjeta(producto)));
}

/* --- Filtros del catálogo --- */

const filtros = { tipo: "todos", color: "todos", estado: "todos" };

const normalizar = (texto) =>
  String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function productosFiltrados() {
  return productos.filter((producto) => {
    if (filtros.tipo !== "todos" && producto.tipo !== filtros.tipo) return false;
    if (filtros.color !== "todos" && producto.color !== filtros.color) return false;
    if (filtros.estado !== "todos" && producto.estado !== filtros.estado) return false;
    return true;
  });
}

function hayFiltrosActivos() {
  return filtros.tipo !== "todos" || filtros.color !== "todos" || filtros.estado !== "todos";
}

function aplicarFiltros() {
  const lista = productosFiltrados();
  pintarProductos(lista, {
    vacio: hayFiltrosActivos()
      ? "Ningún producto coincide con el filtro."
      : "No hay productos en el catálogo.",
  });
  mostrarMensaje(
    lista.length === productos.length
      ? `${productos.length} productos en el catálogo.`
      : `${lista.length} de ${productos.length} productos.`,
  );
}

function limpiarFiltros() {
  filtros.tipo = "todos";
  filtros.color = "todos";
  filtros.estado = "todos";
  const categoria = document.getElementById("admin-filtro-categoria");
  if (categoria) categoria.value = "todos";
  const color = document.getElementById("admin-filtro-color");
  if (color) color.value = "todos";
  const estado = document.getElementById("admin-filtro-estado");
  if (estado) estado.value = "todos";
  aplicarFiltros();
}

function leerFiltrosDeControles() {
  filtros.tipo = document.getElementById("admin-filtro-categoria")?.value ?? "todos";
  filtros.color = document.getElementById("admin-filtro-color")?.value ?? "todos";
  filtros.estado = document.getElementById("admin-filtro-estado")?.value ?? "todos";
}

/* Agrupa la escritura del buscador y repinta una vez, no en cada tecla. */
function conEspera(fn, ms = 200) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), ms);
  };
}

async function cargarProductosAdmin() {
  mostrarMensaje("Cargando catálogo…");
  pintarCargando();
  const { data, error } = await obtenerSupabase()
    .from("productos")
    .select(
      "id, nombre, descripcion, precio, tipo, color, cobertura, borde, efecto, alias, presentaciones, imagen, imagenes, estado, orden",
    )
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;

  productos = data ?? [];
  pintarResumen(productos);
  aplicarFiltros();
}

/* --- Editor de ficha --- */

function leerAlias(valor) {
  return String(valor ?? "")
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);
}

function crearFilaPresentacion({ marca = "", diametro = "", pupila = "" } = {}) {
  const fila = document.createElement("div");
  fila.className = "admin-presentacion-row";

  const campos = [
    { name: "presentacion-marca", label: "Marca", value: marca, placeholder: "Freshlady" },
    { name: "presentacion-diametro", label: "Diámetro", value: diametro, placeholder: "14.2" },
    { name: "presentacion-pupila", label: "Pupila", value: pupila, placeholder: "Realista" },
  ];

  campos.forEach(({ name, label, value, placeholder }) => {
    const envoltorio = document.createElement("label");
    envoltorio.className = "admin-campo";
    const texto = document.createElement("span");
    texto.textContent = label;
    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;
    envoltorio.append(texto, input);
    fila.append(envoltorio);
  });

  const quitar = document.createElement("button");
  quitar.type = "button";
  quitar.className = "admin-icon-button";
  quitar.dataset.action = "admin-remove-presentacion";
  quitar.setAttribute("aria-label", "Quitar presentación");
  quitar.textContent = "×";
  fila.append(quitar);

  return fila;
}

function leerPresentaciones() {
  return [...document.querySelectorAll("#admin-presentaciones .admin-presentacion-row")]
    .map((fila) => ({
      marca: fila.querySelector('[name="presentacion-marca"]')?.value.trim() ?? "",
      diametro: fila.querySelector('[name="presentacion-diametro"]')?.value.trim() ?? "",
      pupila: fila.querySelector('[name="presentacion-pupila"]')?.value.trim() ?? "",
    }))
    .filter((presentacion) => presentacion.marca || presentacion.diametro || presentacion.pupila);
}

function actualizarCamposLente() {
  const bloque = document.getElementById("admin-campos-lente");
  const tipo = document.getElementById("admin-tipo")?.value;
  if (bloque) bloque.hidden = !esTipoLente(tipo);
}

function liberarVistaPrevia() {
  if (urlVistaPrevia) {
    URL.revokeObjectURL(urlVistaPrevia);
    urlVistaPrevia = null;
  }
}

function actualizarVistaPrevia(input) {
  const archivo = input.files?.[0];
  if (!archivo) return;
  const vista = document.getElementById("admin-foto-preview");
  if (!vista) return;
  liberarVistaPrevia();
  urlVistaPrevia = URL.createObjectURL(archivo);
  vista.src = urlVistaPrevia;
}

function siguienteId() {
  return Math.max(0, ...productos.map((producto) => Number(producto.id) || 0)) + 1;
}

function siguienteOrden() {
  return Math.max(0, ...productos.map((producto) => Number(producto.orden) || 0)) + 1;
}

function mostrarCampoId(visible) {
  const campo = document.getElementById("admin-id-campo");
  if (campo) campo.hidden = !visible;
}

function mostrarBotonEliminar(visible) {
  const boton = document.getElementById("admin-editor-eliminar");
  if (boton) boton.hidden = !visible;
}

function abrirEditor(id) {
  const producto = productos.find((item) => item.id === id);
  const formulario = document.getElementById("admin-producto-form");
  if (!producto || !formulario) return;

  cerrarBusquedaAdmin();
  productoEditado = producto;
  formulario.reset();
  formulario.dataset.modo = "editar";
  formulario.dataset.id = String(producto.id);
  mostrarMensajeEditor("");
  formulario.elements.nombre.value = producto.nombre ?? "";
  formulario.elements.precio.value = typeof producto.precio === "number" ? producto.precio : "";
  formulario.elements.tipo.value = producto.tipo ?? "accesorio";
  formulario.elements.estado.value = producto.estado ?? "disponible";
  formulario.elements.orden.value = Number.isFinite(producto.orden) ? producto.orden : "";
  formulario.elements.descripcion.value = producto.descripcion ?? "";
  formulario.elements.color.value = producto.color ?? "";
  formulario.elements.cobertura.value = producto.cobertura ?? "";
  formulario.elements.borde.value = producto.borde ?? "";
  formulario.elements.efecto.value = producto.efecto ?? "";
  formulario.elements.alias.value = Array.isArray(producto.alias) ? producto.alias.join(", ") : "";

  const contenedor = document.getElementById("admin-presentaciones");
  if (contenedor) {
    contenedor.replaceChildren();
    (producto.presentaciones ?? []).forEach((presentacion) =>
      contenedor.append(crearFilaPresentacion(presentacion)),
    );
  }

  liberarVistaPrevia();
  const vista = document.getElementById("admin-foto-preview");
  if (vista) {
    vista.src = producto.imagen ?? producto.imagenes?.[0] ?? IMG_PLACEHOLDER;
  }

  const titulo = document.getElementById("admin-editor-title");
  if (titulo) titulo.textContent = producto.nombre;

  mostrarCampoId(false);
  mostrarBotonEliminar(true);
  actualizarCamposLente();
  cerrarFab();
  abrirModal("modal-admin-producto");
}

function abrirEditorNuevo() {
  const formulario = document.getElementById("admin-producto-form");
  if (!formulario) return;

  productoEditado = null;
  formulario.reset();
  formulario.dataset.modo = "crear";
  formulario.dataset.id = "";
  mostrarMensajeEditor("");
  formulario.elements.id.value = String(siguienteId());
  formulario.elements.orden.value = String(siguienteOrden());

  const contenedor = document.getElementById("admin-presentaciones");
  if (contenedor) contenedor.replaceChildren();

  liberarVistaPrevia();
  const vista = document.getElementById("admin-foto-preview");
  if (vista) vista.src = IMG_PLACEHOLDER;

  const titulo = document.getElementById("admin-editor-title");
  if (titulo) titulo.textContent = "Nuevo producto";

  mostrarCampoId(true);
  mostrarBotonEliminar(false);
  actualizarCamposLente();
  cerrarFab();
  abrirModal("modal-admin-producto");
}

function validarImagen(archivo) {
  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "";
  const tipoValido =
    TIPOS_IMAGEN.includes(archivo.type) || EXTENSIONES_IMAGEN.includes(extension);
  if (!tipoValido) {
    throw new Error("La foto debe ser JPG, PNG o WebP.");
  }
  if (archivo.size > MAX_IMAGEN_BYTES) {
    throw new Error("La foto no puede superar los 5 MB.");
  }
}

async function subirImagen(id, archivo) {
  validarImagen(archivo);
  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ruta = `admin/${id}-${Date.now()}.${extension}`;
  const supabase = obtenerSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, {
    cacheControl: "3600",
    upsert: false,
    contentType: archivo.type || undefined,
  });
  if (error) throw new Error(`No se pudo subir la foto: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
  return data.publicUrl;
}

async function guardarProducto(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  if (!(formulario instanceof HTMLFormElement)) return;

  const modo = formulario.dataset.modo === "crear" ? "crear" : "editar";
  const id = Number(formulario.dataset.id);
  if (modo === "editar" && !Number.isInteger(id)) return;

  const restaurarBoton = ocuparBoton(
    formulario.querySelector('button[type="submit"]'),
    modo === "crear" ? "Creando…" : "Guardando…",
  );

  try {
    const datos = new FormData(formulario);
    const cambios = {
      nombre: String(datos.get("nombre") ?? "").trim(),
      descripcion: String(datos.get("descripcion") ?? "").trim(),
      precio: datos.get("precio") === "" ? null : Number(datos.get("precio")),
      tipo: String(datos.get("tipo") ?? ""),
      estado: String(datos.get("estado") ?? "disponible"),
      orden: datos.get("orden") === "" ? null : Number(datos.get("orden")),
    };

    if (!cambios.nombre) throw new Error("El nombre no puede quedar vacío.");
    if (!TIPOS.includes(cambios.tipo)) throw new Error("Selecciona una categoría válida.");
    if (!ESTADOS.includes(cambios.estado)) throw new Error("Selecciona un estado válido.");
    if (cambios.precio !== null && (!Number.isFinite(cambios.precio) || cambios.precio < 0)) {
      throw new Error("El precio debe ser un número mayor o igual a cero.");
    }

    if (modo === "crear") {
      const idCrudo = String(datos.get("id") ?? "").trim();
      if (idCrudo) {
        const idNuevo = Number(idCrudo);
        if (!Number.isInteger(idNuevo) || idNuevo <= 0) {
          throw new Error("El ID debe ser un número entero positivo.");
        }
        cambios.id = idNuevo;
      }
    }

    if (esTipoLente(cambios.tipo)) {
      cambios.color = datos.get("color") || null;
      cambios.cobertura = datos.get("cobertura") || null;
      cambios.borde = datos.get("borde") || null;
      cambios.efecto = datos.get("efecto") || null;
      cambios.alias = leerAlias(datos.get("alias"));
      cambios.presentaciones = leerPresentaciones();
    }

    const archivo = formulario.elements.foto?.files?.[0];
    if (archivo) {
      const url = await subirImagen(modo === "crear" ? "nuevo" : id, archivo);
      const previas = productoEditado?.imagenes ?? [];
      cambios.imagen = url;
      cambios.imagenes = [url, ...previas.filter((imagen) => imagen !== url)].slice(0, 4);
    }

    const supabase = obtenerSupabase();
    if (modo === "crear") {
      const { error } = await supabase.from("productos").insert(cambios);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("productos").update(cambios).eq("id", id);
      if (error) throw error;
    }

    const aviso = `"${cambios.nombre}" ${modo === "crear" ? "creado" : "actualizado"}.`;
    cerrarModal("modal-admin-producto");
    window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
    await cargarProductosAdmin();
    mostrarMensaje(aviso);
    mostrarToast(aviso);
  } catch (error) {
    mostrarMensajeEditor(`No se pudo guardar: ${error.message}`, true);
    mostrarToast(`No se pudo guardar: ${error.message}`, true);
  } finally {
    restaurarBoton();
  }
}

/* --- Eliminar con confirmación --- */

let confirmacionPendiente = null;

function abrirConfirmacion({ titulo, mensaje, requiereTexto = false, alConfirmar }) {
  const modal = document.getElementById("modal-admin-confirmar");
  if (!modal) return;
  confirmacionPendiente = alConfirmar;

  const tituloElemento = document.getElementById("admin-confirmar-title");
  if (tituloElemento) tituloElemento.textContent = titulo;
  const mensajeElemento = document.getElementById("admin-confirmar-mensaje");
  if (mensajeElemento) mensajeElemento.textContent = mensaje;

  const campo = document.getElementById("admin-confirmar-campo");
  const input = document.getElementById("admin-confirmar-input");
  const boton = document.getElementById("admin-confirmar-boton");
  if (campo) campo.hidden = !requiereTexto;
  if (input) input.value = "";
  if (boton) boton.disabled = requiereTexto;

  cerrarFab();
  abrirModal("modal-admin-confirmar");
  if (requiereTexto) input?.focus();
}

async function ejecutarConfirmacion() {
  const accion = confirmacionPendiente;
  if (!accion) return;
  confirmacionPendiente = null;
  const restaurarBoton = ocuparBoton(
    document.getElementById("admin-confirmar-boton"),
    "Eliminando…",
  );
  try {
    await accion();
  } finally {
    restaurarBoton();
    cerrarModal("modal-admin-confirmar");
  }
}

async function eliminarProducto(id) {
  try {
    const { error } = await obtenerSupabase().from("productos").delete().eq("id", id);
    if (error) throw error;
    cerrarModal("modal-admin-producto");
    window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
    await cargarProductosAdmin();
    mostrarMensaje("Producto eliminado.");
    mostrarToast("Producto eliminado.");
  } catch (error) {
    mostrarMensaje(`No se pudo eliminar: ${error.message}`, true);
    mostrarToast(`No se pudo eliminar: ${error.message}`, true);
  }
}

async function eliminarTodos() {
  try {
    const ids = productos.map((producto) => producto.id);
    if (ids.length === 0) return;
    const { error } = await obtenerSupabase().from("productos").delete().in("id", ids);
    if (error) throw error;
    window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
    await cargarProductosAdmin();
    mostrarMensaje("Se eliminaron todos los productos.");
    mostrarToast("Se eliminaron todos los productos.");
  } catch (error) {
    mostrarMensaje(`No se pudo eliminar: ${error.message}`, true);
    mostrarToast(`No se pudo eliminar: ${error.message}`, true);
  }
}

function solicitarEliminar(id) {
  const producto = productos.find((item) => item.id === id);
  if (!producto) return;
  abrirConfirmacion({
    titulo: "Eliminar producto",
    mensaje: `Se eliminará "${producto.nombre}". Esta acción no se puede deshacer.`,
    alConfirmar: () => eliminarProducto(id),
  });
}

function solicitarEliminarTodos() {
  if (productos.length === 0) return;
  abrirConfirmacion({
    titulo: "Eliminar todos los productos",
    mensaje: `Se eliminarán los ${productos.length} productos del catálogo. Esta acción no se puede deshacer.`,
    requiereTexto: true,
    alConfirmar: eliminarTodos,
  });
}

/* --- Botón flotante de acciones --- */

function alternarFab() {
  const fab = document.getElementById("admin-fab");
  const menu = document.getElementById("admin-fab-menu");
  const boton = fab?.querySelector('[data-action="admin-fab"]');
  if (!fab || !menu) return;
  const abierto = menu.hidden;
  menu.hidden = !abierto;
  fab.classList.toggle("admin-fab--abierto", abierto);
  boton?.setAttribute("aria-expanded", String(abierto));
}

function cerrarFab() {
  const fab = document.getElementById("admin-fab");
  const menu = document.getElementById("admin-fab-menu");
  const boton = fab?.querySelector('[data-action="admin-fab"]');
  if (!fab || !menu) return;
  menu.hidden = true;
  fab.classList.remove("admin-fab--abierto");
  boton?.setAttribute("aria-expanded", "false");
}

/* --- Buscador del panel --- */

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

function pintarResultadosBusqueda(lista, termino) {
  const contenedor = document.getElementById("admin-search-results");
  const estado = document.getElementById("admin-search-status");
  if (!contenedor) return;

  if (!termino) {
    contenedor.innerHTML = '<p class="search-hint">Escribe el nombre de un producto.</p>';
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
    <button type="button" class="search-result" data-action="admin-edit" data-id="${producto.id}">
      <img src="${escapar(producto.imagen ?? IMG_PLACEHOLDER)}" alt="" loading="lazy" />
      <span class="search-result-info">
        <span class="search-result-nombre">${escapar(producto.nombre)}</span>
        <span class="search-result-precio">${precioTexto(producto.precio)}</span>
      </span>
      <span class="search-result-editar">Editar</span>
    </button>`,
    )
    .join("");

  if (estado) estado.textContent = `${lista.length} resultado${lista.length === 1 ? "" : "s"}.`;
}

export function abrirBusquedaAdmin() {
  const input = document.getElementById("admin-search-input");
  if (input) input.value = "";
  pintarResultadosBusqueda([], "");
  abrirModal("modal-admin-busqueda");
  input?.focus();
}

function cerrarBusquedaAdmin() {
  cerrarModal("modal-admin-busqueda");
}

export function buscarAdmin(texto) {
  const termino = String(texto ?? "").trim();
  const boton = document.querySelector('[data-action="admin-close-search"]');
  if (boton) {
    boton.setAttribute("aria-label", termino ? "Borrar búsqueda" : "Cerrar búsqueda");
  }
  const buscado = normalizar(termino);
  const lista = !buscado
    ? []
    : productos
        .filter((producto) =>
          [producto.nombre, ...(producto.alias ?? [])].some((campo) =>
            normalizar(campo).includes(buscado),
          ),
        )
        .slice(0, 12);
  pintarResultadosBusqueda(lista, termino);
}

const buscarAdminConEspera = conEspera(
  () => buscarAdmin(document.getElementById("admin-search-input")?.value),
  180,
);

/* --- Sesión y delegación --- */

export async function iniciarSesionAdmin(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  if (!(formulario instanceof HTMLFormElement)) return;
  const datos = new FormData(formulario);
  const { data, error } = await obtenerSupabase().auth.signInWithPassword({
    email: datos.get("email"),
    password: datos.get("password"),
  });
  if (error) {
    mostrarMensaje(`No se pudo iniciar sesión: ${error.message}`, true);
    mostrarToast(`No se pudo iniciar sesión: ${error.message}`, true);
    return;
  }
  actualizarVistaAdmin(data.user);
}

export async function cerrarSesionAdmin() {
  await obtenerSupabase().auth.signOut();
  actualizarVistaAdmin(null);
}

async function actualizarVistaAdmin(usuario) {
  const acceso = document.getElementById("admin-acceso");
  const panel = document.getElementById("admin-panel-contenido");
  if (!acceso || !panel) return;
  const autorizado = esAdmin(usuario);
  acceso.hidden = autorizado;
  panel.hidden = !autorizado;
  const searchToggle = document.getElementById("admin-search-toggle");
  if (searchToggle) searchToggle.hidden = !autorizado;

  if (!usuario) {
    mostrarMensaje("Inicia sesión con la cuenta administradora.");
  } else if (!autorizado) {
    mostrarMensaje(`La cuenta ${usuario.email} no tiene acceso.`, true);
  } else {
    mostrarMensaje(`Sesión activa: ${usuario.email}`);
    try {
      await cargarProductosAdmin();
    } catch (error) {
      mostrarMensaje(`No se pudo cargar el catálogo: ${error.message}`, true);
      mostrarToast(`No se pudo cargar el catálogo: ${error.message}`, true);
    }
  }
}

function configurarDelegacion() {
  document.addEventListener("click", (event) => {
    /* El menú del botón flotante se cierra al tocar fuera de él. */
    if (!event.target.closest(".admin-fab")) cerrarFab();

    const el = event.target.closest("[data-action]");
    if (!el) return;
    switch (el.dataset.action) {
      case "close-modal":
        /* Solo si el clic cayó en el propio fondo: dentro de la tarjeta,
           `closest` también devuelve el backdrop y cerraría al tocar el
           contenido. */
        if (event.target === el) cerrarModalSuperior();
        break;
      case "admin-logout":
        cerrarSesionAdmin();
        break;
      case "admin-fab":
        alternarFab();
        break;
      case "admin-open-search":
        abrirBusquedaAdmin();
        break;
      case "admin-close-search": {
        /* El mismo botón borra lo escrito y, si no hay nada, cierra el buscador. */
        const inputBusqueda = document.getElementById("admin-search-input");
        if (inputBusqueda?.value) {
          inputBusqueda.value = "";
          buscarAdmin("");
          inputBusqueda.focus();
        } else {
          cerrarBusquedaAdmin();
        }
        break;
      }
      case "admin-nuevo":
        abrirEditorNuevo();
        break;
      case "admin-eliminar-todos":
        solicitarEliminarTodos();
        break;
      case "admin-eliminar": {
        const formulario = document.getElementById("admin-producto-form");
        solicitarEliminar(Number(formulario?.dataset.id));
        break;
      }
      case "admin-confirmar":
        ejecutarConfirmacion();
        break;
      case "admin-edit":
        abrirEditor(Number(el.dataset.id));
        break;
      case "admin-add-presentacion":
        document.getElementById("admin-presentaciones")?.append(crearFilaPresentacion());
        break;
      case "admin-remove-presentacion":
        el.closest(".admin-presentacion-row")?.remove();
        break;
      case "admin-limpiar-filtros":
        limpiarFiltros();
        break;
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "admin-search-input") {
      buscarAdminConEspera();
    } else if (event.target.id === "admin-confirmar-input") {
      const boton = document.getElementById("admin-confirmar-boton");
      if (boton) boton.disabled = event.target.value.trim().toUpperCase() !== "ELIMINAR";
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.matches('[data-action="admin-login-form"]')) {
      iniciarSesionAdmin(event);
    } else if (event.target.matches('[data-action="admin-product-form"]')) {
      guardarProducto(event);
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches('[data-action="admin-tipo"]')) {
      actualizarCamposLente();
    } else if (event.target.matches('[data-action="admin-foto"]')) {
      actualizarVistaPrevia(event.target);
    } else if (event.target.matches('[data-action="admin-filtro"]')) {
      leerFiltrosDeControles();
      aplicarFiltros();
    }
  });

  /* Escape resuelve una cosa a la vez: el modal de encima y, si no hay
     ninguno, el menú del botón flotante. */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (hayModalAbierto()) {
      cerrarModalSuperior();
    } else {
      cerrarFab();
    }
  });
}

export async function inicializarAdmin() {
  configurarDelegacion();
  try {
    const supabase = obtenerSupabase();
    const { data } = await supabase.auth.getSession();
    actualizarVistaAdmin(data.session?.user ?? null);
    supabase.auth.onAuthStateChange((_evento, session) => {
      actualizarVistaAdmin(session?.user ?? null);
    });
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
}
