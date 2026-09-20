import { IMG_PATH, PRECIO_LENTES } from "./constantes.js";

/**
 * Catálogo de lentes de contacto cosméticos.
 *
 * Extraído del documento "CATALOGO PAGINA #2" (fichas técnicas) y del set de
 * fotos "FOTOS PAGINA" (imágenes por tono). Cada referencia combina ambas
 * fuentes: los atributos vienen de la ficha y la foto del set, emparejadas por
 * nombre. Cuando las dos fuentes escriben distinto un mismo lente (MELBURTH /
 * MELHBURTH BLACK, RIO OCRE / RIO OCHRE), manda el nombre de la foto y el del
 * documento queda en `alias`.
 *
 * Donde la ficha no dice la pupila pero la referencia cuelga de un título de
 * sección que sí ("GRIS PUPILA ESTANDAR"), se toma la del título: es el caso de
 * OMG BLACK y PATTAYA BLACK.
 *
 * Campos propios de un lente (además de los comunes a `productosBase`):
 * - `tipo`:           pupila "reducida" | "estandar" — es el filtro ya existente.
 * - `color`:          tono del lente, una de las claves de `COLORES_LENTE`.
 * - `cobertura`:      "Alta" | "Media" | "Baja" — qué tanto cubre el iris real.
 * - `borde`:          aro lineal exterior, tal como lo describe la ficha.
 * - `efecto`:         diseño especial ("Muñeca", "Medialuna", "Foxi") o null.
 * - `promocion`:      la ficha lo lista bajo una sección de promociones.
 * - `presentaciones`: marcas en las que existe la referencia, con diámetro (DM)
 *                     y el tipo de pupila de esa marca. Una misma referencia
 *                     puede venir en varias marcas con diámetros distintos.
 * - `alias`:          otros nombres comerciales de la misma referencia.
 * - `imagenes`:       todas las fotos disponibles; `img` es la principal.
 *
 * 7 referencias del documento aún no tienen foto en el set y quedan con
 * `img: null` (el listener de `main.js` les pone el placeholder):
 * BRAZIL GIRL AMBER, BRAZIL GIRL GRAFITO, NIGTH STORN, VIOLET MIRAGE, PEACOCK BLUE, VAADHOO, ZAFIRO.
 */

const IMG_LENTES = IMG_PATH + "lentes/";

/** Tonos disponibles, en el orden en que se muestran los filtros. */
export const COLORES_LENTE = {
  miel: "Café & Miel",
  verde: "Verde",
  gris: "Gris",
  azul: "Azul",
  /* Los lentes de cosplay son otra línea (js/cosplay.js), pero se filtran
     desde los mismos botones de tono. */
  cosplay: "Cosplay",
};

