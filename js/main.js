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
} from "./auth.js";

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

  switch (el.dataset.action) {
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
  actualizarCatalogoLentes();
  renderAccesorios(getAccesorios());
  actualizarBadge();
  // Pinta la sesión restaurada y emite `sesion:cambiada`, que a su vez repuebla
  // los datos de envío y recalcula el resumen.
  inicializarSesion();
});