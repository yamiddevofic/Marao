import { abrirModal } from "./modales.js";
import { formatearPrecio } from "./formato.js";

/**
 * Resultado del pago al volver de ePayco.
 *
 * ePayco devuelve a `/?pago=respuesta&ref_payco=…`. Antes la tienda no hacía
 * nada con eso y quien tenía el pago rechazado (saldo insuficiente) o lo había
 * abandonado creía haber pagado. Aquí se consulta el estado real y se le dice.
 *
 * Este aviso es solo informativo: el estado lo decide ePayco y el pedido se
 * sigue verificando en su panel antes de despachar.
 */
const URL_VALIDACION = "https://secure.epayco.co/validation/v1/reference/";

/* `x_cod_response` de ePayco. Lo que no esté aquí se trata como "no se
   completó", que es lo prudente: nunca decir "aprobado" sin estar seguros. */
const ACEPTADA = 1;
const PENDIENTES = new Set([3, 7, 8]); // Pendiente, Retenida, Iniciada

/** Lee la referencia de la URL. Si ePayco añadiera `?ref_payco` sobre la query
 *  existente, quedaría pegada al valor de `pago`; también se contempla. */
function referenciaDesdeRuta() {
  const parametros = new URLSearchParams(window.location.search);
  const pago = parametros.get("pago") ?? "";
  if (!pago.startsWith("respuesta")) return null;

  const pegada = new URLSearchParams(pago.split("?")[1] ?? "").get("ref_payco");
  const referencia = parametros.get("ref_payco") ?? pegada ?? "";
  return /^[A-Za-z0-9-]{1,100}$/.test(referencia) ? referencia : "";
}

/** Quita los parámetros del pago para que recargar o compartir la URL no
 *  vuelva a mostrar el aviso. */
function limpiarRuta() {
  const parametros = new URLSearchParams(window.location.search);
  parametros.delete("pago");
  parametros.delete("ref_payco");
  const query = parametros.toString();
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
  );
}

function pintar({ titulo, mensaje, motivo = "", detalle = "", tipo }) {
  const tarjeta = document.querySelector("#modal-pago-resultado [role='dialog']");
  if (tarjeta) tarjeta.dataset.estado = tipo;
  document.getElementById("pago-resultado-titulo").textContent = titulo;
  document.getElementById("pago-resultado-mensaje").textContent = mensaje;
  // Motivo y detalle vienen de ePayco: siempre como texto, nunca como HTML.
  document.getElementById("pago-resultado-motivo").textContent = motivo;
  document.getElementById("pago-resultado-detalle").textContent = detalle;
}

function describir(datos) {
  const codigo = Number(datos?.x_cod_response);
  const motivo = typeof datos?.x_response_reason_text === "string" ? datos.x_response_reason_text : "";
  const monto = Number(datos?.x_amount);
  const partes = [
    datos?.x_ref_payco ? `Ref. ePayco ${datos.x_ref_payco}` : "",
    Number.isFinite(monto) && monto > 0 ? formatearPrecio(monto) : "",
  ].filter(Boolean);
  const detalle = partes.join(" · ");

  if (codigo === ACEPTADA) {
    return {
      tipo: "aceptada",
      titulo: "¡Pago aprobado!",
      mensaje:
        "Recibimos tu pago. Envía la captura del comprobante al WhatsApp del vendedor junto con tu pedido para coordinar la entrega.",
      detalle,
    };
  }
  if (PENDIENTES.has(codigo)) {
    return {
      tipo: "pendiente",
      titulo: "Pago pendiente",
      mensaje:
        "Tu pago aún no está confirmado. Si pagaste con Nequi, aprueba la notificación en la app. Si en unos minutos no se aprueba, no se hará ningún cobro.",
      motivo,
      detalle,
    };
  }
  return {
    tipo: "rechazada",
    titulo: "Tu pago no se completó",
    mensaje:
      "No se realizó ningún cobro. Puedes intentarlo de nuevo con otro medio de pago o escribirnos por WhatsApp.",
    motivo: motivo ? `Motivo: ${motivo}` : "",
    detalle,
  };
}

export async function mostrarResultadoPago() {
  const referencia = referenciaDesdeRuta();
  if (referencia === null) return;
  limpiarRuta();

  pintar({
    tipo: "cargando",
    titulo: "Consultando tu pago…",
    mensaje: "Un momento, estamos verificando el estado con ePayco.",
  });
  abrirModal("modal-pago-resultado");

  const sinEstado = {
    tipo: "pendiente",
    titulo: "No pudimos confirmar tu pago",
    mensaje:
      "Escríbenos por WhatsApp con la captura de tu comprobante y lo verificamos por ti.",
  };
  if (!referencia) {
    pintar(sinEstado);
    return;
  }

  try {
    const respuesta = await fetch(`${URL_VALIDACION}${encodeURIComponent(referencia)}`);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const resultado = await respuesta.json();
    if (!resultado?.success || !resultado.data) throw new Error("Respuesta sin datos");
    pintar(describir(resultado.data));
  } catch (error) {
    console.warn("[pago] No se pudo consultar el estado en ePayco", error);
    pintar(sinEstado);
  }
}
