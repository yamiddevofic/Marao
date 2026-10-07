import { exigirSupabase } from "./supabase.js";
import { formatearPrecio } from "./formato.js";
import { abrirModal, cerrarModal, cerrarModalSuperior, hayModalAbierto } from "./modales.js";

const CORREO_ADMIN = "admin@marao.co";
const ESTADOS = ["disponible", "agotado", "oculto"];
const TIPOS_LENTE = ["reducida", "estandar", "cosplay"];
const SECCIONES = { lente: "Lentes", pestana: "Pestañas", accesorio: "Accesorios" };
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
/** Subcategorías: `{ id, nombre, seccion, orden }`. */
let categorias = [];
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

const seccionDeTipo = (tipo) => (esTipoLente(tipo) ? "lente" : tipo);

/**
 * La base exige un `tipo` y para los lentes hay tres (reducida, estandar,
 * cosplay) heredados de cuando la pupila era el tipo. Hoy eso lo dice la
 * categoría, así que al guardar un lente se conserva el tipo que ya tenía y uno
 * nuevo entra como "estandar". Pestañas y accesorios: el tipo es la sección.
 */
function tipoParaSeccion(seccion) {
  if (seccion === "lente") {
    return esTipoLente(productoEditado?.tipo) ? productoEditado.tipo : "estandar";
  }
  return seccion in SECCIONES ? seccion : "";
}

const categoriasDe = (seccion) => categorias.filter((categoria) => categoria.seccion === seccion);

const nombreCategoria = (id) => categorias.find((categoria) => categoria.id === id)?.nombre ?? null;

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

const NOMBRES_ESTADO = { disponible: "Disponible", agotado: "Agotado", oculto: "Oculto" };

/**
 * Cada producto es una fila y la fila entera es el botón de editar: una sola
 * parada de tabulador por producto, y su nombre accesible ya incluye sección,
 * precio y estado.
 */
function crearFila(producto) {
  const fila = document.createElement("button");
  fila.type = "button";
  fila.className = "admin-fila";
  fila.dataset.action = "admin-edit";
  fila.dataset.id = String(producto.id);
  if (producto.estado === "oculto") fila.classList.add("admin-fila--oculto");

  const imagen = document.createElement("img");
  imagen.className = "admin-fila-foto";
  imagen.src = producto.imagen ?? IMG_PLACEHOLDER;
  imagen.alt = "";
  imagen.loading = "lazy";
  imagen.addEventListener("error", () => {
    imagen.src = IMG_PLACEHOLDER;
  });

  const info = document.createElement("span");
  info.className = "admin-fila-info";
  const nombre = document.createElement("span");
  nombre.className = "admin-fila-nombre";
  nombre.textContent = producto.nombre;
  const meta = document.createElement("span");
  meta.className = "admin-fila-meta";
  meta.textContent = [SECCIONES[seccionDeTipo(producto.tipo)], nombreCategoria(producto.categoria_id)]
    .filter(Boolean)
    .join(" · ");
  info.append(nombre, meta);

  const precio = document.createElement("span");
  precio.className = "admin-fila-precio";
  precio.textContent = precioTexto(producto.precio);

  const estado = document.createElement("span");
  const claveEstado = producto.estado in NOMBRES_ESTADO ? producto.estado : "disponible";
  estado.className = `admin-estado admin-estado--${claveEstado}`;
  estado.textContent = NOMBRES_ESTADO[claveEstado];

  const flecha = document.createElement("span");
  flecha.className = "admin-fila-flecha";
  flecha.setAttribute("aria-hidden", "true");
  flecha.textContent = "›";

  fila.append(imagen, info, precio, estado, flecha);
  return fila;
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

  lista.forEach((producto) => contenedor.append(crearFila(producto)));
}

/* --- Filtros del catálogo --- */

const filtros = { seccion: "todos", categoria: "todos", color: "todos", estado: "todos" };

const normalizar = (texto) =>
  String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function productosFiltrados() {
  return productos.filter((producto) => {
    if (filtros.seccion !== "todos" && seccionDeTipo(producto.tipo) !== filtros.seccion) return false;
    if (filtros.categoria === "sin" && producto.categoria_id != null) return false;
    if (
      filtros.categoria !== "todos" &&
      filtros.categoria !== "sin" &&
      String(producto.categoria_id) !== filtros.categoria
    ) {
      return false;
    }
    if (filtros.color !== "todos" && producto.color !== filtros.color) return false;
    if (filtros.estado !== "todos" && producto.estado !== filtros.estado) return false;
    return true;
  });
}

