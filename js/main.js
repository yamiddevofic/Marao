import { productosBase, PRECIO_LENTES } from "./productos.js";
import {
  renderLentes,
  renderAccesorios,
  filtrarLentes,
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
import {
  enviarPedidoWhatsApp,
  calcularCostosEnvio,
  detectarTipoTarjeta,
  formatearFechaExp,
  togglePaymentInputs,
} from "./checkout.js";
import {
  openLoginModal,
  cerrarModalLogin,
  cerrarSesion,
} from "./auth.js";

function actualizarBadge() {
  const total = getCarrito().reduce((sum, i) => sum + i.cantidad, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = String(total);
}

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
      filtrarLentes(el.dataset.filter);
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
    case "checkout":
      enviarPedidoWhatsApp();
      break;
    default:
      console.warn(`[ui] Acción desconocida: ${el.dataset.action}`);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "shipping-city") {
    calcularCostosEnvio();
  } else if (event.target.id === "payment-type-select") {
    togglePaymentInputs();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "card-number-input") {
    detectarTipoTarjeta(event.target);
  } else if (event.target.id === "card-expiry-input") {
    formatearFechaExp(event.target);
  }
});

window.addEventListener("cart:updated", () => {
  actualizarBadge();
  calcularCostosEnvio();
});

document.addEventListener("DOMContentLoaded", () => {
  renderLentes(productosBase.filter((p) => p.precio === PRECIO_LENTES));
  renderAccesorios(productosBase.filter((p) => p.id >= 101));
  actualizarBadge();
  calcularCostosEnvio();
});