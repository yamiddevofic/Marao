// Los precios se muestran siempre en formato colombiano ("$45.000").
// `toLocaleString()` sin locale usa el idioma del navegador, así que un cliente
// con el navegador en inglés veía "$45,000" mientras el HTML estático mostraba
// "$45.000" en las mismas tarjetas.
const FORMATO_COP = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  return `$${FORMATO_COP.format(valor)}`;
}
