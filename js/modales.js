/**
 * Comportamiento común de los modales: apertura, cierre y accesibilidad.
 *
 * Antes cada modal repetía "añadir .open + bloquearScroll" en su propio módulo,
 * así que cualquier mejora había que escribirla tres veces y era fácil que una
 * se quedara atrás. Aquí vive una sola vez.
 *
 * Lo que aporta además de abrir y cerrar:
 *
 * - Una pila de modales abiertos. Escape cierra el de encima, no uno
 *   cualquiera: el login puede abrirse sobre el menú y el detalle sobre el
 *   catálogo.
 * - El foco entra al modal al abrirlo y vuelve a quien lo abrió al cerrarlo.
 *   Sin eso, quien navega con teclado sigue tabulando por el catálogo de
 *   detrás, que se ve pero no se puede usar.
 * - El tabulador queda atrapado dentro del modal mientras está abierto.
 */

import { bloquearScroll, desbloquearScroll } from "./scroll-lock.js";

const SELECTOR_FOCO = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/** Modales abiertos, del más antiguo al que está encima. */
const pila = [];

const cima = () => pila[pila.length - 1] ?? null;

export const hayModalAbierto = () => pila.length > 0;

function enfocables(modal) {
  return [...modal.querySelectorAll(SELECTOR_FOCO)].filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
  );
}

export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal || modal.classList.contains("open")) return;

  pila.push({ modal, focoPrevio: document.activeElement });
  modal.classList.add("open");
  bloquearScroll();

  /* Se enfoca la tarjeta, no el primer botón: así el lector de pantalla anuncia
     el diálogo y su título antes de leer un control suelto. */
  const tarjeta = modal.querySelector("[role='dialog']") ?? modal;
  tarjeta.focus({ preventScroll: true });
}

export function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (!modal || !modal.classList.contains("open")) return;

  const indice = pila.findIndex((entrada) => entrada.modal === modal);
  const entrada = indice >= 0 ? pila.splice(indice, 1)[0] : null;

  modal.classList.remove("open");
  desbloquearScroll();

  /* El elemento que abrió el modal puede haber desaparecido: el grid del
     catálogo se repinta y sus tarjetas son otras. Se comprueba que siga en el
     documento antes de devolverle el foco. */
  const previo = entrada?.focoPrevio;
  if (previo instanceof HTMLElement && document.contains(previo)) {
    previo.focus({ preventScroll: true });
  }
}

export function cerrarModalSuperior() {
  const arriba = cima();
  if (arriba) cerrarModal(arriba.modal.id);
}

/* El tabulador no debe salirse del modal de encima: fuera solo hay contenido
   visible pero inerte. Se cierra el ciclo saltando del último al primero. */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const arriba = cima();
  if (!arriba) return;

  const focos = enfocables(arriba.modal);
  if (focos.length === 0) {
    event.preventDefault();
    return;
  }

  const primero = focos[0];
  const ultimo = focos[focos.length - 1];
  const activo = document.activeElement;

  if (!arriba.modal.contains(activo)) {
    event.preventDefault();
    primero.focus();
  } else if (event.shiftKey && activo === primero) {
    event.preventDefault();
    ultimo.focus();
  } else if (!event.shiftKey && activo === ultimo) {
    event.preventDefault();
    primero.focus();
  }
});
