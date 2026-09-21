import { extname } from "node:path";
import sharp from "sharp";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "../js/supabase-config.js";

const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY;
const esSimulacion = process.argv.includes("--dry-run");
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
};

const webpContentType = "image/webp";

/** Carpetas conocidas del bucket: /object/list no da un listado plano desde
 * la raíz, así que se recorre cada rama por separado. Pestañas y accesorios
 * comparten la carpeta assets/img/accesorios (igual que en el carrusel). */
const prefijosBase = [
  "assets/img/lentes/miel",
  "assets/img/lentes/azul",
  "assets/img/lentes/verde",
  "assets/img/lentes/gris",
  "assets/img/lentes/cosplay",
  "assets/img/accesorios",
];

async function listar(prefijo) {
  // Listar es lectura pública: la publishable key alcanza y evita pedir la
  // clave secreta solo para explorar el bucket en --dry-run.
  const respuesta = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/${carpetaBucket}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefix: prefijo, limit: 2000 }),
    },
  );
  if (!respuesta.ok) {
    throw new Error(`Listado ${prefijo}: ${respuesta.status}`);
  }
  return respuesta.json();
}

async function recolectarDesde(prefijo) {
  const entradas = await listar(prefijo);
  const archivos = [];
  for (const entrada of entradas) {
    const ruta = `${prefijo}/${entrada.name}`;
    const ext = extname(entrada.name).toLowerCase();
    if (entrada.metadata?.mimetype && tipoContenido[ext]) {
      archivos.push(ruta);
    } else if (!entrada.metadata) {
      const sub = await recolectarDesde(ruta);
      archivos.push(...sub);
    }
  }
  return archivos;
}

async function recolectarTodo() {
  const archivos = [];
  for (const prefijo of prefijosBase) {
    const sub = await recolectarDesde(prefijo);
    archivos.push(...sub);
  }
  return archivos;
}

async function subirWebp(rutaOrigen) {
  const remoto = `${SUPABASE_URL}/storage/v1/object/public/${carpetaBucket}/${rutaOrigen}`;
  const respuesta = await fetch(remoto);
  if (!respuesta.ok) {
    throw new Error(`Descarga ${remoto}: ${respuesta.status}`);
  }
  const buffer = Buffer.from(await respuesta.arrayBuffer());
  const webp = await sharp(buffer).webp().toBuffer();
  const destino = rutaOrigen.replace(/\.(jpe?g|png)$/i, ".webp");
  const subida = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${carpetaBucket}/${destino}`,
    {
      method: "POST",
      headers: {
        apikey: claveServicio,
        Authorization: `Bearer ${claveServicio}`,
        "Content-Type": webpContentType,
        "x-upsert": "true",
      },
      body: webp,
    },
  );
  if (!subida.ok) {
    throw new Error(
      `Subida ${destino}: ${subida.status} ${await subida.text()}`,
    );
  }
  return destino;
}

const archivos = await recolectarTodo();
console.log(`Imágenes JPEG/PNG a convertir a WebP: ${archivos.length}`);

if (esSimulacion) {
  archivos.forEach((ruta) => console.log(`  ${ruta}`));
  console.log("Simulación: no se convirtió ni subió nada.");
  process.exit(0);
}

for (const [indice, rutaOrigen] of archivos.entries()) {
  const destino = await subirWebp(rutaOrigen);
  console.log(`WebP ${indice + 1}/${archivos.length}: ${destino}`);
}

console.log(`Listo: ${archivos.length} archivos WebP subidos.`);
