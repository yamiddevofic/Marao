let usuarioLogueado = null;

export function getUsuarioLogueado() {
  return usuarioLogueado;
}

export function openLoginModal() {
  document.getElementById("modal-login").classList.add("open");
}

export function cerrarModalLogin() {
  document.getElementById("modal-login").classList.remove("open");
}

export function cerrarSesion() {
  usuarioLogueado = null;
  actualizarInterfazUsuario();
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
    nombre: data.name,
    email: data.email,
    foto: data.picture,
  };
  actualizarInterfazUsuario();
  cerrarModalLogin();
}

function actualizarInterfazUsuario() {
  const container = document.getElementById("user-profile-container");
  if (!container) return;

  if (usuarioLogueado) {
    container.innerHTML = `
      <img src="${usuarioLogueado.foto}" alt="${usuarioLogueado.nombre}" class="user-avatar" title="${usuarioLogueado.email}">
      <span class="user-name">${usuarioLogueado.nombre.split(" ")[0]}</span>
      <button class="btn-logout" data-action="logout" title="Cerrar sesión"><i class="fa-solid fa-right-from-bracket"></i></button>
    `;
  } else {
    container.innerHTML = `<button class="icon-btn" data-action="open-login"><i class="fa-solid fa-user"></i></button>`;
  }
}

window.handleCredentialResponse = handleCredentialResponse;