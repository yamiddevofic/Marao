import { getCarrito } from "./cart.js";
import { getUsuarioLogueado } from "./auth.js";

export async function pagarConEpayco({ direccion, destino, metodoPago }) {
  const carrito = getCarrito();
  const usuario = getUsuarioLogueado();
  if (carrito.length === 0) {
    throw new Error("Tu carrito está vacío. Agrega algún producto antes de pagar.");
  }
  if (!window.ePayco?.checkout?.configure) {
    throw new Error("No se pudo cargar el checkout seguro de ePayco. Intenta de nuevo.");
  }

  const respuesta = await fetch("/api/payment/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: carrito.map(({ id, cantidad }) => ({ id, cantidad })),
      destino,
      direccion,
      metodoPago,
      nombre: usuario?.nombre ?? "Cliente MARAO",
      email: usuario?.email ?? "",
    }),
  });

  let resultado;
  try {
    resultado = await respuesta.json();
  } catch {
    throw new Error("No se pudo iniciar el pago. Intenta de nuevo.");
  }
  if (!respuesta.ok || !resultado.sessionId) {
    throw new Error(resultado.error ?? "No se pudo iniciar el pago. Intenta de nuevo.");
  }

  const checkout = window.ePayco.checkout.configure({
    sessionId: resultado.sessionId,
    type: "standard",
    test: resultado.test,
  });
  checkout.open();
}
