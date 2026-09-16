import { getAccesorios } from "./productos.js";
import {
  renderAccesorios,
  filtrarLentes,
  actualizarCatalogoLentes,
  irAPaginaLentes,
  abrirModalDetalle,
  cerrarModalDetalle,
  modificarCantidadModal,
  agregarDesdeModal,
} from "./catalog.js";
import {
  agregarAlCarrito,
  eliminarDelCarrito,
  cambiarCantidadCart,
  getCarrito,
} from "./cart.js";
import { mostrarSeccion } from "./ui.js";
import { cerrarModalSuperior, hayModalAbierto } from "./modales.js";
import { desplazarCarruselPestanas } from "./carrusel.js";
import {
  enviarPedidoWhatsApp,
  calcularCostosEnvio,
  guardarDatosEnvio,
  restaurarDatosEnvio,
} from "./checkout.js";
import {
  openLoginModal,
  cerrarModalLogin,
  cerrarSesion,
  inicializarSesion,
  abrirModalPerfil,
  cerrarModalPerfil,
} from "./auth.js";

/**
 * Menú de navegación en móvil.
 *
 * En escritorio el CSS lo muestra siempre y esconde el botón, así que esta
 * función solo actúa donde el hamburguesa existe. El estado vive en la clase
 * `.abierto` y se refleja en `aria-expanded` para quien use lector de pantalla.
 */
/* Único breakpoint del proyecto (AGENTS.md). El grupo de utilidades no se
   duplica en el markup: se muda entre la barra superior y el menú según de qué
   lado de este breakpoint estemos. */
const ESCRITORIO = window.matchMedia("(min-width: 769px)");

/**
 * Reubica carrito y perfil: dentro del menú en móvil, en la barra superior en
 * escritorio. Mover el nodo en vez de repetirlo mantiene una sola fuente de
 * verdad — `auth.js` reescribe `#user-profile-container` y un id duplicado lo
 * rompería.
 */
function ubicarPerfil() {
  const grupo = document.getElementById("user-profile-container");
  const destino = document.getElementById(
    ESCRITORIO.matches ? "perfil-slot-bar" : "perfil-slot-menu",
  );
  if (!grupo || !destino || grupo.parentElement === destino) return;
  destino.append(grupo);
}

function sincronizarConAnchura() {
  ubicarPerfil();
  // Al pasar a escritorio el menú deja de estar plegado: si quedó abierto, su
  // estado y el `aria-expanded` del botón se quedarían desfasados.
  if (ESCRITORIO.matches) alternarMenu(true);
}

/* Se escucha el cambio de breakpoint y además `resize` como red de seguridad:
   el evento de matchMedia no llega en todos los entornos, y si se pierde el
   perfil se queda en el lado equivocado tapando el logo. `sincronizarConAnchura`
   es idempotente y sale sin tocar el DOM cuando ya está donde toca, así que
   repetirla no cuesta. */
ESCRITORIO.addEventListener("change", sincronizarConAnchura);
window.addEventListener("resize", sincronizarConAnchura);

function alternarMenu(forzarCerrado = false) {
  const nav = document.getElementById("main-nav");
  const boton = document.querySelector(".menu-toggle");
  if (!nav || !boton) return;

  const abierto = forzarCerrado ? false : !nav.classList.contains("abierto");
  nav.classList.toggle("abierto", abierto);
  boton.setAttribute("aria-expanded", String(abierto));
  boton.setAttribute(
    "aria-label",
    abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación",
  );
}

