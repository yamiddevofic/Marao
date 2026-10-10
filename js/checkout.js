import { getCarrito } from "./cart.js";
import { getUsuarioLogueado } from "./auth.js";
import { formatearPrecio } from "./formato.js";
import { claveEnvio, leer, guardar } from "./almacenamiento.js";
import { pagarConEpayco } from "./epayco.js";
import { abrirModal } from "./modales.js";

const ENVIO_LOCAL = 10000;
/* El envío fuera de Bogotá / Soacha no tiene tarifa fija: se acuerda con la
   clienta por WhatsApp según el destino, así que nunca se suma al total. */
const ENVIO_NACIONAL = 0;

/**
 * Datos de envío recordados entre visitas.
 *
 * Es lo que el modal de login ofrece a cambio de iniciar sesión, así que tiene
 * que cumplirse de verdad. Se guardan bajo la cuenta activa (`claveEnvio`):
 * sin sesión van a un cajón anónimo, y al entrar o salir de una cuenta el
 * formulario se repuebla con los datos de quien corresponde.
 *
 * Deliberadamente NO se guarda nada del método de pago. Los datos sensibles de
 * tarjeta se solicitan únicamente dentro del checkout hospedado de ePayco.
 */
function campoDireccion() {
  return document.getElementById("user-address-input");
}

function campoDestino() {
  return document.getElementById("shipping-city");
}

export function guardarDatosEnvio() {
  const direccion = campoDireccion();
  const destino = campoDestino();
  if (!direccion && !destino) return;

  guardar(claveEnvio(getUsuarioLogueado()?.email), {
    direccion: direccion ? direccion.value : "",
    destino: destino ? destino.value : "",
  });
}

export function restaurarDatosEnvio() {
  const direccion = campoDireccion();
  const destino = campoDestino();
  if (!direccion && !destino) return;

  const datos = leer(claveEnvio(getUsuarioLogueado()?.email), null) ?? {};

  if (direccion) {
    direccion.value = typeof datos.direccion === "string" ? datos.direccion : "";
  }

  // Ambos campos se reasignan siempre, incluso sin datos guardados. Reponer
  // solo cuando hay valor dejaría en pantalla el del cajón anterior: al entrar
  // a una cuenta sin dirección guardada, esa persona vería el destino de quien
  // usó el navegador antes — y con él, una tarifa de envío que no eligió.
  if (destino) {
    // El valor guardado solo vale si sigue siendo una opción real: si mañana
    // cambian las zonas de envío, uno viejo dejaría el <select> en un estado
    // que no corresponde a ninguna tarifa.
    const guardadoValido =
      typeof datos.destino === "string" &&
      [...destino.options].some((o) => o.value === datos.destino);

    destino.value = guardadoValido
      ? datos.destino
      : (destino.options[0]?.value ?? destino.value);
  }

  calcularCostosEnvio();
}

export function calcularCostosEnvio() {
  const subtotal = getCarrito().reduce(
    (sum, i) => sum + i.precio * i.cantidad,
    0,
  );
  const selectorEnvio = document.getElementById("shipping-city");
  if (!selectorEnvio) return;
  const costoEnvio = selectorEnvio.value === "nacional" ? ENVIO_NACIONAL : ENVIO_LOCAL;
  const totalFinal = subtotal + costoEnvio;

  document.getElementById("summary-subtotal").innerText =
    formatearPrecio(subtotal);
  document.getElementById("summary-shipping").innerText =
    selectorEnvio.value === "nacional"
      ? "A acordar por WhatsApp"
      : formatearPrecio(costoEnvio);
  document.getElementById("summary-total").innerText =
    formatearPrecio(totalFinal);

  // Sin productos no hay nada que finalizar: con el resumen en cero el botón
  // queda bloqueado hasta que el carrito vuelva a tener algo.
  const botonFinalizar = document.getElementById("btn-finalizar");
  if (botonFinalizar) botonFinalizar.disabled = subtotal === 0;
}

