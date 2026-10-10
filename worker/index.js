import { crearSesionPago } from "./payment.js";

function respuestaJson(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/payment/session") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return respuestaJson({ error: "Método no permitido." }, 405);

    const origin = request.headers.get("Origin");
    if (!origin || origin !== url.origin) {
      return respuestaJson({ error: "Solicitud no permitida." }, 403);
    }
    if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
      return respuestaJson({ error: "Formato de solicitud no válido." }, 415);
    }

    try {
      const cuerpo = await request.json();
      const resultado = await crearSesionPago(cuerpo, env, url.origin);
      return respuestaJson(resultado);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo iniciar el pago.";
      const clienteError = /carrito|producto|cantidad|destino|dirección|medio de pago|total del pedido/i.test(mensaje);
      if (!clienteError) console.error("[payment] Error al crear sesión ePayco", error);
      return respuestaJson(
        { error: clienteError ? mensaje : "No se pudo iniciar el pago. Intenta de nuevo." },
        clienteError ? 400 : 502,
      );
    }
  },
};
