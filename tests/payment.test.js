import test from "node:test";
import assert from "node:assert/strict";
import { calcularTotalServidor, crearSesionPago, validarSolicitudPago } from "../worker/payment.js";

const solicitud = {
  items: [
    { id: 10, cantidad: 2 },
    { id: 20, cantidad: 1 },
  ],
  destino: "bogota_soacha",
  direccion: "Calle 123 # 45-67",
  metodoPago: "CARD",
};

const productos = [
  { id: 10, precio: 12500, estado: "disponible" },
  { id: 20, precio: 30000, estado: "disponible" },
];

test("calcula subtotal y envío usando precios del catálogo del servidor", () => {
  assert.equal(calcularTotalServidor(validarSolicitudPago(solicitud).items, productos, "bogota_soacha"), 65000);
  assert.equal(calcularTotalServidor(validarSolicitudPago(solicitud).items, productos, "nacional"), 55000);
});

test("rechaza IDs inexistentes, productos ocultos y cantidades inválidas", () => {
  assert.throws(() => calcularTotalServidor([{ id: 99, cantidad: 1 }], productos, "nacional"), /ya no está disponible/);
  assert.throws(
    () => calcularTotalServidor([{ id: 10, cantidad: 1 }], [{ ...productos[0], estado: "oculto" }], "nacional"),
    /ya no está disponible/,
  );
  assert.throws(() => validarSolicitudPago({ ...solicitud, items: [{ id: 10, cantidad: 0 }] }), /cantidad/);
});

test("ignora un monto enviado por el navegador y crea la sesión con el total del servidor", async () => {
  const llamadas = [];
  const fetcher = async (url, opciones = {}) => {
    llamadas.push({ url: String(url), opciones });
    if (String(url).includes("/rest/v1/productos")) {
      return Response.json(productos);
    }
    if (String(url) === "https://apify.epayco.co/login") {
      return Response.json({ token: "token-de-prueba" });
    }
    if (String(url) === "https://apify.epayco.co/payment/session/create") {
      return Response.json({ success: true, data: { sessionId: "sesion-de-prueba" } });
    }
    throw new Error(`URL no simulada: ${url}`);
  };

  const resultado = await crearSesionPago(
    { ...solicitud, amount: 1, total: 1 },
    {
      EPAYCO_PUBLIC_KEY: "public-test",
      EPAYCO_PRIVATE_KEY: "private-test",
      EPAYCO_TEST_MODE: "true",
    },
    "https://marao.co",
    fetcher,
  );

  const datosSesion = JSON.parse(llamadas[2].opciones.body);
  assert.equal(resultado.sessionId, "sesion-de-prueba");
  assert.equal(resultado.test, true);
  assert.equal(datosSesion.amount, 65000);
  assert.equal(datosSesion.currency, "COP");
  assert.match(datosSesion.response, /^https:\/\/marao\.co\//);
});

test("no contacta ePayco si los productos no coinciden con el catálogo vigente", async () => {
  let llamadasEpayco = 0;
  const fetcher = async (url) => {
    if (String(url).includes("/rest/v1/productos")) return Response.json([productos[0]]);
    llamadasEpayco += 1;
    throw new Error("No debería contactar ePayco");
  };

  await assert.rejects(
    crearSesionPago(solicitud, { EPAYCO_PUBLIC_KEY: "p", EPAYCO_PRIVATE_KEY: "s" }, "https://marao.co", fetcher),
    /ya no está disponible/,
  );
  assert.equal(llamadasEpayco, 0);
});