function hayFiltrosActivos() {
  return Object.values(filtros).some((valor) => valor !== "todos");
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
  Object.keys(filtros).forEach((clave) => {
    filtros[clave] = "todos";
  });
  const seccion = document.getElementById("admin-filtro-seccion");
  if (seccion) seccion.value = "todos";
  const subcategoria = document.getElementById("admin-filtro-subcategoria");
  if (subcategoria) subcategoria.value = "todos";
  const color = document.getElementById("admin-filtro-color");
  if (color) color.value = "todos";
  const estado = document.getElementById("admin-filtro-estado");
  if (estado) estado.value = "todos";
  ajustarFiltrosASeccion();
  aplicarFiltros();
}

function leerFiltrosDeControles() {
  filtros.seccion = document.getElementById("admin-filtro-seccion")?.value ?? "todos";
  filtros.categoria = document.getElementById("admin-filtro-subcategoria")?.value ?? "todos";
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

async function cargarCategoriasAdmin() {
  const { data, error } = await obtenerSupabase()
    .from("categorias")
    .select("id, nombre, seccion, orden")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  categorias = data ?? [];
  ajustarFiltrosASeccion();
}

/**
 * Los filtros dependen de la sección elegida: el de categoría solo ofrece las
 * de esa sección (y desaparece si no tiene ninguna) y el de color solo tiene
 * sentido en Lentes, los únicos productos con tono. Un filtro oculto vuelve a
 * "todos" para no seguir filtrando sin que se vea.
 */
function ajustarFiltrosASeccion() {
  const seccion = filtros.seccion;

  const select = document.getElementById("admin-filtro-subcategoria");
  if (select) {
    const actual = select.value;
    select.replaceChildren(new Option("Categoría", "todos"), new Option("Sin categoría", "sin"));
    if (seccion === "todos") {
      Object.entries(SECCIONES).forEach(([clave, titulo]) => {
        const lista = categoriasDe(clave);
        if (lista.length === 0) return;
        const grupo = document.createElement("optgroup");
        grupo.label = titulo;
        lista.forEach((categoria) => grupo.append(new Option(categoria.nombre, String(categoria.id))));
        select.append(grupo);
      });
    } else {
      categoriasDe(seccion).forEach((categoria) =>
        select.append(new Option(categoria.nombre, String(categoria.id))),
      );
    }
    const hayCategorias =
      seccion === "todos" ? categorias.length > 0 : categoriasDe(seccion).length > 0;
    const campo = select.closest(".admin-campo");
    if (campo) campo.hidden = !hayCategorias;
    select.value =
      hayCategorias && [...select.options].some((opcion) => opcion.value === actual)
        ? actual
        : "todos";
    filtros.categoria = select.value;
  }

  const color = document.getElementById("admin-filtro-color");
  if (color) {
    const conColor = seccion === "todos" || seccion === "lente";
    const campo = color.closest(".admin-campo");
    if (campo) campo.hidden = !conColor;
    if (!conColor) color.value = "todos";
    filtros.color = color.value;
  }
}

async function cargarProductosAdmin() {
  mostrarMensaje("Cargando catálogo…");
  pintarCargando();
  await cargarCategoriasAdmin();
  const { data, error } = await obtenerSupabase()
    .from("productos")
    .select(
      "id, nombre, descripcion, precio, tipo, color, cobertura, borde, efecto, alias, presentaciones, imagen, imagenes, estado, orden, categoria_id",
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

/**
 * El selector solo ofrece las categorías de la sección elegida. Conserva la
 * elección actual si sigue siendo válida; al cambiar de sección se limpia.
 */
function poblarSelectCategoria(seleccionada) {
  const select = document.getElementById("admin-categoria-id");
  const seccion = document.getElementById("admin-seccion")?.value;
  if (!select) return;
  const valor = String(seleccionada ?? select.value ?? "");
  select.replaceChildren(new Option("Sin categoría", ""));
  categoriasDe(seccion).forEach((categoria) =>
    select.append(new Option(categoria.nombre, String(categoria.id))),
  );
  select.value = [...select.options].some((opcion) => opcion.value === valor) ? valor : "";
}

function actualizarCamposLente() {
  const bloque = document.getElementById("admin-campos-lente");
  const seccion = document.getElementById("admin-seccion")?.value;
  if (bloque) bloque.hidden = seccion !== "lente";
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
  formulario.elements.seccion.value = seccionDeTipo(producto.tipo ?? "accesorio");
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
  poblarSelectCategoria(producto.categoria_id);
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
  poblarSelectCategoria("");
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
      tipo: tipoParaSeccion(String(datos.get("seccion") ?? "")),
      estado: String(datos.get("estado") ?? "disponible"),
      orden: datos.get("orden") === "" ? null : Number(datos.get("orden")),
      categoria_id: Number(datos.get("categoria_id")) || null,
    };

    if (!cambios.nombre) throw new Error("El nombre no puede quedar vacío.");
    if (!cambios.tipo) throw new Error("Selecciona una sección válida.");
    if (
      cambios.categoria_id !== null &&
      !categoriasDe(seccionDeTipo(cambios.tipo)).some((item) => item.id === cambios.categoria_id)
    ) {
      throw new Error("La categoría elegida no pertenece a esa sección.");
    }
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

/* --- Administrador de categorías --- */

function mostrarMensajeCategorias(mensaje, error = false) {
  const elemento = document.getElementById("admin-categorias-mensaje");
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.classList.toggle("admin-mensaje--error", error);
}

const cuentaProductos = (id) => productos.filter((producto) => producto.categoria_id === id).length;

function crearFilaCategoria(categoria, indice, total) {
  const fila = document.createElement("div");
  fila.className = "admin-categoria-fila";

  const campo = document.createElement("label");
  campo.className = "admin-campo";
  const etiqueta = document.createElement("span");
  etiqueta.className = "solo-lector";
  etiqueta.textContent = `Nombre de la categoría ${categoria.nombre}`;
  const input = document.createElement("input");
  input.type = "text";
  input.value = categoria.nombre;
  input.maxLength = 40;
  input.dataset.action = "admin-categoria-nombre";
  input.dataset.id = String(categoria.id);
  campo.append(etiqueta, input);

  const cuenta = document.createElement("span");
  cuenta.className = "admin-categoria-cuenta";
  const n = cuentaProductos(categoria.id);
  cuenta.textContent = `${n} producto${n === 1 ? "" : "s"}`;

  const boton = (accion, texto, etiquetaAria, deshabilitado = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "admin-icon-button";
    b.dataset.action = accion;
    b.dataset.id = String(categoria.id);
    b.setAttribute("aria-label", `${etiquetaAria} ${categoria.nombre}`);
    b.textContent = texto;
    b.disabled = deshabilitado;
    return b;
  };

  fila.append(
    campo,
    cuenta,
    boton("admin-categoria-subir", "↑", "Subir", indice === 0),
    boton("admin-categoria-bajar", "↓", "Bajar", indice === total - 1),
    boton("admin-categoria-eliminar", "×", "Eliminar"),
  );
  return fila;
}

function pintarCategorias() {
  const contenedor = document.getElementById("admin-categorias-lista");
  if (!contenedor) return;
  contenedor.replaceChildren();

  Object.entries(SECCIONES).forEach(([seccion, titulo]) => {
    const grupo = document.createElement("section");
    grupo.className = "admin-categorias-grupo";
    const encabezado = document.createElement("h3");
    encabezado.textContent = titulo;
    grupo.append(encabezado);

    const lista = categoriasDe(seccion);
    if (lista.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "admin-vacio";
      vacio.textContent = "Aún no hay categorías.";
      grupo.append(vacio);
    }
    lista.forEach((categoria, indice) =>
      grupo.append(crearFilaCategoria(categoria, indice, lista.length)),
    );
    contenedor.append(grupo);
  });
}

function abrirCategorias() {
  mostrarMensajeCategorias("");
  pintarCategorias();
  abrirModal("modal-admin-categorias");
}

/** Tras cambiar categorías se repinta todo lo que depende de ellas. */
async function refrescarCategorias() {
  await cargarCategoriasAdmin();
  pintarCategorias();
  aplicarFiltros();
  window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
}

function mensajeErrorCategoria(error) {
  // 23505: el índice único (sección + nombre) impide repetir una categoría.
  return error?.code === "23505"
    ? "Ya existe una categoría con ese nombre en esa sección."
    : `No se pudo guardar: ${error.message}`;
}

async function crearCategoria(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const datos = new FormData(formulario);
  const nombre = String(datos.get("nombre") ?? "").trim();
  const seccion = String(datos.get("seccion") ?? "");
  if (!nombre) return mostrarMensajeCategorias("Escribe un nombre.", true);
  if (!(seccion in SECCIONES)) return mostrarMensajeCategorias("Elige una sección.", true);

  const restaurarBoton = ocuparBoton(formulario.querySelector('button[type="submit"]'), "Agregando…");
  try {
    const orden = Math.max(0, ...categoriasDe(seccion).map((categoria) => categoria.orden)) + 1;
    const { error } = await obtenerSupabase().from("categorias").insert({ nombre, seccion, orden });
    if (error) throw error;
    formulario.elements.nombre.value = "";
    await refrescarCategorias();
    mostrarMensajeCategorias(`"${nombre}" agregada.`);
    mostrarToast(`Categoría "${nombre}" agregada.`);
  } catch (error) {
    mostrarMensajeCategorias(mensajeErrorCategoria(error), true);
  } finally {
    restaurarBoton();
  }
}

async function renombrarCategoria(id, input) {
  const categoria = categorias.find((item) => item.id === id);
  if (!categoria) return;
  const nombre = input.value.trim();
  if (!nombre || nombre === categoria.nombre) {
    input.value = categoria.nombre;
    return;
  }
  try {
    const { error } = await obtenerSupabase().from("categorias").update({ nombre }).eq("id", id);
    if (error) throw error;
    await refrescarCategorias();
    mostrarMensajeCategorias("Nombre actualizado.");
  } catch (error) {
    input.value = categoria.nombre;
    mostrarMensajeCategorias(mensajeErrorCategoria(error), true);
  }
}

/** Intercambia el lugar con la vecina y reescribe `orden` solo donde cambió. */
async function moverCategoria(id, delta) {
  const categoria = categorias.find((item) => item.id === id);
  if (!categoria) return;
  const lista = categoriasDe(categoria.seccion);
  const desde = lista.findIndex((item) => item.id === id);
  const hasta = desde + delta;
  if (hasta < 0 || hasta >= lista.length) return;

  const nueva = lista.toSpliced(desde, 1).toSpliced(hasta, 0, categoria);
  const cambios = nueva
    .map((item, indice) => ({ id: item.id, orden: indice + 1, anterior: item.orden }))
    .filter((item) => item.orden !== item.anterior);

  try {
    const resultados = await Promise.all(
      cambios.map(({ id: idCategoria, orden }) =>
        obtenerSupabase().from("categorias").update({ orden }).eq("id", idCategoria),
      ),
    );
    const fallo = resultados.find((resultado) => resultado.error);
    if (fallo) throw fallo.error;
    await refrescarCategorias();
  } catch (error) {
    mostrarMensajeCategorias(`No se pudo reordenar: ${error.message}`, true);
  }
}

async function eliminarCategoria(id) {
  try {
    const { error } = await obtenerSupabase().from("categorias").delete().eq("id", id);
    if (error) throw error;
    // Sus productos quedaron sin categoría en la base: se recargan para verlo.
    await cargarProductosAdmin();
    pintarCategorias();
    window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
    mostrarMensajeCategorias("Categoría eliminada.");
    mostrarToast("Categoría eliminada.");
  } catch (error) {
    mostrarMensajeCategorias(`No se pudo eliminar: ${error.message}`, true);
  }
}

function solicitarEliminarCategoria(id) {
  const categoria = categorias.find((item) => item.id === id);
  if (!categoria) return;
  const n = cuentaProductos(id);
  abrirConfirmacion({
    titulo: "Eliminar categoría",
    mensaje:
      n > 0
        ? `Se eliminará "${categoria.nombre}". Sus ${n} producto${n === 1 ? "" : "s"} no se borran: quedan sin categoría.`
        : `Se eliminará "${categoria.nombre}".`,
    alConfirmar: () => eliminarCategoria(id),
  });
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
  const logoutToggle = document.getElementById("admin-logout-toggle");
  if (logoutToggle) logoutToggle.hidden = !autorizado;

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
      case "admin-categorias":
        abrirCategorias();
        break;
      case "admin-categoria-subir":
        moverCategoria(Number(el.dataset.id), -1);
        break;
      case "admin-categoria-bajar":
        moverCategoria(Number(el.dataset.id), 1);
        break;
      case "admin-categoria-eliminar":
        solicitarEliminarCategoria(Number(el.dataset.id));
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
    } else if (event.target.matches('[data-action="admin-categoria-form"]')) {
      crearCategoria(event);
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches('[data-action="admin-seccion"]')) {
      actualizarCamposLente();
      poblarSelectCategoria();
    } else if (event.target.matches('[data-action="admin-foto"]')) {
      actualizarVistaPrevia(event.target);
    } else if (event.target.matches('[data-action="admin-categoria-nombre"]')) {
      renombrarCategoria(Number(event.target.dataset.id), event.target);
    } else if (event.target.matches('[data-action="admin-filtro"]')) {
      leerFiltrosDeControles();
      ajustarFiltrosASeccion();
      aplicarFiltros();
    }
  });

  /* Escape cierra solo el modal de encima, no toda la pila. */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hayModalAbierto()) cerrarModalSuperior();
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
