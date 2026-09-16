import { bloquearScroll, desbloquearScroll } from "./scroll-lock.js";
import { CLAVE_SESION, leer, guardar, borrar } from "./almacenamiento.js";

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
  document.getElementById("modal-login").classList.add("open");
  bloquearScroll();
}

export function cerrarModalLogin() {
  const modal = document.getElementById("modal-login");
  if (!modal.classList.contains("open")) return;

  modal.classList.remove("open");
  desbloquearScroll();
}

export function cerrarSesion() {
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

function actualizarInterfazUsuario() {
  const container = document.getElementById("user-profile-container");
  if (!container) return;

  container.replaceChildren();

  if (!usuarioLogueado) {
    const btnLogin = document.createElement("button");
    btnLogin.className = "icon-btn";
    btnLogin.dataset.action = "open-login";
    btnLogin.innerHTML = '<i class="fa-solid fa-user"></i>';
    container.append(btnLogin);
    return;
  }

  // El nombre, el email y la foto vienen del JWT de Google: son datos externos,
  // así que se asignan como texto/atributos y nunca interpolados en innerHTML.
  const avatar = document.createElement("img");
  avatar.className = "user-avatar";
  avatar.src = usuarioLogueado.foto || "";
  avatar.alt = usuarioLogueado.nombre;
  avatar.title = usuarioLogueado.email;

  const nombre = document.createElement("span");
  nombre.className = "user-name";
  nombre.textContent = usuarioLogueado.nombre.split(" ")[0];

  const btnLogout = document.createElement("button");
  btnLogout.className = "btn-logout";
  btnLogout.dataset.action = "logout";
  btnLogout.title = "Cerrar sesión";
  btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';

  container.append(avatar, nombre, btnLogout);
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