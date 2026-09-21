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

const ETIQUETAS_TIPO = {
  reducida: "Pupila reducida",
  estandar: "Pupila estándar",
  cosplay: "Cosplay",
  pestana: "Pestañas",
  accesorio: "Accesorio",
};

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
  tarjeta.className = "admin-producto";
  if (producto.estado === "oculto") tarjeta.classList.add("admin-producto--oculto");

  const imagen = document.createElement("img");
  imagen.className = "admin-producto-foto";
  imagen.src = producto.imagen ?? IMG_PLACEHOLDER;
  imagen.alt = "";
  imagen.loading = "lazy";
  imagen.addEventListener("error", () => {
    imagen.src = IMG_PLACEHOLDER;
  });

  const info = document.createElement("div");
  info.className = "admin-producto-info";
  const tipo = document.createElement("span");
  tipo.className = "admin-badge";
  tipo.textContent = ETIQUETAS_TIPO[producto.tipo] ?? producto.tipo;
  const nombre = document.createElement("h3");
  nombre.className = "admin-producto-nombre";
  nombre.textContent = producto.nombre;
  const precio = document.createElement("p");
  precio.className = "admin-producto-precio";
  precio.textContent = precioTexto(producto.precio);
  info.append(tipo, nombre, precio);

  const acciones = document.createElement("div");
  acciones.className = "admin-producto-acciones";

  const etiquetaEstado = document.createElement("label");
  etiquetaEstado.className = "admin-select-estado";
  const textoEstado = document.createElement("span");
  textoEstado.className = "solo-lector";
  textoEstado.textContent = `Estado de ${producto.nombre}`;
  const selector = document.createElement("select");
  selector.dataset.action = "admin-status";
  selector.dataset.id = String(producto.id);
  ESTADOS.forEach((valor) => {
    const opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = valor;
    opcion.selected = producto.estado === valor;
    selector.append(opcion);
  });
  etiquetaEstado.append(textoEstado, selector);

  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "admin-button admin-button--ghost";
  editar.dataset.action = "admin-edit";
  editar.dataset.id = String(producto.id);
  editar.textContent = "Editar";

  acciones.append(etiquetaEstado, editar);
  tarjeta.append(imagen, info, acciones);
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

const filtros = { busqueda: "", tipo: "todos", estado: "todos" };

const normalizar = (texto) =>
  String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function productosFiltrados() {
  const termino = normalizar(filtros.busqueda);
  return productos.filter((producto) => {
    if (filtros.tipo !== "todos" && producto.tipo !== filtros.tipo) return false;
    if (filtros.estado !== "todos" && producto.estado !== filtros.estado) return false;
    if (!termino) return true;
    const campos = [producto.nombre, ...(producto.alias ?? [])];
    return campos.some((campo) => normalizar(campo).includes(termino));
  });
}

function hayFiltrosActivos() {
  return Boolean(filtros.busqueda) || filtros.tipo !== "todos" || filtros.estado !== "todos";
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
  filtros.busqueda = "";
  filtros.tipo = "todos";
  filtros.estado = "todos";
  const busqueda = document.getElementById("admin-busqueda");
  if (busqueda) busqueda.value = "";
  const categoria = document.getElementById("admin-filtro-categoria");
  if (categoria) categoria.value = "todos";
  const estado = document.getElementById("admin-filtro-estado");
  if (estado) estado.value = "todos";
  aplicarFiltros();
}

function leerFiltrosDeControles() {
  filtros.busqueda = document.getElementById("admin-busqueda")?.value ?? "";
  filtros.tipo = document.getElementById("admin-filtro-categoria")?.value ?? "todos";
  filtros.estado = document.getElementById("admin-filtro-estado")?.value ?? "todos";
}

/* El buscador no filtra en cada tecla: agrupa la escritura y repinta una vez. */
function conEspera(fn, ms = 200) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), ms);
  };
}

const aplicarFiltrosConEspera = conEspera(aplicarFiltros);

async function cargarProductosAdmin() {
  mostrarMensaje("Cargando catálogo…");
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

async function actualizarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) return;
  const { error } = await obtenerSupabase()
    .from("productos")
    .update({ estado })
    .eq("id", id);
  if (error) throw error;

  const producto = productos.find((item) => item.id === id);
  if (producto) producto.estado = estado;
  pintarResumen(productos);
  mostrarMensaje("Estado actualizado.");
  window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
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

function abrirEditor(id) {
  const producto = productos.find((item) => item.id === id);
  const formulario = document.getElementById("admin-producto-form");
  if (!producto || !formulario) return;

  productoEditado = producto;
  formulario.reset();
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

  actualizarCamposLente();
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

  const id = Number(formulario.dataset.id);
  if (!Number.isInteger(id)) return;

  const boton = formulario.querySelector('button[type="submit"]');
  if (boton) boton.disabled = true;

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
      const url = await subirImagen(id, archivo);
      const previas = productoEditado?.imagenes ?? [];
      cambios.imagen = url;
      cambios.imagenes = [url, ...previas.filter((imagen) => imagen !== url)].slice(0, 4);
    }

    const { error } = await obtenerSupabase().from("productos").update(cambios).eq("id", id);
    if (error) throw error;

    cerrarModal("modal-admin-producto");
    window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
    await cargarProductosAdmin();
    mostrarMensaje(`"${cambios.nombre}" actualizado.`);
  } catch (error) {
    mostrarMensajeEditor(`No se pudo guardar: ${error.message}`, true);
  } finally {
    if (boton) boton.disabled = false;
  }
}

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
    return;
  }
  actualizarVistaAdmin(data.user);
}

export async function cerrarSesionAdmin() {
  await obtenerSupabase().auth.signOut();
  actualizarVistaAdmin(null);
}

export async function manejarEstadoAdmin(elemento) {
  try {
    await actualizarEstado(Number(elemento.dataset.id), elemento.value);
  } catch (error) {
    mostrarMensaje(`No se pudo actualizar: ${error.message}`, true);
  }
}

async function actualizarVistaAdmin(usuario) {
  const acceso = document.getElementById("admin-acceso");
  const panel = document.getElementById("admin-panel-contenido");
  if (!acceso || !panel) return;
  const autorizado = esAdmin(usuario);
  acceso.hidden = autorizado;
  panel.hidden = !autorizado;

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
    if (event.target.id === "admin-busqueda") {
      filtros.busqueda = event.target.value;
      aplicarFiltrosConEspera();
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
    if (event.target.matches('[data-action="admin-status"]')) {
      manejarEstadoAdmin(event.target);
    } else if (event.target.matches('[data-action="admin-tipo"]')) {
      actualizarCamposLente();
    } else if (event.target.matches('[data-action="admin-foto"]')) {
      actualizarVistaPrevia(event.target);
    } else if (event.target.matches('[data-action="admin-filtro"]')) {
      leerFiltrosDeControles();
      aplicarFiltros();
    }
  });

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
