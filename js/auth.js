import { abrirModal, cerrarModal } from "./modales.js";
import {
  CLAVE_SESION,
  claveEnvio,
  leer,
  guardar,
  borrar,
} from "./almacenamiento.js";

/**
 * El perfil se restaura de `localStorage` para que recargar no cierre la
 * sesión.
 *
 * Importante para quien siga este código: esto NO es autenticación. El JWT de
 * Google se decodifica sin verificar la firma (`parseJwt`), porque no hay
 * backend que pueda validarla. La identidad aquí es decorativa — sirve para
 * saludar por el nombre y para separar los datos de envío de dos personas que
 * comparten el celular. Nada del sistema debe confiar en este valor para
 * conceder acceso a algo.
 */
let usuarioLogueado = restaurarSesion();

function restaurarSesion() {
  const perfil = leer(CLAVE_SESION, null);
  if (!perfil || typeof perfil.email !== "string") return null;
  return perfil;
}

/* Mismo patrón que `cart:updated`: quien necesite reaccionar se suscribe, en
   vez de que auth.js llame directamente a los módulos que dependen de esto. */
function notificarSesion() {
  window.dispatchEvent(new CustomEvent("sesion:cambiada"));
}

export function getUsuarioLogueado() {
  return usuarioLogueado;
}

/* La llama `main.js` al arrancar, para pintar la sesión que se restauró. */
export function inicializarSesion() {
  actualizarInterfazUsuario();
  notificarSesion();
}

export function openLoginModal() {
  abrirModal("modal-login");
}

export function cerrarModalLogin() {
  cerrarModal("modal-login");
}

export function cerrarSesion() {
  cerrarModalPerfil();
  usuarioLogueado = null;
  borrar(CLAVE_SESION);
  actualizarInterfazUsuario();
  notificarSesion();
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("[auth] No se pudo decodificar el token de Google:", e);
    return null;
  }
}

export function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  if (!data) {
    console.warn("[auth] Token de Google inválido o incompleto.");
    return;
  }
  usuarioLogueado = {
    nombre: data.name || data.email || "Cliente",
    email: data.email || "",
    foto: data.picture || "",
  };
  guardar(CLAVE_SESION, usuarioLogueado);
  actualizarInterfazUsuario();
  notificarSesion();
  cerrarModalLogin();
}

/**
 * Pinta la entrada de perfil del encabezado.
 *
 * Sin sesión es el acceso al login; con sesión muestra foto y nombre y abre el
 * modal de perfil. El botón de cerrar sesión vive dentro de ese modal y no en
 * la barra: allí era un objetivo de 13x15 px, por debajo del mínimo de WCAG.
 */
function actualizarInterfazUsuario() {
  const container = document.getElementById("user-profile-container");
  if (!container) return;

  container.replaceChildren();

  if (!usuarioLogueado) {
    // La etiqueta se ve en el menú móvil, donde hay sitio para leerla; en la
    // barra de escritorio el CSS la oculta y queda solo el icono. El
    // `aria-label` cubre ese caso para que el botón nunca quede sin nombre.
    const btnLogin = document.createElement("button");
    btnLogin.className = "perfil-entrada perfil-entrada--invitado";
    btnLogin.dataset.action = "open-login";
    btnLogin.setAttribute("aria-label", "Iniciar sesión");
    btnLogin.title = "Iniciar sesión";
    btnLogin.innerHTML =
      '<span class="perfil-entrada-icono"><i class="fa-solid fa-user" aria-hidden="true"></i></span>';

    const texto = document.createElement("span");
    texto.className = "perfil-entrada-texto";
    texto.textContent = "Iniciar sesión";
    btnLogin.append(texto);

    container.append(btnLogin);
    return;
  }

  // El nombre, el email y la foto vienen del JWT de Google: son datos externos,
  // así que se asignan como texto/atributos y nunca interpolados en innerHTML.
  const entrada = document.createElement("button");
  entrada.className = "perfil-entrada";
  entrada.dataset.action = "open-perfil";
  // En escritorio el CSS oculta el texto y solo queda el avatar: sin esto el
  // botón se quedaría sin nombre accesible.
  entrada.setAttribute("aria-label", `Ver perfil de ${usuarioLogueado.nombre}`);
  entrada.title = "Ver perfil";

  const avatar = document.createElement("img");
  avatar.className = "user-avatar";
  avatar.src = usuarioLogueado.foto || "";
  avatar.alt = "";

  const bloque = document.createElement("span");
  bloque.className = "perfil-entrada-texto";

  const nombre = document.createElement("span");
  nombre.className = "user-name";
  nombre.textContent = usuarioLogueado.nombre.split(" ")[0];

  const ver = document.createElement("span");
  ver.className = "perfil-entrada-accion";
  ver.textContent = "Ver perfil";

  bloque.append(nombre, ver);
  entrada.append(avatar, bloque);
  container.append(entrada);
}

/** Vuelca los datos de la sesión en el modal de perfil. */
function pintarModalPerfil() {
  if (!usuarioLogueado) return;
  const foto = document.getElementById("perfil-foto");
  const nombre = document.getElementById("perfil-nombre");
  const email = document.getElementById("perfil-email");

  if (foto) {
    foto.src = usuarioLogueado.foto || "";
    foto.alt = `Foto de ${usuarioLogueado.nombre}`;
  }
  if (nombre) nombre.textContent = usuarioLogueado.nombre;
  if (email) email.textContent = usuarioLogueado.email;

  // Se lee del almacenamiento y no de checkout.js: ese módulo ya importa a
  // este, y la dependencia inversa cerraría un ciclo.
  const envio = document.getElementById("perfil-envio");
  if (envio) {
    const datos = leer(claveEnvio(usuarioLogueado.email), null);
    const direccion = datos && typeof datos.direccion === "string" ? datos.direccion.trim() : "";
    envio.textContent = direccion || "Sin dirección guardada";
  }
}

export function abrirModalPerfil() {
  if (!usuarioLogueado) return;
  pintarModalPerfil();
  abrirModal("modal-perfil");
}

export function cerrarModalPerfil() {
  cerrarModal("modal-perfil");
}

// GSI resuelve `data-callback` contra `window` en cuanto carga la librería, y
// los módulos ES se ejecutan después: la configuración del div se ignoraba
// ("callback is not a function") y el botón de Google nunca respondía. Por eso
// la inicialización se hace aquí, cuando la propia librería avisa que ya cargó.
export function inicializarGoogleLogin() {
  const config = document.getElementById("google-login-config");
  const contenedorBoton = document.getElementById("google-signin-button");
  const clientId = config?.dataset.clientId;

  if (!clientId || clientId.startsWith("TU_CLIENT_ID")) {
    console.warn(
      "[auth] Falta configurar data-client-id en #google-login-config; el login con Google está deshabilitado.",
    );
    return;
  }
  if (!window.google?.accounts?.id) return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
  });

  if (contenedorBoton) {
    window.google.accounts.id.renderButton(contenedorBoton, {
      type: "standard",
      size: "large",
      theme: "outline",
      text: "sign_in_with",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }
}

// Hook oficial de GSI: se invoca cuando la librería termina de cargar.
window.onGoogleLibraryLoad = inicializarGoogleLogin;