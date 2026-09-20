import { IMG_PATH, PRECIO_LENTES } from "./constantes.js";
import { lentes } from "./lentes.js";
import { lentesCosplay } from "./cosplay.js";

export { IMG_PATH, PRECIO_LENTES };

const IMG_ACCESORIOS = IMG_PATH + "accesorios/";

/**
 * Pestañas y accesorios. Los lentes viven en `lentes.js`.
 *
 * Nombres, precios y fotos salen del documento "PRODUCTOS WORD3" del negocio;
 * ahí cada precio va escrito sobre la foto del producto. Dos referencias siguen
 * sin foto porque el documento no las incluye (`img: null`, y el catálogo les
 * pone el placeholder de la marca).
 */
const otrosProductos = [
  {
    id: 105,
    nombre: "PESTAÑAS CORTÓN",
    desc: "Bandeja punto a punto con varias medidas en un solo estuche.",
    precio: 10000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "pestanas-corton.jpeg",
  },
  {
    id: 106,
    nombre: "PESTAÑAS LIBRO",
    desc: "Estuche tipo libro con pestañas punto a punto surtidas.",
    precio: 30000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "pestanas-libro.jpeg",
  },
  {
    id: 100,
    nombre: "PEGANTE PARA PESTAÑAS (BOND & SEAL)",
    desc: "Adhesivo de alta fijación con sellador en el otro extremo.",
    precio: 10000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "pegante.jpeg",
  },
  {
    id: 107,
    nombre: "REMOVEDOR DE PESTAÑAS",
    desc: "Retira las extensiones sin maltratar la pestaña natural.",
    precio: 10000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "removedor.jpeg",
  },
  {
    id: 108,
    nombre: "COMBO PEGANTE + REMOVEDOR",
    desc: "El dúo para poner y quitar, más barato que por separado.",
    precio: 20000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "combo-pegante-removedor.jpeg",
  },
  {
    id: 109,
    nombre: "COMBO PEGANTE + REMOVEDOR + PINZAS",
    desc: "Pegante, removedor y pinza de precisión en un solo combo.",
    precio: 23000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "combo-pegante-removedor-pinzas.jpeg",
  },
  {
    id: 110,
    nombre: "PINZAS PARA PESTAÑAS",
    desc: "Pinza de precisión con punta curva para aplicar en casa.",
    precio: 5000,
    tipo: "pestana",
    img: IMG_ACCESORIOS + "pinzas-pestanas.jpeg",
  },
  {
    id: 102,
    nombre: "SOLUCIÓN DE LENTES",
    desc: "Limpia, desinfecta y conserva tus lentes todo el día.",
    precio: 17000,
    tipo: "accesorio",
    img: null,
  },
  {
    id: 103,
    nombre: "KIT APLICADOR + PINZA",
    desc: "Punta de silicona para ponerte los lentes con higiene.",
    precio: 5000,
    tipo: "accesorio",
    img: null,
  },
  {
    id: 101,
    nombre: "KIT VIAJERO CON ESPEJO",
    desc: "Porta-lentes compacto con espejo integrado.",
    precio: 10000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "kit-viajero-espejo.jpeg",
  },
  {
    id: 111,
    nombre: "KIT VIAJERO COMPLETO",
    desc: "Doble porta-lentes, pinza, aplicador y envase de solución.",
    precio: 12000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "kit-viajero-completo.jpeg",
  },
  {
    id: 104,
    nombre: "LAVADORA MANUAL PARA LENTES",
    desc: "Gira la tapa y limpia tus lentes en segundos.",
    precio: 10000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "lavadora-manual.jpeg",
  },
  {
    id: 112,
    nombre: "LAVADORA ULTRASÓNICA",
    desc: "Limpia por ultrasonido en minutos, sin fricción.",
    precio: 30000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "lavadora-ultrasonica.jpeg",
  },
  {
    id: 113,
    nombre: "PINZAS ABRE OJOS",
    desc: "Sujeta el párpado mientras te pones el lente.",
    precio: 10000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "pinzas-abre-ojos.jpeg",
  },
  {
    id: 114,
    nombre: "MASAJEADOR FACIAL",
    desc: "Rodillo de vidrio para desinflamar el contorno de ojos.",
    precio: 7000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "masajeador-facial.jpeg",
  },
  {
    id: 115,
    nombre: "JABÓN PARA MANOS",
    desc: "Lávate las manos antes de manipular los lentes.",
    precio: 10000,
    tipo: "accesorio",
    img: IMG_ACCESORIOS + "jabon-manos.jpeg",
  },
];

export let productosBase = [...lentes, ...lentesCosplay, ...otrosProductos];

export function establecerProductos(productos) {
  productosBase = productos.map((producto) => ({
    ...producto,
    desc: producto.descripcion ?? producto.desc ?? "",
    img: producto.imagen ?? producto.img ?? null,
    imagenes: producto.imagenes ?? [],
    alias: producto.alias ?? [],
    presentaciones: producto.presentaciones ?? [],
  }));
}

/* "cosplay" es un tipo de lente más, pero no se clasifica por pupila: entra en
   `getLentes()` y queda fuera de los filtros de pupila reducida/estándar. */
export const TIPOS_LENTE = ["reducida", "estandar", "cosplay"];

export const esLente = (producto) => TIPOS_LENTE.includes(producto.tipo);

export const esAccesorio = (producto) => producto.tipo === "accesorio";

export const esPestana = (producto) => producto.tipo === "pestana";

export const getLentes = () => productosBase.filter(esLente);

export const getAccesorios = () => productosBase.filter(esAccesorio);

export const getPestanas = () => productosBase.filter(esPestana);
