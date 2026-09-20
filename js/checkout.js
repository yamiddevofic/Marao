import { getCarrito } from "./cart.js";
import { getUsuarioLogueado } from "./auth.js";
import { formatearPrecio } from "./formato.js";
import { claveEnvio, leer, guardar } from "./almacenamiento.js";

const ENVIO_LOCAL = 10000;
const ENVIO_NACIONAL = 22000;

/**
 * Datos de envío recordados entre visitas.
 *
 * Es lo que el modal de login ofrece a cambio de iniciar sesión, así que tiene
 * que cumplirse de verdad. Se guardan bajo la cuenta activa (`claveEnvio`):
 * sin sesión van a un cajón anónimo, y al entrar o salir de una cuenta el
 * formulario se repuebla con los datos de quien corresponde.
 *
 * Deliberadamente NO se guarda nada del método de pago. Los campos de tarjeta
 * ya se piden sin procesarlos (ver la deuda registrada en AGENTS.md);
 * persistirlos agravaría el problema en vez de acotarlo.
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
    formatearPrecio(costoEnvio);
  document.getElementById("summary-total").innerText =
    formatearPrecio(totalFinal);
}

export function enviarPedidoWhatsApp() {
  const carrito = getCarrito();
  const usuarioLogueado = getUsuarioLogueado();

  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega algún producto antes de finalizar.");
    return;
  }

  const direccionInput = document.getElementById("user-address-input");
  const direccion = direccionInput ? direccionInput.value.trim() : "";

  if (!direccion) {
    alert("Por favor ingresa tu dirección exacta de entrega.");
    if (direccionInput) direccionInput.focus();
    return;
  }

  if (direccion.length < 8) {
    alert(
      "Por favor ingresa una dirección de entrega válida y completa (ej. Calle 15 # 4-20 Apt 302).",
    );
    direccionInput.focus();
    return;
  }

  const selectorMetodoPago = document.getElementById(
    "payment-type-select",
  ).value;

  const selectorEnvio = document.getElementById("shipping-city").value;
  const costoEnvio = selectorEnvio === "nacional" ? ENVIO_NACIONAL : ENVIO_LOCAL;
  const textoEnvio =
    selectorEnvio === "nacional"
      ? "A toda Colombia"
      : "Bogotá / Soacha";
  const textoMetodoPago = {
    tarjeta: "Tarjeta de crédito o débito",
    nequi: "Nequi",
    efectivo: "Pago contraentrega",
  }[selectorMetodoPago] ?? selectorMetodoPago;

  let subtotal = 0;
  let lineas = [];

  lineas.push("*PEDIDO NUEVO - MARÃO*");
  lineas.push("");
  lineas.push(`*Cliente:* ${usuarioLogueado?.nombre ?? "Cliente sin iniciar sesión"}`);
  lineas.push("");
  lineas.push("*PRODUCTOS*");

  carrito.forEach((item) => {
    const totalProd = item.precio * item.cantidad;
    subtotal += totalProd;
    lineas.push(`- ${item.nombre}`);
    lineas.push(`  Cantidad: ${item.cantidad} | Subtotal: ${formatearPrecio(totalProd)}`);
  });

  const totalFinal = subtotal + costoEnvio;

  lineas.push("");
  lineas.push("*ENTREGA*");
  lineas.push(`Destino: ${textoEnvio}`);
  lineas.push(`Dirección: ${direccion}`);
  lineas.push("");
  lineas.push("*PAGO*");
  lineas.push(`Método: ${textoMetodoPago}`);
  lineas.push("");
  lineas.push("*RESUMEN*");
  lineas.push(`Subtotal productos: ${formatearPrecio(subtotal)}`);
  lineas.push(`Envío: ${formatearPrecio(costoEnvio)}`);
  lineas.push(`*TOTAL: ${formatearPrecio(totalFinal)}*`);
  lineas.push("");
  lineas.push("Pendiente de confirmar disponibilidad y entrega.");

  const mensajeTexto = lineas.join("\n");
  const urlWA = `https://wa.me/573243744983?text=${encodeURIComponent(mensajeTexto)}`;

  // El guardado de la dirección va con espera; si se pulsa "Finalizar" justo
  // después de escribirla, esa espera aún no venció. Se fuerza aquí para que la
  // dirección que se acaba de enviar sea la que quede recordada.
  guardarDatosEnvio();

  window.open(urlWA, "_blank");
}
