import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../js/supabase-config.js";

const ENVIO_BOGOTA_SOACHA = 10000;
const ENVIO_NACIONAL = 0;
const MAX_ITEMS = 50;
const MAX_CANTIDAD = 99;

export function validarSolicitudPago(cuerpo) {
  if (!cuerpo || !Array.isArray(cuerpo.items) || cuerpo.items.length === 0) {
    throw new Error("El carrito está vacío.");
  }
  if (cuerpo.items.length > MAX_ITEMS) {
    throw new Error("El carrito contiene demasiados productos.");
  }
  if (!["nacional", "bogota_soacha"].includes(cuerpo.destino)) {
    throw new Error("Selecciona un destino de envío válido.");
  }
  if (typeof cuerpo.direccion !== "string" || cuerpo.direccion.trim().length < 8) {
    throw new Error("Ingresa una dirección de entrega válida.");
  }
  if (!["CARD", "NEQUI"].includes(cuerpo.metodoPago)) {
    throw new Error("Selecciona un medio de pago válido.");
  }

  const vistos = new Set();
  const items = cuerpo.items.map((item) => {
    const id = Number(item?.id);
    const cantidad = Number(item?.cantidad);
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("El carrito contiene un producto inválido.");
    }
    if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > MAX_CANTIDAD) {
      throw new Error("La cantidad de un producto no es válida.");
    }
    if (vistos.has(id)) throw new Error("El carrito contiene productos duplicados.");
    vistos.add(id);
    return { id, cantidad };
  });

  return { items, destino: cuerpo.destino, direccion: cuerpo.direccion.trim(), metodoPago: cuerpo.metodoPago };
}

export function calcularTotalServidor(items, productos, destino) {
  if (productos.length !== items.length) {
    throw new Error("Un producto ya no está disponible. Actualiza tu carrito.");
  }

  const porId = new Map(productos.map((producto) => [Number(producto.id), producto]));
  const subtotal = items.reduce((total, item) => {
    const producto = porId.get(item.id);
    const precio = Number(producto?.precio);
    if (!producto || producto.estado !== "disponible" || !Number.isSafeInteger(precio) || precio < 0) {
      throw new Error("Un producto ya no está disponible. Actualiza tu carrito.");
    }
    const linea = precio * item.cantidad;
    if (!Number.isSafeInteger(linea)) throw new Error("El total del pedido no es válido.");
    return total + linea;
  }, 0);

  const envio = destino === "nacional" ? ENVIO_NACIONAL : ENVIO_BOGOTA_SOACHA;
  const total = subtotal + envio;
  if (!Number.isSafeInteger(total) || total <= 0) throw new Error("El total del pedido no es válido.");
  return total;
}

async function obtenerProductos(items, fetcher) {
  const ids = items.map(({ id }) => id).join(",");
  const url = new URL("/rest/v1/productos", SUPABASE_URL);
  url.searchParams.set("select", "id,precio,estado");
  url.searchParams.set("id", `in.(${ids})`);

  const respuesta = await fetcher(url, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!respuesta.ok) throw new Error("No se pudo verificar el catálogo. Intenta más tarde.");
  return respuesta.json();
}

async function crearSesionEpayco(datos, env, fetcher) {
  const credenciales = btoa(`${env.EPAYCO_PUBLIC_KEY}:${env.EPAYCO_PRIVATE_KEY}`);
  const login = await fetcher("https://apify.epayco.co/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credenciales}`,
    },
  });
  if (!login.ok) throw new Error("No se pudo autenticar el pago con ePayco.");
  const { token } = await login.json();
  if (typeof token !== "string" || !token) throw new Error("ePayco no entregó una sesión válida.");

  const sesion = await fetcher("https://apify.epayco.co/payment/session/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });
  if (!sesion.ok) throw new Error("ePayco no pudo crear la sesión de pago.");
  const resultado = await sesion.json();
  const sessionId = resultado?.data?.sessionId;
  if (resultado?.success !== true || typeof sessionId !== "string" || !sessionId) {
    throw new Error("ePayco no entregó una sesión de pago válida.");
  }
  return sessionId;
}

export async function crearSesionPago(cuerpo, env, origin, fetcher = fetch) {
  if (!env.EPAYCO_PUBLIC_KEY || !env.EPAYCO_PRIVATE_KEY) {
    throw new Error("El pago en línea no está configurado en el servidor.");
  }
  const solicitud = validarSolicitudPago(cuerpo);
  const productos = await obtenerProductos(solicitud.items, fetcher);
  const amount = calcularTotalServidor(solicitud.items, productos, solicitud.destino);
  const invoice = `MRA-${crypto.randomUUID()}`;
  const base = new URL(origin);
  const checkoutSession = await crearSesionEpayco(
    {
      checkout_version: "2",
      name: env.EPAYCO_BUSINESS_NAME || "MARAO",
      currency: "COP",
      amount,
      invoice,
      country: "CO",
      lang: "ES",
      description: `Pedido MARAO ${invoice}`,
      response: new URL("/?pago=respuesta", base).href,
      billing: {
        ...(typeof cuerpo.email === "string" && cuerpo.email.trim()
          ? { email: cuerpo.email.trim().slice(0, 160) }
          : {}),
        name: typeof cuerpo.nombre === "string" ? cuerpo.nombre.slice(0, 100) : "Cliente MARAO",
        address: solicitud.direccion.slice(0, 200),
      },
      extras: {
        extra1: solicitud.metodoPago,
        extra2: solicitud.destino,
        extra3: invoice,
      },
    },
    env,
    fetcher,
  );

  return { sessionId: checkoutSession, test: env.EPAYCO_TEST_MODE === "true" };
}
