/**
 * Persistencia local del carrito, la sesión y los datos de envío.
 *
 * No hay backend: todo vive en el navegador de cada persona. Eso acota lo que
 * la interfaz puede prometer — lo guardado no viaja a otro dispositivo, así que
 * los textos deben decirlo tal cual y no sugerir una cuenta en la nube.
 *
 * `localStorage` no siempre está disponible: en modo privado, con el
 * almacenamiento bloqueado o con la cuota llena, el solo hecho de tocarlo
 * lanza. Por eso cada lectura y cada escritura van envueltas: si falla, el
 * sitio sigue vendiendo sin memoria en vez de romperse.
 */

const PREFIJO = "marao:";

export const CLAVE_CARRITO = `${PREFIJO}carrito`;
export const CLAVE_SESION = `${PREFIJO}sesion`;

/**
 * Los datos de envío se guardan por persona: en un celular compartido, la
 * dirección de una no debe aparecerle a la otra. Sin sesión se usa un cajón
 * anónimo, y al iniciar sesión se pasa al de esa cuenta.
 */
export const claveEnvio = (email) =>
  `${PREFIJO}envio:${email ? email.toLowerCase() : "anonimo"}`;

export function leer(clave, porDefecto = null) {
  try {
    const crudo = window.localStorage.getItem(clave);
    return crudo === null ? porDefecto : JSON.parse(crudo);
  } catch (error) {
    console.warn(`[almacenamiento] No se pudo leer "${clave}":`, error);
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn(`[almacenamiento] No se pudo guardar "${clave}":`, error);
    return false;
  }
}

export function borrar(clave) {
  try {
    window.localStorage.removeItem(clave);
  } catch (error) {
    console.warn(`[almacenamiento] No se pudo borrar "${clave}":`, error);
  }
}