export const lentes = [
  {
    id: 1090,
    nombre: "3 CON HAZEL",
    alias: [],
    desc: "Lentes de aspecto natural y sutil, con una alta pigmentación pero de cambio sutil, su tono base es miel con matices verdosos, cuenta con un aro lineal en tono oscuro pero difuminado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESH GO",
        diametro: null,
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "miel/3-con-hazel.jpeg",
    imagenes: [IMG_LENTES + "miel/3-con-hazel.jpeg"]
  },
  {
    id: 1001,
    nombre: "AMBER",
    alias: [],
    desc: "Lente de aspecto natural sin aro lineal o borde, tonalidad ambar, para acabados luminosos tiene una cobertura sutil realzando la mirada de forma suave.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/amber.jpeg",
    imagenes: [IMG_LENTES + "miel/amber.jpeg"]
  },
  {
    id: 1002,
    nombre: "ANGELES N AMBER",
    alias: [],
    desc: "Lente de aspecto hiperealista, sin aro lineal o borde, pupila reducida (3.8mm). la tonalidad base se difumina entre tonos miel avellana, café medio y verde pera, el tono es ideal para cambios realistas y radicales.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "miel",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/angeles-amber-2.jpeg",
    imagenes: [IMG_LENTES + "miel/angeles-amber-2.jpeg"]
  },
  {
    id: 1003,
    nombre: "ANGELES N BROWN",
    alias: [],
    desc: "Descripción: lente de aspecto hiperealista sin aro lineal o borde, pupila reducida (3.8mm) color base café claro, con matices suaves grisaceos y verdosos, ideal para cambios sutiles y sencillos.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "miel",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/angeles-amber.jpeg",
    imagenes: [IMG_LENTES + "miel/angeles-amber.jpeg"]
  },
  {
    id: 1004,
    nombre: "AVELA",
    alias: [],
    desc: "Descripción: lente de aspecto natural sin aro lineal o borde, ideal para cambios sutiles ultranatural, tonalidad base avellana con destellos miel y verde, aclara en un 50%R.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      },
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/avela.jpeg",
    imagenes: [IMG_LENTES + "miel/avela.jpeg"]
  },
  {
    id: 1005,
    nombre: "BLACKSPOT BROWN",
    alias: ["STUNNA GIRL NADINE"],
    desc: "Descripción: lente con diseño definido, borde difuminado en tonalidad oscura, con detalles marcados hacia el centro, ideal para cambios notorios o llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: "Realista"
      },
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "miel/blackspot-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/blackspot-brown.jpeg"]
  },
  {
    id: 1006,
    nombre: "BREEZE HAZEL",
    alias: [],
    desc: "Lente de aspecto hiperealista, con pupila reducida en un (3.8mm) un tono miel avellana para aclarar sutilmente la base real. Un cambio ideal con profundidad que realza la mirada sin ser llamativo.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde ligero",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/breaze-hazel.jpeg",
    imagenes: [IMG_LENTES + "miel/breaze-hazel.jpeg"]
  },
  {
    id: 1007,
    nombre: "CLEOPATRA HAZEL",
    alias: [],
    desc: "Lente de aspecto hiperealista, cuenta con aro lineal o borde delgado, exclusivo por su base clara, con destellos dorados, tiene matices verdosos según la luz ambientada, pupila reducida en un (3.8mm) ideal para cambios fuertes y realistas.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/cleopatra-hazel.jpeg",
    imagenes: [IMG_LENTES + "miel/cleopatra-hazel.jpeg"]
  },
  {
    id: 1008,
    nombre: "COCO CANDY",
    alias: [],
    desc: "Lente de aspecto natural sin aro lineal o borde, ideal para cambios sutiles realzando el color chocolate, tambien aporta brillosidad y ligeramente grandes pero sin perder naturalidad.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/coco-candy.jpeg",
    imagenes: [IMG_LENTES + "miel/coco-candy.jpeg"]
  },
  {
    id: 1009,
    nombre: "DIAMOND BROWN",
    alias: ["DAWN BROWN"],
    desc: "Lente de aspecto realista, con aro lineal o borde muy marcado, este tipo de efecto muñeca busca agrandar el iris real de forma llamativa, una mezcla entre cafe suave y medio con matices en dorado buscando luminosidad.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Muñeca",
    promocion: false,
    presentaciones: [
      {
        marca: "MAGISTER",
        diametro: "14.5",
        pupila: "Estandar"
      },
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: "Estandar"
      },
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: "Realista"
      }
    ],
    img: IMG_LENTES + "miel/diamond-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/diamond-brown.jpeg"]
  },
  {
    id: 1091,
    nombre: "MEL BEIGE",
    alias: [],
    desc: "Lentes de aspecto sutil y natural, su tono base café miel claro perfecto para aclarar el color base de tus ojos, no cuenta con un aro lineal y es pupila estándar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESH GO",
        diametro: null,
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "miel/mel-beige.jpeg",
    imagenes: [IMG_LENTES + "miel/mel-beige.jpeg"]
  },
  {
    id: 1010,
    nombre: "MILK COFEE",
    alias: [],
    desc: "Descripción: lente de aspecto notorio, aro lineal o borde remarcado en negro para una ilusión ojos de muñeca, tono cafe cremoso aporta luminosidad, brillo y tambien agranda el iris natural.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Coreano",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/milk-coffe.jpeg",
    imagenes: [IMG_LENTES + "miel/milk-coffe.jpeg"]
  },
  {
    id: 1011,
    nombre: "OMG BROWN",
    alias: [],
    desc: "Descripción: Lente de aspecto natural sin aro o borde. Base intensa en tonos cafe con visos grisaceos, ideal para aclarar ojos ofreciendo un cambio sutil.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      },
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/omg-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/omg-brown.jpeg"]
  },
  {
    id: 1012,
    nombre: "ORANGE",
    alias: [],
    desc: "Lente de aspecto realista, con aro lineal o borde ideal para cambios notorios e intensos, tono miel a naranja agranda ligeramente el iris real, aportando luminosidad.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/orange.jpeg",
    imagenes: [IMG_LENTES + "miel/orange.jpeg"]
  },
  {
    id: 1013,
    nombre: "PATTAYA BROWN",
    alias: ["SAHARA BROWN"],
    desc: "Descripción: Tono de aspecto natural marcado con aro lineal o borde difuminado, tonalidad cafe media o marron calido, aporta claridad y brillo ideal para el dia a dia o para maquillajes.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      },
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: "Realista"
      }
    ],
    img: IMG_LENTES + "miel/pataya-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/pataya-brown.jpeg"]
  },
  {
    id: 1092,
    nombre: "QUEEN CHOCOLATE",
    alias: [],
    desc: "Lente de aspecto natural o sutil, aporta luminosidad y aclara la base natural del ojo uno o dos niveles, ideal para cafe medios a oscuros. Porcentaje en color del 30%.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.0",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "miel/queen-chocolate.jpeg",
    imagenes: [IMG_LENTES + "miel/queen-chocolate.jpeg"]
  },
  {
    id: 1014,
    nombre: "RAINY MOOD HAZEL",
    alias: [],
    desc: "Lente de aspecto natural con borde ligeramente marcado agrandando el iris sutilmente, tono avellana con subtonos cálidos (miel/naranja) logrando un efecto ojo muñeca.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "miel",
    cobertura: "Baja",
    borde: "Con borde ligero",
    efecto: "Muñeca",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/rainy-mood-hazel.jpeg",
    imagenes: [IMG_LENTES + "miel/rainy-mood-hazel.jpeg"]
  },
  {
    id: 1093,
    nombre: "RIO OCRE",
    alias: ["RIO OCHRE"],
    desc: "Lente de aspecto natural y sutil, su tono base es miel avellana ideal para aclarar, no tiene aro lineal, es un lente plano para cambios muy sutiles.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESH GO",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "miel/rio-ocre.jpeg",
    imagenes: [IMG_LENTES + "miel/rio-ocre.jpeg"]
  },
  {
    id: 1015,
    nombre: "SECRET BROWN",
    alias: [],
    desc: "Descripción: lente de aspecto realista entre tonos cafe y miel, aro lineal o borde delgado sutil, exclusivo por su diseño media luna, aportando luminosidad al ojo, esta media luna se diferencia por ser grisacea, ideal para cambios sutiles.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde ligero",
    efecto: "Medialuna",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/secret-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/secret-brown.jpeg"]
  },
  {
    id: 1016,
    nombre: "SIRI BROWN",
    alias: [],
    desc: "Lente de aspecto hiperealista cuenta con aro lineal o borde y acabados marcados, ideal para cambios con profundidad y degradación en tonos marron, o cafe grisaceo Un diseño exclusivo por su pupila reducida.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/siri-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/siri-brown.jpeg"]
  },
  {
    id: 1017,
    nombre: "SKYLAR DREAM",
    alias: [],
    desc: "Descripción: lente de aspecto realista con luminosidad, un tono bicolor exclusivo por su diseño media luna simula un reflejo de luz directa en el ojo, ideal para cambios sutiles y reales con borde delgado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: "Medialuna",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/skylar-dream.jpeg",
    imagenes: [IMG_LENTES + "miel/skylar-dream.jpeg"]
  },
  {
    id: 1018,
    nombre: "TAYLOR BROWN HAZEL",
    alias: [],
    desc: "Descripción: lente de aspecto realista sin aro lineal o borde entre tonos miel, cafe y destellos en ambar, simula las líneas del iris real para aportar profundidad sin ser llamativo.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: null,
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/taylor-brown-hazel.jpeg",
    imagenes: [IMG_LENTES + "miel/taylor-brown-hazel.jpeg"]
  },
  {
    id: 1019,
    nombre: "TEA",
    alias: [],
    desc: "Descripción: Tea, lente de aspecto natural sin aro lineal o borde, un tono con elegante diseño traslúcido calido ideal para aclarar sin ser llamativo.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/tea.jpeg",
    imagenes: [IMG_LENTES + "miel/tea.jpeg"]
  },
  {
    id: 1020,
    nombre: "VIENA CHOCOLATE",
    alias: [],
    desc: "Descripción: lente de aspecto natural, sin aro lineal o borde, tono chocolate ideal para oscurecer o bajar la intensidad de la base real con detalles atenuados hacia la pupila.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/vienna-chocolate.jpeg",
    imagenes: [IMG_LENTES + "miel/vienna-chocolate.jpeg"]
  },
  {
    id: 1021,
    nombre: "X BROWN FLARE",
    alias: [],
    desc: "Lente de aspecto realista, con aro lineal o borde marcado, ideal para cambios notorios su base natural es un marron miel, exclusivo por si diseño (foxy eye) generando la impresión de alargamiento en el iris natural.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Foxi",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/x-brown-flare.jpeg",
    imagenes: [IMG_LENTES + "miel/x-brown-flare.jpeg"]
  },
  {
    id: 1022,
    nombre: "BEAUTY EYE BROWN",
    alias: [],
    desc: "Lente cosmético en tono café y miel, de media cobertura, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Media",
    borde: null,
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/eye-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/eye-brown.jpeg"]
  },
  {
    id: 1023,
    nombre: "BRAZIL GIRL AMBER",
    alias: [],
    desc: "Lente cosmético en tono café y miel, de baja cobertura, sin borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  },
  {
    id: 1024,
    nombre: "PURPLE PRO",
    alias: [],
    desc: "Descripción: lentes de aspecto notorio sin aro lineal o borde, realza la base natural con una combinación violeta amatista, ideal para cambios notorios y sutiles.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Baja",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/purple-pro.jpeg",
    imagenes: [IMG_LENTES + "miel/purple-pro.jpeg"]
  },
  {
    id: 1025,
    nombre: "SIAM BROWN",
    alias: [],
    desc: "Lente de aspecto notorio con aro lineal o borde cafe, la base del tono se difumina entre tonos miel avellana verdosos, ideal para cambios notorios sin ser llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/siam-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/siam-brown.jpeg"]
  },
  {
    id: 1026,
    nombre: "STAR BROWN",
    alias: [],
    desc: "Lente cosmético en tono café y miel, de media cobertura, con borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "miel",
    cobertura: "Media",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "MAGISTER",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "miel/strar-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/strar-brown.jpeg"]
  },
  {
    id: 1094,
    nombre: "ANGELES EMARALD",
    alias: [],
    desc: "Lente de aspecto notorio, sin aro lineal o borde, su base es en color verde aguamarina con matices azulados, tiene lineas o venas que simulan un iris real, tiene una pupila reducida (3,5 mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "verde",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/angeles-emarald.jpeg",
    imagenes: [IMG_LENTES + "verde/angeles-emarald.jpeg"]
  },
  {
    id: 1027,
    nombre: "APHRODITE",
    alias: [],
    desc: "Lente de aspecto natural, con aro lineal ligeramente demarcado de forma suave pero definido, su tono base es verde turquesa intenso y luminoso, ideal para personas que buscan un cambio evidente pero sutil y natural.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/afrodita.jpeg",
    imagenes: [IMG_LENTES + "verde/afrodita.jpeg"]
  },
  {
    id: 1095,
    nombre: "AWAKEN GREEN",
    alias: [],
    desc: "Lente de aspecto notorio con aro lineal difuminado, su base en color es turquesa con su tono verde y un delicado tono celeste, ideal para cambios notorios, creando una transición difuminada entre la base real y el lente; es pupila estándar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.5",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/awaken-green.jpeg",
    imagenes: [IMG_LENTES + "verde/awaken-green.jpeg"]
  },
  {
    id: 1096,
    nombre: "BREEZE GREEN",
    alias: [],
    desc: "Lente de aspecto hiperrealista, cuenta con un aro lineal ligeramente difuminado de color verde degradado, con un tono base verde oliva que combina tonos verdes suaves con matices cálidos marrón-miel hacia el centro. Su pupila es reducida en un (3.8 mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      },
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/breeze-green.jpeg",
    imagenes: [IMG_LENTES + "verde/breeze-green.jpeg"]
  },
  {
    id: 1097,
    nombre: "CAMBUSI GREEN",
    alias: [],
    desc: "Lente de aspecto sutil y natural, su tono base es verde pero con un relleno tipo amarillo suave hacia el centro de la pupila, no cuenta con aro lineal y es ideal para aclarar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESH GO",
        diametro: null,
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/cambusi-green-2.jpeg",
    imagenes: [IMG_LENTES + "verde/cambusi-green-2.jpeg", IMG_LENTES + "verde/cambusi-green.jpeg"]
  },
  {
    id: 1028,
    nombre: "CLEOPATRA GREEN",
    alias: [],
    desc: "Lente de aspecto hiperrealista, con aro ligeramente marcado en tono oscuro lo que aporta definición a la mirada de forma sutil sin verse artificial. su tono base es Verde oliva,verde suave, su pupila es reducida en un (3.8 mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      },
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/cleopatra-green.jpeg",
    imagenes: [IMG_LENTES + "verde/cleopatra-green.jpeg"]
  },
  {
    id: 1029,
    nombre: "DIAMOND GREEN",
    alias: ["DAWN GREEN"],
    desc: "Un lente de aspecto notorio y llamativo, con aro lineal exterior oscuro y bien definido su función es agrandar visualmente el ojo, su tono base es verde claro/oliva con matices dorados o amarillos en el centro, lo que genera una transición suave desde la pupila hacia el exterior; para una mirada expresiva pero natural.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Muñeca",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: "Realista"
      },
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: "Estandar"
      },
      {
        marca: "MAGISTER",
        diametro: "14.5",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/diamond-green.jpeg",
    imagenes: [IMG_LENTES + "verde/diamond-green.jpeg"]
  },
  {
    id: 1030,
    nombre: "DOLLY TERESA",
    alias: [],
    desc: "Lente se ascoecto notorio y muy llamativo, su tono base es verde turquesa, tiene un aro lineal bien demarcado y definido de color gris y oscuro que hace que el.ojo sea vea más grande y por ende llamativo.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/dolly-teresa.jpeg",
    imagenes: [IMG_LENTES + "verde/dolly-teresa.jpeg"]
  },
  {
    id: 1031,
    nombre: "ICELAND GREEN",
    alias: [],
    desc: ": lente de aspecto notorio y llamativo, con su tono base verde oliva claro de alta cobertura, sin aro lineal marcado lo que le da un aspecto muy natural.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/iceland-green.jpeg",
    imagenes: [IMG_LENTES + "verde/iceland-green.jpeg"]
  },
  {
    id: 1032,
    nombre: "KITTY GREEN",
    alias: [],
    desc: "Lente de aspecto natural,sin areo lineal o borde, su base en color verde grisáceo,con detalles al centro de la pupila en cafe,logra un aspecto natural gracias a su difuminado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/kitty-green.jpeg",
    imagenes: [IMG_LENTES + "verde/kitty-green.jpeg"]
  },
  {
    id: 1033,
    nombre: "MEL",
    alias: [],
    desc: "Lente de aspecto natural y sutil, sin aro lineal demarcado,con una base de tono miel verdoso cálido que mezcla matices verde pistacho suave y avellana claro.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: "Estandar"
      },
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/mel.jpeg",
    imagenes: [IMG_LENTES + "verde/mel.jpeg"]
  },
  {
    id: 1034,
    nombre: "OCEAN GREEN",
    alias: [],
    desc: "Lente cosmético en tono verde, de media cobertura, sin borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: "Estandar"
      },
      {
        marca: "EYESHARE",
        diametro: "4.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/ocean-green.jpeg",
    imagenes: [IMG_LENTES + "verde/ocean-green.jpeg"]
  },
  {
    id: 1035,
    nombre: "PATTAYA GREEN",
    alias: ["AMAZONIA GREEN"],
    desc: "Lente de aspecto notorio pero natural, con tono base de color verde oliva medio con matices ligeramente dorados lo que logra un degradado suave hacia la pupila, con aro lineal fino de tono verde oliva oscuro/grisáceo, el cual ayuda a definir el contorno del ojo sin verse artificial.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      },
      {
        marca: "FRESHLADY",
        diametro: "4.2",
        pupila: "Realista"
      }
    ],
    img: IMG_LENTES + "verde/pataya-green.jpeg",
    imagenes: [IMG_LENTES + "verde/pataya-green.jpeg"]
  },
  {
    id: 1098,
    nombre: "RIO BUZIO",
    alias: ["RIO BUSIO"],
    desc: "Lente de aspecto natural y sutil, su tono base es verde oliva con pigmentación media, ideal para aclarar y dar cambios sutiles, no cuenta con un aro lineal y es de pupila estándar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESH GO",
        diametro: null,
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/rio-buzio.jpeg",
    imagenes: [IMG_LENTES + "verde/rio-buzio.jpeg", IMG_LENTES + "verde/rio-busio.jpeg"]
  },
  {
    id: 1036,
    nombre: "SIRI GREEN",
    alias: [],
    desc: "Lentes de aspecto hiperrealista, con aro lineal ligeramente marcado en tono oscuro, tiene una base natural de verde menta claro que proporciona una tonalidad luminosa y en el centro cuenta con una sombra tono miel dorado para ayudar a difuminar más su naturalidad del ojo, su pupila es reducida en un (3.8mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "verde",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/siri-green.jpeg",
    imagenes: [IMG_LENTES + "verde/siri-green.jpeg"]
  },
  {
    id: 1037,
    nombre: "SWAN GREEN",
    alias: [],
    desc: "Lente de aspecto notorio y alta pigmentación, su tono base es verde esmeralda, cuenta con un aro lineal bien definido verde oscuro que realsa y agranda los ojos de manera expresiva.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/swan-green.jpeg",
    imagenes: [IMG_LENTES + "verde/swan-green.jpeg"]
  },
  {
    id: 1038,
    nombre: "TAYLOR GREEN",
    alias: [],
    desc: "Lente de aspecto sutil y natural, sin aro lineal o borde que es la causa de su naturalidad, su base es verde oliva y Presenta una combinación de gris, presenta tonos amarillo/miel en la zona central cerca de la pupila, además es luminoso e ideal para aclarar la mirada de forma sutil.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/taylor-green.jpeg",
    imagenes: [IMG_LENTES + "verde/taylor-green.jpeg"]
  },
  {
    id: 1039,
    nombre: "WIL DNA",
    alias: [],
    desc: "Lente de aspecto notorio, con aro lineal definido de color oscuro ligeramente definido en un tono gris o verde oscuro, su tono base es verde con puntos lineales dorados lo cual logra Aclarar notablemente la mirada, pasando de un tono café oscuro a un verde avellana/olivo radiante.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/will-dna.jpeg",
    imagenes: [IMG_LENTES + "verde/will-dna.jpeg"]
  },
  {
    id: 1040,
    nombre: "X GREEN FLARE",
    alias: [],
    desc: "Lente de aspecto natural, aunque con un efecto foxxy, con un aro lineal exterior sutil y difuminado de color gris verdoso oscuro. Esto le otorga definición al ojo, Tono base Verde oliva con pequeñas tonalidades miel en el centro que ayudan a una transición suave hacia el color de la pupila natural.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Foxi",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "verde/x-green.jpeg",
    imagenes: [IMG_LENTES + "verde/x-green.jpeg"]
  },
  {
    id: 1041,
    nombre: "3 TONE GREEN",
    alias: ["PURPLE PRO"],
    desc: "3 TONE GREEN : lente de aspecto notorio y tricolor ya que demarca 3 tonalidades en su diseño, tono miel dorado, tono verde esmeralda y verde oliva, cuenta con un aro lineal no tan demarcado en tono gris oscuro lo que da mayor volumen a este diseño, cuenta con muy buena pigmentación lo que hace que sus matices verdes se intensas.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "verde",
    cobertura: "Media",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: "Estandar"
      },
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "verde/3tone-green.jpeg",
    imagenes: [IMG_LENTES + "verde/3tone-green.jpeg"]
  },
  {
    id: 1042,
    nombre: "ANGELES ASH GRAY",
    alias: [],
    desc: "Lente de aspecto sutil, sin aro lineal o borde ligeramente marcado, la base del tono es gris ceniza, ideal para cambios radicales o muy notorios, tiene pupila reducida en un (3.8mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/angeles-ash-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/angeles-ash-gray.jpeg"]
  },
  {
    id: 1043,
    nombre: "ANGELES N GRAY",
    alias: [],
    desc: "Lente de aspecto sutil, sin aro lineal o borde ligeramente marcado, la base del tono es gris aunque tiene matices o visos mas verdosos agua marina y destellos en miel, es un tono brillante ideal para cambios marcados y fuertes Tiene pupila reducida (3.8mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/angeles-n-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/angeles-n-gray.jpeg"]
  },
  {
    id: 1044,
    nombre: "ANGELES N ICE GRAY",
    alias: [],
    desc: "Descripción: diseño de aspecto hiperealista, sin aro lineal o borde marcado su base en color es gris claro con bastante luminosidad, tiene matices azulados fríos y celestes detalles cristalinos, su pupila es reducida en un (3.8mm) logrando un diseño natural y brillante.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/angeles-n-ice-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/angeles-n-ice-gray.jpeg"]
  },
  {
    id: 1045,
    nombre: "ARTEMIS",
    alias: [],
    desc: "Lente de aspecto sutil, con aro lineal o borde ligeramente marcado, su base es gris media capta tonos entre fríos y cálidos combina matices verdosos o ceniza, tiene alta opacidad ideal para cambios sutiles y notorios.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/artemis.jpeg",
    imagenes: [IMG_LENTES + "gris/artemis.jpeg"]
  },
  {
    id: 1046,
    nombre: "AURORA CRISTAL",
    alias: [],
    desc: "Lente de aspecto sutil y realista, su tono base es gris cristal de alta cobertura, no posee aro lineal, aporta un poco de brillosidasd en la.mirada.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/aurora-cristal.jpeg",
    imagenes: [IMG_LENTES + "gris/aurora-cristal.jpeg"]
  },
  {
    id: 1047,
    nombre: "BLACKSPOT GRAY",
    alias: ["STUNNA GIRL ROMONA"],
    desc: "Un lente de aspecto realista, su tono base es gris humo con una suave cobertura que tiende a aclarar el tono natural del ojo, cuenta con pequeños puntos negros alrededor del iris, cuenta con un aro lineal definido pero que a la vez se difumina.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: "Estandar"
      },
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/blackpost-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/blackpost-gray.jpeg"]
  },
  {
    id: 1086,
    nombre: "BLUSERHT PINK",
    alias: [],
    desc: "Lente de aspecto notorio natural, con un tono base rosado morado con matices blancas, un detalle más demarcado en forma de estrella al lado posterior del lente, cuenta con ser una pupila normal y tiene un aro lineal en color violeta oscuro pero muy sutil, ya que con solo el color base el ojo ya se ve expresivo.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/bluserh-pink.jpeg",
    imagenes: [IMG_LENTES + "gris/bluserh-pink.jpeg"]
  },
  {
    id: 1048,
    nombre: "BRAZIL GIRL QUARTZ",
    alias: [],
    desc: "Lente de aspecto natural sin aro lineal o borde marcado color base gris con difuminado verdoso ideal para todas las tonalidades de piel aporta naturalidad con un diámetro sutil.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.0",
        pupila: "Realista"
      },
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/quarzo.jpeg",
    imagenes: [IMG_LENTES + "gris/quarzo.jpeg"]
  },
  {
    id: 1049,
    nombre: "CLEOPATRA GRAY",
    alias: [],
    desc: "Lente de aspecto hiperealista con aro lineal o borde marcado, la base es gris y un difuminado verdoso con detalles amarillos hacia el centro de la pupila exclusivo por su diseño pupila reducida (3.8mm.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "gris",
    cobertura: null,
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/cleopatra-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/cleopatra-gray.jpeg"]
  },
  {
    id: 1050,
    nombre: "CLOUD VEIL",
    alias: [],
    desc: "Lente de aspecto notorio, con aro lineal o borde, la base es gris muy clara con detalles realistas que imitan un ojo real (como visos o venas reales) ideal para cambios notorios y fuertes con un aro definido en color oscuro.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/cloud-veil.jpeg",
    imagenes: [IMG_LENTES + "gris/cloud-veil.jpeg"]
  },
  {
    id: 1051,
    nombre: "DIAMOND GRAY",
    alias: ["DAWN GRAY"],
    desc: "Lente de aspecto notorio con aro lineal o borde marcado, tono base gris (medio/oscuro) agranda la base natural del ojo creando un cambio llamativo, diseño especial para acabados llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Muñeca",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: "Realista"
      },
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: "Estandar"
      },
      {
        marca: "MAGISTER",
        diametro: "14.5",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/diamond-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/diamond-gray.jpeg"]
  },
  {
    id: 1087,
    nombre: "GEM PINK",
    alias: [],
    desc: "Lente de aspecto natural y sutil, su color base es rosado pálido con matices rosadas más fuertes que el tono base alrededor de todo el irís, no cuenta con aro lineal demarcado y es pupila normal.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/gem-pink.jpeg",
    imagenes: [IMG_LENTES + "gris/gem-pink.jpeg"]
  },
  {
    id: 1052,
    nombre: "GRAFITO",
    alias: [],
    desc: "Lente de aspecto natural, sin aro lineal o borde, su color base es gris azulado, ideal para cambios sutiles sin detalles de realismo logra excelente cobertura y acabados sutiles.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: "Realista"
      },
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/grafito.jpeg",
    imagenes: [IMG_LENTES + "gris/grafito.jpeg"]
  },
  {
    id: 1053,
    nombre: "ICE GRAY",
    alias: [],
    desc: "Lente de aspecto natural, sin aro lineal o borde, la base gris media ideal para aclarar o aportar luminosidad, sin detalles de realismo logra aportar cambios sutiles y reales.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: "Realista"
      },
      {
        marca: "EYESHARE",
        diametro: "14.0",
        pupila: "Realista"
      },
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/ice-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/ice-gray.jpeg"]
  },
  {
    id: 1088,
    nombre: "KITTY PINK",
    alias: [],
    desc: "Lente de aspecto notorio natural, con un tono base rosado morado con matices blancas, un detalle más demarcado en forma de estrella al lado posterior del lente, cuenta con ser una pupila normal y tiene un aro lineal en color violeta oscuro pero muy sutil, ya que con solo el color base el ojo ya se ve expresivo.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/kitty-pink.jpeg",
    imagenes: [IMG_LENTES + "gris/kitty-pink.jpeg"]
  },
  {
    id: 1099,
    nombre: "MELBURTH",
    alias: ["MELHBURTH BLACK"],
    desc: "Lente de aspecto natural, su tono base es negro grisaceo, sin aro lineal, con un diámetro de 14.2, ideal para cambios llamativos pero a la vez sutiles, con una pupila estándar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/melburth.jpeg",
    imagenes: [IMG_LENTES + "gris/melburth.jpeg"]
  },
  {
    id: 1054,
    nombre: "OCEAN DARK GRAY",
    alias: [],
    desc: "Descripción: OCEAN GRAY: Lente de aspecto notorio, con una tono base de color verde con destellos o matices amarillas, alrededor de su pupila tiene un micropunteado de color negro, no tiene aro lineal demarcado, lo que genera que está referencia sea natural y sin contraste fuerte.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/ocean-dark-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/ocean-dark-gray.jpeg"]
  },
  {
    id: 1055,
    nombre: "OCEAN GRAY",
    alias: [],
    desc: "Lente de aspecto natural sin aro lineal o borde la base es gris con detalles (amarillo/verdosos) ideal para cambios marcados o llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/ocean-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/ocean-gray.jpeg"]
  },
  {
    id: 1100,
    nombre: "OMG BLACK",
    alias: [],
    desc: "Lente tipo cosplay, su base es negro, sin aro lineal o borde, es ideal para maquillaje de disfraz o maquillaje coreano, tiene un diámetro de 14.5 ideal para agrandar el iris.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: null
      },
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/omg-black.jpeg",
    imagenes: [IMG_LENTES + "gris/omg-black.jpeg"]
  },
  {
    id: 1101,
    nombre: "PATTAYA BLACK",
    alias: [],
    desc: "Lente de aspecto notorio, su tono base es negro con un subtono griseceo hacia la pupila, sin aro lineal o borde, para cambios notorios o marcados.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/pattaya-black.jpeg",
    imagenes: [IMG_LENTES + "gris/pattaya-black.jpeg"]
  },
  {
    id: 1056,
    nombre: "PERUVIAN GRAY",
    alias: [],
    desc: "Lente de aspecto hiperealista no tiene aro lineal o borde, su base es gris (medio/ claro)Con destellos marron, ideal para cambios notorios y a la misma vez sutiles realzando la mirada.",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "gris",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/peruvian-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/peruvian-gray.jpeg"]
  },
  {
    id: 1057,
    nombre: "RUSIIAN GRAY",
    alias: [],
    desc: "Lente de aspecto notorio y oscuro, su tono base es gris con matices amarillas hacia el centro de la pupila, cuenta con un aro lineal difuminado en gris mucho más oscuro, lo que da naturalidad a los ojos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/russian-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/russian-gray.jpeg"]
  },
  {
    id: 1058,
    nombre: "SECRET GRAY",
    alias: [],
    desc: "Lente de aspecto llamativo con aro lineal o borde remarcado, exclusivo por su diseño media luna el cual aporta luminosidad de forma natural, ideal para cambios notorios del dia a dia o maquillajes.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Medialuna",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/secret-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/secret-gray.jpeg"]
  },
  {
    id: 1059,
    nombre: "SNOWY",
    alias: [],
    desc: "Lente de aspecto natural sin aro lineal o borde, la base es gris con difuminado miel, es de baja intensidad aclara en un 40% ideal para aportar brillo y sin acabados marcados o llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/snowy.jpeg",
    imagenes: [IMG_LENTES + "gris/snowy.jpeg"]
  },
  {
    id: 1089,
    nombre: "TAYLOR VIOLET",
    alias: [],
    desc: "Lente de aspecto notorio, su color base es morado con matices violetas al rededor de la pupila, no cuenta con un aro lineal pero es para cambios llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.0",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "gris/taylor-violet.jpeg",
    imagenes: [IMG_LENTES + "gris/taylor-violet.jpeg"]
  },
  {
    id: 1060,
    nombre: "BRAZIL GIRL GRAFITO",
    alias: [],
    desc: "Lente de aspecto sutil, con un tono gris de base y un su tono o matices verdes,no cuenta con un aro lineal marcado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Baja",
    borde: "Sin borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  },
  {
    id: 1061,
    nombre: "SEA GRAY",
    alias: [],
    desc: "Lente de aspecto notorio con aro definido o borde remarcado, la base es gris media ideal para transformar la base natural, tiene visos o destellos mas claros de la base con un borde fino.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/sea-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/sea-gray.jpeg"]
  },
  {
    id: 1062,
    nombre: "SIAM GRAY",
    alias: [],
    desc: "Lente de aspecto notorio, con aro lineal o borde llamativo su base es gris media con destellos azulados, con textura y detalles ideal para cambios notorios y llamativos, tiene gran cobertura logra agrandar ligeramente el ojo real.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/siam-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/siam-gray.jpeg"]
  },
  {
    id: 1063,
    nombre: "TAYLOR GRAY",
    alias: [],
    desc: "Lente de aspecto notorio, con aro lineal o borde difuminado, la base es gris clara y subtono azul, un color para cambios mas llamativos y notorios ideal para todas las tonalidades de piel.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "gris",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "gris/taylor-gray.jpeg",
    imagenes: [IMG_LENTES + "gris/taylor-gray.jpeg"]
  },
  {
    id: 1064,
    nombre: "ANGELES N BLUE",
    alias: [],
    desc: "Lente de aspecto sutil, con buena pigmentación. Su tono base es azul claro con matices amarillos, tiene pupila reducida en un (3.8 mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "azul",
    cobertura: "Media",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/angeles-n-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/angeles-n-blue.jpeg"]
  },
  {
    id: 1065,
    nombre: "ANGELES N VIOLET",
    alias: [],
    desc: "Lente de aspecto sutil, con aro lineal o borde suavemente marcado, su base es azul brillante con matices o líneas lilas o blancas para acabados fuertes o notorios su pupila es reducida en un (3.8mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/angeles-n-vioelt.jpeg",
    imagenes: [IMG_LENTES + "azul/angeles-n-vioelt.jpeg"]
  },
  {
    id: 1102,
    nombre: "AQUA BLUE",
    alias: [],
    desc: "Lente de aspecto natural y sutil, con un diámetro 14.5 que hace ver el ojo mucho más expresivo en tamaño, su tono base es azul agua y no cuenta con aro lineal. Reacciona a diferentes tonalidades de ojos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Media",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESH GO",
        diametro: null,
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "azul/aqua-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/aqua-blue.jpeg"]
  },
  {
    id: 1066,
    nombre: "AURORA BLUE",
    alias: [],
    desc: "Lente cosmético en tono azul, de alta cobertura, sin borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/aurora-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/aurora-blue.jpeg"]
  },
  {
    id: 1067,
    nombre: "BLISS AZURE",
    alias: [],
    desc: "Lente de aspecto natural y sutil para cambios no tan llamativos, su tono base es azul claro con unas matices color blanco, no cuenta con un aro lineal finamente demarcado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/bliss-azure.jpeg",
    imagenes: [IMG_LENTES + "azul/bliss-azure.jpeg"]
  },
  {
    id: 1068,
    nombre: "CLEOPATRA SKY BLUE",
    alias: [],
    desc: "Lente de aspecto hiperealista, con aro lineal o borde ligeramente marcado, su base es azul cielo calido, con centro marrón la cual logra una buena transición con el ojo natural, su pupila es reducida en un (3.8mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/cleopatra-sky-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/cleopatra-sky-blue.jpeg"]
  },
  {
    id: 1069,
    nombre: "DIAMOND BLUE",
    alias: ["DAWN BLUE"],
    desc: "Lentes de aspecto notorio, con su tono base azul fuerte con matices de color blanco que rodea todo el irís, cuenta con un aro lineal fuerte y expresivo en color negro oscuro y de amplitud grueso.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Muñeca",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: "Realista"
      },
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: "Estandar"
      },
      {
        marca: "MAGISTER",
        diametro: "14.5",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "azul/diamond-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/diamond-blue.jpeg"]
  },
  {
    id: 1070,
    nombre: "DOPAMINA",
    alias: [],
    desc: "Lentes de aspecto notorio, con su tono base de azul profundo y matices de color blanco alrededor de todo el irís, no cuenta con un aro lineal demarcado, es adaptable para cambios llamativos y notorios.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/dophamine.jpeg",
    imagenes: [IMG_LENTES + "azul/dophamine.jpeg"]
  },
  {
    id: 1071,
    nombre: "GEM BRILLANT BLUE",
    alias: [],
    desc: "Lente de aspecto notorio, tiene un color base de azul rey neutro, llamativo e intenso, es de alta pigmentación y no cuenta con un aro lineal genermente demarcado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/gem-brillant-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/gem-brillant-blue.jpeg"]
  },
  {
    id: 1072,
    nombre: "KING BLUE",
    alias: [],
    desc: "Lente de aspecto notorio, tiene efecto tricolor, entre tonos grises, azules y verdes, cuenta con un aro lineal de color negro o azul oscuro, el cual hace ver el ojo de un color intenso y llamativo.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Media",
    borde: "Con borde",
    efecto: "Tricolor",
    promocion: false,
    presentaciones: [
      {
        marca: null,
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/king-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/king-blue.jpeg"]
  },
  {
    id: 1073,
    nombre: "NIGTH STORN",
    alias: [],
    desc: "Lente de aspecto notorio, con base de tono azul oscuro y fuerte, súper expresivo. Tiene matices blancos más claros en el cuerpo del iris, tiene un aro lineal expresivo de color negro.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  },
  {
    id: 1074,
    nombre: "PATTAYA BLUE",
    alias: ["ANARTIC BLUE"],
    desc: "Lente de aspecto notorio, de diámetro 14.5, su tono base es azul con matices verdes alrededor de la pupila, no cuenta con un aro lineal demarcado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: "Estandar"
      },
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: "Realista"
      }
    ],
    img: IMG_LENTES + "azul/pataya-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/pataya-blue.jpeg"]
  },
  {
    id: 1075,
    nombre: "SIAM BLUE",
    alias: [],
    desc: "Lente de aspecto natural, un poco llamativo, su tono base es bicolor hacia el centro destaca en un tono gris suave y a su alrededor un aro lineal azul las intenso lo que le da profundidad a la mirada.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/siam-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/siam-blue.jpeg"]
  },
  {
    id: 1076,
    nombre: "SIRI BLUE",
    alias: [],
    desc: "Lentes de contacto de aspecto Sutil, con su tono base azul rey pero suave en pigmentación, con un tono amarillo que rodea la pupila, cuenTa con un aro lineal difuminado en color oscuro, si pupila es reducida en un (3.8 mm).",
    precio: PRECIO_LENTES,
    tipo: "reducida",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/siri-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/siri-blue.jpeg"]
  },
  {
    id: 1077,
    nombre: "TOPAZ",
    alias: [],
    desc: "Lentes de aspecto sutil y natural, con su tono base azul aguamarina no cuenta con un aro lineal demarcado, sino más difuminado en un color azul rey para distorsionar un poco el tono y dar una mirada profunda.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "MAGISTER",
        diametro: "14.0",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/topas.jpeg",
    imagenes: [IMG_LENTES + "azul/topas.jpeg"]
  },
  {
    id: 1078,
    nombre: "VIOLET MIRAGE",
    alias: [],
    desc: "Lente de aspecto notorio con su tono base azul violeta uniforme y con un efecto media luna a un lado del lente pero efecto rotativo al parpadear el ojo, tiene un aro lineal color violeta oscuro.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Medialuna",
    promocion: false,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  },
  {
    id: 1079,
    nombre: "WHALE BLUE",
    alias: [],
    desc: "Lente de aspecto sutil, sin aro lineal o borde marcado, su base es azul rey intensa, exclusivo por su doble destello en forma de medias lunas, aportando suavidad al ojo, tiene acabados con poca cobertura.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: "Medialuna",
    promocion: false,
    presentaciones: [
      {
        marca: "MILCRECK",
        diametro: "14.2",
        pupila: "Estandar"
      }
    ],
    img: IMG_LENTES + "azul/whale-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/whale-blue.jpeg"]
  },
  {
    id: 1080,
    nombre: "WUSU BLUE",
    alias: [],
    desc: "Lente de aspecto notorio, su tono base es azul verdoso llamativo no totalmente informe sino más bien degradado con matices grises y lgunos si tonos verdes, tiene un aro lineal difuminado en azul oscuro para llamar un poco más la atencion y tener una mirada un poco más resaltado.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: false,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/wusu-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/wusu-blue.jpeg"]
  },
  {
    id: 1081,
    nombre: "BLACKSPOT BLUE",
    alias: [],
    desc: "Lente de aspecto notorio, con aro lineal o borde ligeramente marcado en azul, su base es azulada rey tiene detalles como manchas que crean contraste natural y a la misma vez añaden profundidad Ideal para cambios realistas.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      },
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/blasckpot-blue.jpeg",
    imagenes: [IMG_LENTES + "azul/blasckpot-blue.jpeg"]
  },
  {
    id: 1082,
    nombre: "PEACOCK BLUE",
    alias: [],
    desc: "Lente de aspecto notorio, con aro lineal o borde marcado, su base es azul vibrante con visos o detalles tipo líneas o venas muy marcados, su pupila es estándar es ideal para cambios llamativos.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.5",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  },
  {
    id: 1083,
    nombre: "VAADHOO",
    alias: [],
    desc: "Lente cosmético en tono azul, de alta cobertura, sin borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Sin borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  },
  {
    id: 1084,
    nombre: "VODKA LIME",
    alias: [],
    desc: "Lente cosmético en tono azul, de alta cobertura, con borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Alta",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "EYESHARE",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: IMG_LENTES + "azul/vodka-lime.jpeg",
    imagenes: [IMG_LENTES + "azul/vodka-lime.jpeg"]
  },
  {
    id: 1085,
    nombre: "ZAFIRO",
    alias: ["OCEAN BLUE"],
    desc: "Lente cosmético en tono azul, de media cobertura, con borde, pupila estandar.",
    precio: PRECIO_LENTES,
    tipo: "estandar",
    color: "azul",
    cobertura: "Media",
    borde: "Con borde",
    efecto: null,
    promocion: true,
    presentaciones: [
      {
        marca: "FRESHLADY",
        diametro: "14.2",
        pupila: null
      }
    ],
    img: null,
    imagenes: []
  }
];


