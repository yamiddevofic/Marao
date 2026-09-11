/**
 * Constantes compartidas por los módulos de datos.
 *
 * Viven aparte de `productos.js` porque `lentes.js` también las necesita y
 * `productos.js` importa `lentes.js`: tenerlas aquí evita el ciclo de imports.
 */

export const PRECIO_LENTES = 45000;

export const IMG_PATH = "assets/img/";

/**
 * Datos de la ficha del modal que son iguales para todo el catálogo de lentes
 * (vienen del diseño, no del documento del catálogo). Viven aquí y no en
 * `lentes.js` porque ese archivo se regenera a partir del documento.
 */
export const FICHA_LENTE = {
  categoria: "LENTES DE CONTACTO COSMÉTICOS",
  duracion: "4-6 meses (Uso diario) Hasta 12 meses (Uso ocasional).",
  tipo: "Lente cosmético sin fórmula.",
  notaComodidad: "Diseñados para brindar máxima comodidad durante todo el día.",
};