/** Copia el WhatsApp del vendedor al portapapeles y avisa del resultado. */
export async function copiarNumeroVendedor() {
  const numero = document
    .getElementById("comprobante-numero")
    ?.dataset.numero?.trim();
  const estado = document.getElementById("comprobante-copia-estado");
  if (!numero) return;

  try {
    await navigator.clipboard.writeText(numero);
    if (estado) estado.textContent = "Número copiado.";
  } catch (error) {
    console.warn("[checkout] No se pudo copiar el número", error);
    if (estado) {
      estado.textContent = "No se pudo copiar. Cópialo manualmente.";
    }
  }
}

/** Abre el aviso del comprobante con la nota de envío solo cuando el destino
 *  la necesita. */
function abrirAvisoComprobante() {
  const metodo =
    document.getElementById("payment-type-select")?.value ?? "tarjeta";

  // Sin pago en línea no hay "Continuar al pago": el pedido se coordina con el
  // número del vendedor.
  const botonPagar = document.getElementById("comprobante-pagar");
  if (botonPagar) botonPagar.hidden = metodo === "efectivo";

  const estado = document.getElementById("comprobante-estado");
  if (estado) estado.textContent = "";

  const copia = document.getElementById("comprobante-copia-estado");
  if (copia) copia.textContent = "";

  const nota = document.getElementById("comprobante-envio-nota");
  if (nota) {
    nota.hidden =
      document.getElementById("shipping-city")?.value !== "nacional";
  }

  abrirModal("modal-comprobante");
}

/** El pago no arranca solo: ePayco se abre cuando se pide desde el aviso, para
 *  que dé tiempo a leerlo y a copiar el número del vendedor. */
export function pagarDesdeAviso() {
  const metodo =
    document.getElementById("payment-type-select")?.value ?? "tarjeta";
  if (metodo === "efectivo") return;

  const direccionInput = document.getElementById("user-address-input");
  const direccion = direccionInput?.value.trim() ?? "";
  if (!direccion || direccion.length < 8) {
    alert("Por favor ingresa una dirección de entrega válida y completa.");
    direccionInput?.focus();
    return;
  }

  const selectorEnvio = document.getElementById("shipping-city");
  const esNacional = selectorEnvio?.value === "nacional";
  const costoEnvio = esNacional ? ENVIO_NACIONAL : ENVIO_LOCAL;
  const subtotal = getCarrito().reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );

  const estado = document.getElementById("comprobante-estado");
  if (estado) estado.textContent = "";

  try {
    pagarConEpayco({
      total: subtotal + costoEnvio,
      direccion,
      destino: selectorEnvio?.value ?? "bogota_soacha",
      metodoPago: metodo === "nequi" ? "NEQUI" : "CARD",
      costoEnvio,
    });
  } catch (error) {
    console.error("[checkout] No se pudo iniciar ePayco", error);
    const mensaje =
      error instanceof Error
        ? error.message
        : "No se pudo iniciar el pago. Intenta de nuevo.";
    if (estado) {
      estado.textContent = mensaje;
    } else {
      alert(mensaje);
    }
  }
}

export function iniciarCheckout() {
  const carrito = getCarrito();
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega algún producto antes de finalizar.");
    return;
  }

  const direccionInput = document.getElementById("user-address-input");
  const direccion = direccionInput ? direccionInput.value.trim() : "";

  if (!direccion) {
    alert("Por favor ingresa tu dirección exacta de entrega.");
    direccionInput?.focus();
    return;
  }

  if (direccion.length < 8) {
    alert(
      "Por favor ingresa una dirección de entrega válida y completa (ej. Calle 15 # 4-20 Apt 302).",
    );
    direccionInput?.focus();
    return;
  }

  // El guardado de la dirección va con espera; si se pulsa "Finalizar" justo
  // después de escribirla, esa espera aún no venció. Se fuerza aquí para que la
  // dirección que se acaba de enviar sea la que quede recordada.
  guardarDatosEnvio();

  abrirAvisoComprobante();
}
