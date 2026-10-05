import { getCarrito } from "./cart.js";
import { getUsuarioLogueado } from "./auth.js";
import { formatearPrecio } from "./formato.js";

const scriptPrincipal = document.querySelector('script[src="js/main.js"]');
const configuracion = {
  publicKey: scriptPrincipal?.dataset.epaycoPublicKey ?? "",
  test: scriptPrincipal?.dataset.epaycoTest !== "false",
};

function obtenerDatosPago(total, referencia, direccion, destino, metodoPago, costoEnvio) {
  const usuario = getUsuarioLogueado();
  const carrito = getCarrito();
  const nombre = usuario?.nombre ?? "Cliente MARAO";
  const correo = usuario?.email ?? "";
  const productos = carrito
    .map((item) => `${item.nombre} x${item.cantidad} (${formatearPrecio(item.precio * item.cantidad)})`)
    .join(" | ");
  const zonaEnvio =
    destino === "nacional"
      ? "Envío nacional a acordar por WhatsApp"
      : `Envío Bogotá / Soacha (${formatearPrecio(costoEnvio)})`;
  const detalle = `${productos} | ${zonaEnvio}`;
  const fotos = carrito
    .map((item) => item.img && new URL(item.img, window.location.href).href)
    .filter(Boolean)
    .join(" | ");
  return {
    name: nombre,
    email: correo,
    name_billing: nombre,
    email_billing: correo,
    address: direccion,
    city: destino === "nacional" ? "Colombia" : "Bogota",
    country: "CO",
    currency: "cop",
    amount: String(total),
    description: detalle.slice(0, 250),
    invoice: referencia,
    p_method: metodoPago,
    extra1: `MARAO | ${detalle}`.slice(0, 250),
    extra2: fotos.slice(0, 250),
    extra3: formatearPrecio(total),
  };
}

function crearReferencia() {
  return `MRA-${Date.now()}`;
}

export function pagarConEpayco({ total, direccion, destino, metodoPago, costoEnvio }) {
  if (getCarrito().length === 0) {
    throw new Error("Tu carrito esta vacio. Agrega algun producto antes de pagar.");
  }
  if (!configuracion.publicKey) {
    throw new Error("El Web Checkout de ePayco aun no esta configurado. Elige WhatsApp para continuar.");
  }
  if (!window.ePayco?.checkout?.configure) {
    throw new Error("No se pudo cargar el checkout seguro de ePayco. Intenta de nuevo.");
  }

  const referencia = crearReferencia();
  const datos = obtenerDatosPago(total, referencia, direccion, destino, metodoPago, costoEnvio);
  const checkout = window.ePayco.checkout.configure({
    key: configuracion.publicKey,
    test: configuracion.test,
  });

  checkout.open({
    ...datos,
    // La versión externa usa la pantalla completa de ePayco y evita el modal
    // antiguo embebido sobre la tienda.
    external: "true",
    response: `${window.location.origin}/?pago=respuesta`,
    confirmation: `${window.location.origin}/api/epayco/confirmation`,
  });
}
