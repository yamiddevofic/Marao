/**
 * Bloqueo del scroll de la página mientras hay un modal abierto.
 *
 * No basta con `overflow: hidden` en el body: en iOS el scroll se sigue
 * propagando y la página de atrás se mueve bajo el modal. La forma fiable es
 * sacar el body del flujo con `position: fixed` y compensar el desplazamiento
 * actual, para que visualmente nada se mueva; al desbloquear se restaura la
 * posición exacta en la que estaba la persona.
 *
 * Los estilos viven en `.scroll-bloqueado` (css/styles.css); aquí solo se
 * calculan los dos valores que dependen del momento (el scroll y el hueco de la
 * barra) y se pasan como variables CSS.
 */

/* Un contador en vez de un booleano: si se abre un modal por encima de otro,
   cerrar el de arriba no debe devolver el scroll mientras quede uno abierto. */
let bloqueosActivos = 0;
let scrollGuardado = 0;

export function bloquearScroll() {
  if (bloqueosActivos++ > 0) return;

  scrollGuardado = window.scrollY;

  // Al fijar el body desaparece la barra de scroll y el contenido daría un
  // salto lateral; se rellena ese hueco con el mismo ancho que ocupaba.
  const huecoBarra = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.setProperty("--scroll-lock-top", `-${scrollGuardado}px`);
  document.body.style.setProperty("--scroll-lock-gap", `${huecoBarra}px`);
  document.body.classList.add("scroll-bloqueado");
}

export function desbloquearScroll() {
  if (bloqueosActivos === 0) return;
  if (--bloqueosActivos > 0) return;

  document.body.classList.remove("scroll-bloqueado");
  document.body.style.removeProperty("--scroll-lock-top");
  document.body.style.removeProperty("--scroll-lock-gap");

  // `position: fixed` hizo perder el scroll real: se devuelve donde estaba.
  window.scrollTo(0, scrollGuardado);
}
