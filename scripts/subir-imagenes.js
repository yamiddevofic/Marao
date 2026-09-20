import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { productosBase } from "../js/productos.js";
import { SUPABASE_URL } from "../js/supabase-config.js";

const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY;
const esSimulacion = process.argv.includes("--dry-run");
const raiz = resolve(process.cwd());
const carpetaBucket = "productos";

if (!claveServicio && !esSimulacion) {
  throw new Error(
    "Falta SUPABASE_SERVICE_ROLE_KEY. No guardes esta clave en el repositorio.",
  );
}

if (claveServicio?.startsWith("sb_publishable_")) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY debe ser una clave secreta, no una publishable key.",
  );
}

const tipoContenido = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function rutaLocal(ruta) {
  return resolve(raiz, ruta);
}

function rutaStorage(ruta) {
  return relative(raiz, ruta).replaceAll("\\", "/");
}

async function existe(ruta) {
  try {
    await access(ruta);
    return true;
  } catch {
    return false;
  }
}

async function subirArchivo(ruta) {
  const extension = extname(ruta).toLowerCase();
  const contenido = await readFile(ruta);
  const destino = rutaStorage(ruta);
  const respuesta = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${carpetaBucket}/${destino}`,
    {
      method: "POST",
      headers: {
        apikey: claveServicio,
        Authorization: `Bearer ${claveServicio}`,
        "Content-Type": tipoContenido[extension] ?? "application/octet-stream",
        "x-upsert": "true",
      },
      body: contenido,
    },
  );

  if (!respuesta.ok) {
    throw new Error(`${respuesta.status} ${await respuesta.text()}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${carpetaBucket}/${destino}`;
}

const referencias = new Map();
for (const producto of productosBase) {
  const imagenes = producto.imagenes?.length
    ? producto.imagenes
    : producto.img
      ? [producto.img]
      : [];
  referencias.set(producto.id, imagenes);
}

const rutas = [...new Set([...referencias.values()].flat().filter(Boolean))];
const encontradas = [];
const faltantes = [];

for (const ruta of rutas) {
  const local = rutaLocal(ruta);
  if (await existe(local)) encontradas.push({ ruta, local });
  else faltantes.push(ruta);
}

console.log(`Imágenes referenciadas: ${rutas.length}`);
console.log(`Imágenes encontradas: ${encontradas.length}`);
console.log(`Imágenes faltantes: ${faltantes.length}`);

if (faltantes.length) {
  faltantes.forEach((ruta) => console.warn(`FALTA: ${ruta}`));
}

if (esSimulacion) {
  console.log("Simulación: no se subieron archivos ni se actualizaron productos.");
  process.exit(0);
}

const urls = new Map();
for (const [indice, archivo] of encontradas.entries()) {
  urls.set(archivo.ruta, await subirArchivo(archivo.local));
  console.log(`Subida ${indice + 1}/${encontradas.length}: ${archivo.ruta}`);
}

for (const producto of productosBase) {
  const imagenes = referencias.get(producto.id) ?? [];
  const imagenesPublicas = imagenes.map((ruta) => urls.get(ruta)).filter(Boolean);
  const imagenPublica = producto.img ? urls.get(producto.img) ?? null : null;
  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/productos?id=eq.${producto.id}`, {
    method: "PATCH",
    headers: {
      apikey: claveServicio,
      Authorization: `Bearer ${claveServicio}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ imagen: imagenPublica, imagenes: imagenesPublicas }),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo actualizar ${producto.id}: ${await respuesta.text()}`);
  }
}

console.log(`Productos actualizados: ${productosBase.length}`);
