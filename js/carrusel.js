// El carrusel se desplaza con scroll nativo (swipe en móvil, teclado o flechas
// en escritorio); las flechas solo empujan ese scroll un "paso" = una tarjeta.
// Lo usan las pestañas y los accesorios: cada flecha dice en `data-carrusel`
// sobre qué pista actúa.
export function desplazarCarrusel(id, direccion) {
  const carrusel = document.getElementById(id);
  if (!carrusel) return;

  const maximo = carrusel.scrollWidth - carrusel.clientWidth;
  // El destino se limita al rango real: si se pasa, el scroll-snap devolvía la
  // vista al inicio en vez de quedarse en la última tarjeta.
  const destino = Math.min(
    Math.max(carrusel.scrollLeft + calcularPaso(carrusel) * direccion, 0),
    maximo,
  );

  carrusel.scrollTo({ left: destino, behavior: "smooth" });
}

function calcularPaso(carrusel) {
  const tarjeta = carrusel.firstElementChild;
  if (!tarjeta) return carrusel.clientWidth;

  const gap = Number.parseFloat(getComputedStyle(carrusel).columnGap);
  return tarjeta.getBoundingClientRect().width + (Number.isNaN(gap) ? 0 : gap);
}