/**
 * Fotos del set que todavía no tienen ficha técnica en el documento del
 * catálogo. No se publican porque falta el tipo de pupila y la cobertura, que
 * son datos del producto y no se pueden deducir de la imagen. Cuando el negocio
 * complete esos campos, cada entrada pasa al array `lentes` de arriba.
 *
 * Empezaron siendo 18. La versión "CATALOGO PAGINA #2 (Autoguardado)" trajo la
 * ficha de 13 de ellas y RIO BUSIO resultó ser la misma referencia que RIO
 * BUZIO (quedó como su segunda foto). Estas 4 siguen sin aparecer en ninguna
 * versión del documento.
 */
export const lentesSinFicha = [
  {
    nombre: "ANGELES N ESMERALD",
    color: "verde",
    img: IMG_LENTES + "verde/angeles-n-esmerald.jpeg",
    imagenes: [IMG_LENTES + "verde/angeles-n-esmerald.jpeg"]
  },
  {
    nombre: "CAT BELL",
    color: "gris",
    img: IMG_LENTES + "gris/cat-bell.jpeg",
    imagenes: [IMG_LENTES + "gris/cat-bell.jpeg"]
  },
  {
    nombre: "OCEAN BROWN",
    color: "miel",
    img: IMG_LENTES + "miel/ocean-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/ocean-brown.jpeg"]
  },
  {
    nombre: "RUSIAN BROWN",
    color: "miel",
    img: IMG_LENTES + "miel/rusian-brown.jpeg",
    imagenes: [IMG_LENTES + "miel/rusian-brown.jpeg"]
  }
];
