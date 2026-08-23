import { getCarrito } from "./cart.js";
import { getUsuarioLogueado } from "./auth.js";
import { formatearPrecio } from "./formato.js";

const ENVIO_LOCAL = 10000;
const ENVIO_NACIONAL = 22000;

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

export function detectarTipoTarjeta(input) {
  // Nequi se elige en el selector de método de pago: detectarlo por el prefijo
  // hacía que un celular 34x/37x se marcara como American Express.
  const metodoPago = document.getElementById("payment-type-select")?.value;
  let valor = input.value.replace(/\D/g, "");
  let valorFormateado = valor.match(/.{1,4}/g)?.join(" ") || "";
  input.value = valorFormateado;

  const badge = document.getElementById("card-brand-badge");
  const label = document.getElementById("card-detected-label");
  if (!badge || !label) return;

  badge.className = "card-badge-dynamic";

  if (valor.length === 0) {
    badge.innerText = "DESCONOCIDO";
    label.innerText = "Escribe los dígitos para detectar el tipo";
    return;
  }

  if (metodoPago === "nequi") {
    badge.innerText = "NEQUI";
    badge.classList.add("nequi");
    label.innerText =
      valor.length === 10
        ? "Número de Nequi Registrado ✔️"
        : "El número de Nequi debe tener 10 dígitos";
  } else if (/^4/.test(valor)) {
    badge.innerText = "VISA";
    badge.classList.add("visa");
    label.innerText = "Tarjeta Visa (Débito/Crédito) Detectada ✔️";
  } else if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(valor)) {
    badge.innerText = "MASTERCARD";
    badge.classList.add("mastercard");
    label.innerText = "Tarjeta MasterCard Detectada ✔️";
  } else if (/^3[47]/.test(valor)) {
    badge.innerText = "AMEX";
    badge.classList.add("amex");
    label.innerText = "American Express Detectada ✔️";
  } else {
    badge.innerText = "OTRA";
    label.innerText = "Tarjeta de Crédito / Débito Genérica";
  }
}

export function formatearFechaExp(input) {
  let valor = input.value.replace(/\D/g, "").slice(0, 4);
  if (valor.length >= 3) {
    valor = valor.slice(0, 2) + "/" + valor.slice(2);
  }
  input.value = valor;
}

export function togglePaymentInputs() {
  const method = document.getElementById("payment-type-select").value;
  const cardBox = document.getElementById("card-input-box");
  const cardInput = document.getElementById("card-number-input");
  if (!cardBox || !cardInput) return;

  if (method === "efectivo") {
    cardBox.style.display = "none";
  } else {
    cardBox.style.display = "block";
    cardInput.placeholder =
      method === "nequi" ? "300 123 4567" : "4000 1234 5678 9010";
  }
  detectarTipoTarjeta(cardInput);
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
  const cardInput = document.getElementById("card-number-input");
  const numTarjeta = cardInput ? cardInput.value.trim() : "";
  const tipoTarjeta = document.getElementById("card-brand-badge")
    ? document.getElementById("card-brand-badge").innerText
    : "";

  if (selectorMetodoPago !== "efectivo") {
    if (!numTarjeta) {
      alert("Por favor ingresa el número de tu tarjeta o cuenta.");
      cardInput.focus();
      return;
    }

    const digitos = numTarjeta.replace(/\s+/g, "");

    if (selectorMetodoPago === "nequi" && digitos.length !== 10) {
      alert("Por favor ingresa un número de cuenta Nequi válido (10 dígitos).");
      cardInput.focus();
      return;
    } else if (
      selectorMetodoPago !== "nequi" &&
      (digitos.length < 13 || digitos.length > 19)
    ) {
      alert("Por favor ingresa un número de tarjeta válido.");
      cardInput.focus();
      return;
    }
  }

  const selectorEnvio = document.getElementById("shipping-city").value;
  const costoEnvio = selectorEnvio === "nacional" ? ENVIO_NACIONAL : ENVIO_LOCAL;
  const textoEnvio =
    selectorEnvio === "nacional"
      ? "Nacional ($22.000)"
      : "Bogotá / Soacha Contraentrega ($10.000)";

  let subtotal = 0;
  let lineas = [];

  lineas.push("¡Hola MARÃO! Quiero realizar el siguiente pedido desde la web:");
  lineas.push("");

  if (usuarioLogueado) {
    lineas.push(
      `• *Cliente:* ${usuarioLogueado.nombre} (${usuarioLogueado.email})`,
    );
    lineas.push("");
  }

  carrito.forEach((item, index) => {
    const totalProd = item.precio * item.cantidad;
    subtotal += totalProd;
    lineas.push(
      `${index + 1}. *${item.nombre}* x${item.cantidad} - ${formatearPrecio(totalProd)}`,
    );
  });

  const totalFinal = subtotal + costoEnvio;

  lineas.push("");
  lineas.push(`• *Tipo de Envío:* ${textoEnvio}`);
  lineas.push(`• *Dirección:* ${direccion}`);

  let detallePago = `• *Método de Pago:* ${selectorMetodoPago.toUpperCase()}`;
  if (selectorMetodoPago !== "efectivo" && numTarjeta) {
    const ultimos4 = numTarjeta.slice(-4);
    detallePago += ` (${tipoTarjeta} terminada en ****${ultimos4})`;
  }
  lineas.push(detallePago);

  lineas.push(`• *Total a pagar:* ${formatearPrecio(totalFinal)}`);
  lineas.push("");
  lineas.push("¡Quedo atento(a) para confirmar la entrega de mi pedido!");

  const mensajeTexto = lineas.join("\n");
  const urlWA = `https://wa.me/573243744983?text=${encodeURIComponent(mensajeTexto)}`;

  window.open(urlWA, "_blank");
}