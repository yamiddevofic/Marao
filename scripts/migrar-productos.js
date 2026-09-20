import { productosBase } from "../js/productos.js";
import { SUPABASE_URL } from "../js/supabase-config.js";

const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY;
const esSimulacion = process.argv.includes("--dry-run");

if (!claveServicio && !esSimulacion) {
  throw new Error(
    "Falta SUPABASE_SERVICE_ROLE_KEY. No guardes esta clave en el repositorio.",
  );
}

if (claveServicio?.startsWith("sb_publishable_")) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY no puede ser una publishable key; usa una clave secreta solo en el entorno local.",
  );
}

const productos = productosBase.map((producto, indice) => ({
  id: producto.id,
  nombre: producto.nombre,
  descripcion: producto.desc ?? "",
  precio: producto.precio,
  tipo: producto.tipo,
  color: producto.color ?? null,
  cobertura: producto.cobertura ?? null,
  borde: producto.borde ?? null,
  efecto: producto.efecto ?? null,
  alias: Array.isArray(producto.alias) ? producto.alias : [],
  presentaciones: Array.isArray(producto.presentaciones)
    ? producto.presentaciones
    : [],
  imagen: producto.img ?? null,
  imagenes: Array.isArray(producto.imagenes)
    ? producto.imagenes
    : producto.img
      ? [producto.img]
      : [],
  estado: "disponible",
  orden: indice,
}));

console.log(`Productos preparados: ${productos.length}`);

if (esSimulacion) {
  console.log("Simulación: no se enviaron cambios a Supabase.");
  process.exit(0);
}

const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/productos?on_conflict=id`, {
  method: "POST",
  headers: {
    apikey: claveServicio,
    Authorization: `Bearer ${claveServicio}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify(productos),
});

if (!respuesta.ok) {
  const detalle = await respuesta.text();
  throw new Error(`Supabase rechazó la migración (${respuesta.status}): ${detalle}`);
}

console.log(`Migración completada: ${productos.length} productos enviados.`);
