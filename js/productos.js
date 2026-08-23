export const PRECIO_LENTES = 45000;
export const IMG_PATH = "assets/img/";

export const productosBase = [
  {
    id: 1,
    nombre: "ANGELES AMBER",
    desc: "Resalta tu mirada con un tono verde natural y un acabado espectacular.",
    precio: 45000,
    tipo: "reducida",
    img: IMG_PATH + "ANGELES-AMBER.jpg",
  },
  {
    id: 2,
    nombre: "CITRINA BROWN",
    desc: "Brillo avellana cálido e intenso con acabado hiperrealista.",
    precio: 45000,
    tipo: "estandar",
    img: IMG_PATH + "lentes-citrina-brown.jpg",
  },
  {
    id: 3,
    nombre: "CHOCO DARK",
    desc: "Tono café profundo e impresionante.",
    precio: 45000,
    tipo: "reducida",
    img: IMG_PATH + "lentes-choco-dark.jpg",
  },
  {
    id: 4,
    nombre: "PATAYA GREEN",
    desc: "Verde vibrante con destellos claros para una mirada llamativa.",
    precio: 45000,
    tipo: "estandar",
    img: IMG_PATH + "lentes-pataya-green.jpg",
  },
  {
    id: 5,
    nombre: "ESTONIA BLUE",
    desc: "Azul cristalino con anillo definido y acabado natural.",
    precio: 45000,
    tipo: "reducida",
    img: IMG_PATH + "lentes-estonia-blue.jpg",
  },
  {
    id: 6,
    nombre: "ESTONIA GREEN",
    desc: "Verde suave con matices grises para un look sutil y elegante.",
    precio: 45000,
    tipo: "estandar",
    img: IMG_PATH + "lentes-estonia-green.jpg",
  },
  {
    id: 98,
    nombre: "TABLA DE PESTAÑAS PUNTO A PUNTO",
    desc: "Bandeja de pestañas pelo a pelo para un look natural.",
    precio: 30000,
    tipo: "pestana",
    img: IMG_PATH + "pestanas-1.jpg",
  },
  {
    id: 99,
    nombre: "BANDEJA PESTAÑAS + BOND & SEAL",
    desc: "Kit completo pelo a pelo con pegante adhesivo de alta fijación.",
    precio: 35000,
    tipo: "pestana",
    img: IMG_PATH + "pestanas-1.jpg",
  },
  {
    id: 100,
    nombre: "PEGANTE PARA PESTAÑAS (BOND & SEAL)",
    desc: "Pegante adhesivo de alta fijación para pestañas pelo a pelo.",
    precio: 7000,
    tipo: "pestana",
    img: IMG_PATH + "pegante-1.jpg",
  },
  {
    id: 102,
    nombre: "SOLUCIÓN DE LENTES",
    desc: "Líquido especial para limpiar, desinfectar y conservar tus lentes frescos todo el día.",
    precio: 17000,
    tipo: "accesorio",
    img: IMG_PATH + "solucion.jpg",
  },
  {
    id: 103,
    nombre: "KIT APLICADOR + PINZA",
    desc: "Herramientas con punta suave de silicona para ponerte los lentes de forma fácil e higiénica.",
    precio: 5000,
    tipo: "accesorio",
    img: IMG_PATH + "pinzas.jpg",
  },
  {
    id: 101,
    nombre: "ESTUCHE PORTA-LENTES",
    desc: "Porta-lentes compacto con espejo integrado para llevar tus lentes protegidos a donde vayas.",
    precio: 10000,
    tipo: "accesorio",
    img: IMG_PATH + "estuche.jpg",
  },
  {
    id: 104,
    nombre: "LAVADORA MANUAL PARA LENTES",
    desc: "Elimina suciedad y residuos de forma rápida. Solo agrega solución, gira la tapa manualmente y limpia tus lentes en segundos sin maltratarlos.",
    precio: 10000,
    tipo: "accesorio",
    img: IMG_PATH + "lavadora.jpg",
  },
];

export const TIPOS_LENTE = ["reducida", "estandar"];

export const esLente = (producto) => TIPOS_LENTE.includes(producto.tipo);

export const esAccesorio = (producto) => producto.tipo === "accesorio";

export const getLentes = () => productosBase.filter(esLente);

export const getAccesorios = () => productosBase.filter(esAccesorio);
