import { exigirSupabase } from "./supabase.js";

const CORREO_ADMIN = "admin@marao.com";
const ESTADOS = ["disponible", "agotado", "oculto"];

function obtenerSupabase() {
  return exigirSupabase();
}

function esAdmin(usuario) {
  return usuario?.email?.toLowerCase() === CORREO_ADMIN;
}

function mostrarMensaje(mensaje, error = false) {
  const elemento = document.getElementById("admin-mensaje") ?? document.getElementById("admin-estado");
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.classList.toggle("admin-mensaje--error", error);
}

function pintarFilas(productos) {
  const cuerpo = document.getElementById("admin-productos");
  if (!cuerpo) return;
  cuerpo.replaceChildren();

  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    const nombre = document.createElement("td");
    nombre.textContent = producto.nombre;
    const tipo = document.createElement("td");
    tipo.textContent = producto.tipo;
    const estado = document.createElement("td");
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
    estado.append(selector);
    fila.append(nombre, tipo, estado);
    cuerpo.append(fila);
  });
}

async function cargarProductosAdmin() {
  const { data, error } = await obtenerSupabase()
    .from("productos")
    .select("id, nombre, tipo, estado")
    .order("tipo", { ascending: true })
    .order("nombre", { ascending: true });
  if (error) throw error;
  pintarFilas(data ?? []);
}

async function actualizarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) return;
  const { error } = await obtenerSupabase()
    .from("productos")
    .update({ estado })
    .eq("id", id);
  if (error) throw error;
  mostrarMensaje("Estado actualizado.");
  window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
}

export async function iniciarSesionAdmin() {
  const { error } = await obtenerSupabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
  if (error) mostrarMensaje(error.message, true);
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

export async function inicializarAdmin() {
  const supabase = obtenerSupabase();
  const { data } = await supabase.auth.getSession();
  actualizarVistaAdmin(data.session?.user ?? null);
  supabase.auth.onAuthStateChange((_evento, session) => {
    actualizarVistaAdmin(session?.user ?? null);
  });
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