function actualizarBadge() {
  const total = getCarrito().reduce((sum, i) => sum + i.cantidad, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = String(total);
}

const IMG_PLACEHOLDER = "assets/img/placeholder-producto.svg";

document.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.fallbackAplicado === "true") return;
    img.dataset.fallbackAplicado = "true";

    // Dentro de un <picture>, los <source> mandan sobre el src del <img>: si no
    // se quitan, el navegador vuelve a elegir el formato que acaba de fallar y
    // el placeholder no llegaría a verse nunca.
    img.closest("picture")?.querySelectorAll("source").forEach((s) => s.remove());

    img.src = IMG_PLACEHOLDER;
  },
  true,
);

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;

  const id = Number(el.dataset.id);

  // Cualquier acción lanzada desde dentro del panel lo cierra: navegar, ir al
  // carrito o abrir el login dejaban el desplegable encima de la vista.
  if (el.closest("#main-nav")) alternarMenu(true);

  switch (el.dataset.action) {
    case "close-modal":
      /* Solo si el clic cayó en el propio fondo: dentro de la tarjeta, `closest`
         también devuelve el backdrop y cerraría el modal al tocar su contenido. */
      if (event.target === el) cerrarModalSuperior();
      break;
    case "toggle-menu":
      alternarMenu();
      break;
    case "open-perfil":
      abrirModalPerfil();
      break;
    case "close-perfil":
      cerrarModalPerfil();
      break;
    case "mostrar-seccion":
      mostrarSeccion(el.dataset.view);
      break;
    case "open-login":
      openLoginModal();
      break;
    case "close-login":
      cerrarModalLogin();
      break;
    case "logout":
      cerrarSesion();
      break;
    case "filtrar-lentes":
      filtrarLentes(el.dataset.filter, el.dataset.group);
      break;
    case "pagina-lentes":
      irAPaginaLentes(el.dataset.pagina);
      break;
    case "open-detail":
      abrirModalDetalle(id);
      break;
    case "close-detail":
      cerrarModalDetalle();
      break;
    case "qty-modal":
      modificarCantidadModal(Number(el.dataset.delta));
      break;
    case "add-modal":
      agregarDesdeModal();
      break;
    case "add-to-cart":
      agregarAlCarrito(id);
      mostrarSeccion("carrito");
      break;
    case "remove-item":
      eliminarDelCarrito(id);
      break;
    case "change-qty":
      cambiarCantidadCart(id, Number(el.dataset.delta));
      break;
    case "carrusel-pestanas":
      desplazarCarruselPestanas(Number(el.dataset.delta));
      break;
    case "checkout":
      enviarPedidoWhatsApp();
      break;
    default:
      console.warn(`[ui] Acción desconocida: ${el.dataset.action}`);
  }
});

/* La dirección se guarda mientras se escribe: sin espera, cada tecla sería una
   escritura a localStorage y una serialización JSON completa. */
function conEspera(fn, ms = 400) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), ms);
  };
}

const guardarDireccionConEspera = conEspera(guardarDatosEnvio);

document.addEventListener("change", (event) => {
  if (event.target.id === "shipping-city") {
    calcularCostosEnvio();
    guardarDatosEnvio();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "user-address-input") {
    guardarDireccionConEspera();
  }
});

/* Escape resuelve una cosa a la vez, de arriba abajo: el modal que está encima
   y, si no hay ninguno, el menú desplegable. Con un único punto de decisión no
   puede pasar que una pulsación cierre el modal y además el menú de debajo. */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (hayModalAbierto()) {
    cerrarModalSuperior();
  } else if (document.getElementById("main-nav")?.classList.contains("abierto")) {
    alternarMenu(true);
  }
});

window.addEventListener("cart:updated", () => {
  actualizarBadge();
  calcularCostosEnvio();
});

/* Al entrar o salir de una cuenta cambia el cajón de datos de envío, así que
   el formulario se repuebla con los de quien corresponda. */
window.addEventListener("sesion:cambiada", () => {
  restaurarDatosEnvio();
});

document.addEventListener("DOMContentLoaded", () => {
  ubicarPerfil();
  actualizarCatalogoLentes();
  renderAccesorios(getAccesorios());
  actualizarBadge();
  // Pinta la sesión restaurada y emite `sesion:cambiada`, que a su vez repuebla
  // los datos de envío y recalcula el resumen.
  inicializarSesion();
});