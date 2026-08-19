const productosBase = [
  {
    id: 1,
    nombre: "ANGELES AMBER",
    desc: "Resalta tu mirada con un tono verde natural y un acabado espectacular.",
    precio: 45000,
    tipo: "reducida",
    img: "ANGELES-AMBER.jpg",
  },
  {
    id: 2,
    nombre: "CITRINA BROWN",
    desc: "Brillo avellana cálido e intenso con acabado hiperrealista.",
    precio: 45000,
    tipo: "estandar",
    img: "lentes-citrina-brown.jpg",
  },
  {
    id: 3,
    nombre: "CHOCO DARK",
    desc: "Tono café profundo e impresionante.",
    precio: 45000,
    tipo: "reducida",
    img: "lentes-choco-dark.jpg",
  },
  {
    id: 99,
    nombre: "BANDEJA PESTAÑAS + BOND & SEAL",
    desc: "Kit completo pelo a pelo con pegante adhesivo de alta fijación.",
    precio: 35000,
    tipo: "pestana",
    img: "pestanas-1.jpg",
  },
  {
    id: 101,
    nombre: "ESTUCHE KIT VIAJERO",
    desc: "Incluye porta lentes, espejo y aplicadores.",
    precio: 12000,
    img: "estuche.jpg",
  },
  {
    id: 102,
    nombre: "SOLUCIÓN MULTIPROPÓSITO 120ML",
    desc: "Líquido especial para desinfectar y conservar tus lentes.",
    precio: 18000,
    img: "solucion.jpg",
  },
  {
    id: 103,
    nombre: "KIT APLICADOR + PINZAS",
    desc: "Herramientas con punta de silicona para colocación higiénica.",
    precio: 8000,
    img: "pinzas.jpg",
  },
  {
    id: 104,
    nombre: "LAVADORA MANUAL PARA LENTES",
    desc: "Elimina residuos de forma rápida girando la tapa.",
    precio: 16000,
    img: "lavadora.jpg",
  },
];

let carrito = [];
let productoSeleccionadoModal = null;
let cantidadModal = 1;
let usuarioLogueado = null;

document.addEventListener("DOMContentLoaded", () => {
  renderLentes(productosBase.filter((p) => p.precio === 45000));
  renderAccesorios(productosBase.filter((p) => p.id >= 101));
});

function mostrarSeccion(seccion) {
  if (seccion === "carrito") {
    document.getElementById("view-store").style.display = "none";
    document.getElementById("view-cart").style.display = "block";
    renderCarritoPagina();
    window.scrollTo(0, 0);
  } else {
    document.getElementById("view-store").style.display = "block";
    document.getElementById("view-cart").style.display = "none";
  }
}

function renderLentes(items) {
  const container = document.getElementById("grid-lentes-cafe");
  if (!container) return;
  container.innerHTML = items
    .map(
      (prod) => `
    <div class="product-card-figma">
      <img src="${prod.img}" alt="${prod.nombre}" onclick="abrirModalDetalle(${prod.id})">
      <div class="card-info">
        <h4 onclick="abrirModalDetalle(${prod.id})" style="cursor:pointer;">${prod.nombre}</h4>
        <p class="price">$${prod.precio.toLocaleString()}</p>
      </div>
      <button class="btn-add-figma" onclick="agregarAlCarritoPorId(${prod.id})">AÑADIR AL CARRITO</button>
    </div>
  `,
    )
    .join("");
}

function renderAccesorios(items) {
  const container = document.getElementById("grid-accesorios");
  if (!container) return;
  container.innerHTML = items
    .map(
      (acc) => `
    <div class="product-card-figma">
      <img src="${acc.img}" alt="${acc.nombre}">
      <div class="card-info">
        <h4>${acc.nombre}</h4>
        <p class="price">$${acc.precio.toLocaleString()}</p>
      </div>
      <button class="btn-add-figma" onclick="agregarAlCarritoPorId(${acc.id})">AÑADIR AL CARRITO</button>
    </div>
  `,
    )
    .join("");
}

function filtrarLentes(tipo, evt) {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach((b) => b.classList.remove("active"));
  evt.target.classList.add("active");
  const lentes = productosBase.filter((p) => p.precio === 45000);
  if (tipo === "todos") {
    renderLentes(lentes);
  } else {
    renderLentes(lentes.filter((l) => l.tipo === tipo));
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  actualizarBadge();
  renderCarritoPagina();
}

function cambiarCantidadCart(id, delta) {
  const item = carrito.find((i) => i.id === id);
  if (item) {
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    actualizarBadge();
    renderCarritoPagina();
  }
}

function renderCarritoPagina() {
  const container = document.getElementById("cart-products-container");
  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);
  document.getElementById("cart-title-count").innerText =
    `TU CARRITO (${totalItems})`;

  if (carrito.length === 0) {
    container.innerHTML =
      '<p style="padding: 1rem 0;">El carrito está vacío.</p>';
    calcularCostosEnvio();
    return;
  }

  container.innerHTML = carrito
    .map(
      (item) => `
    <div class="cart-item-row">
      <img src="${item.img}" alt="${item.nombre}">
      <div class="cart-item-details">
        <p><strong>Producto:</strong> ${item.nombre}</p>
        <p><strong>Detalle:</strong> Lente / Accesorio original MARÃO</p>
        <div class="qty-btn-group">
          <button onclick="cambiarCantidadCart(${item.id}, -1)">-</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidadCart(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price-actions">
        <button class="btn-remove-item" onclick="eliminarDelCarrito(${item.id})" title="Quitar del carrito">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <span class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString()}</span>
      </div>
    </div>
    <hr class="dashed-divider">
  `,
    )
    .join("");

  calcularCostosEnvio();
}

function agregarAlCarritoPorId(id, redirigir = true) {
  const prod = productosBase.find((p) => p.id === id);
  if (prod) {
    const existe = carrito.find((item) => item.id === id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...prod, cantidad: 1 });
    }
    actualizarBadge();
    if (redirigir) mostrarSeccion("carrito");
  }
}

function actualizarBadge() {
  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);
  document.getElementById("cart-badge").innerText = totalItems;
}

function calcularCostosEnvio() {
  const subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const selectorEnvio = document.getElementById("shipping-city").value;
  let costoEnvio = selectorEnvio === "nacional" ? 22000 : 10000;
  const totalFinal = subtotal + costoEnvio;

  document.getElementById("summary-subtotal").innerText =
    `$${subtotal.toLocaleString()}`;
  document.getElementById("summary-shipping").innerText =
    `$${costoEnvio.toLocaleString()}`;
  document.getElementById("summary-total").innerText =
    `$${totalFinal.toLocaleString()}`;
}

function detectarTipoTarjeta(input) {
  let valor = input.value.replace(/\D/g, "");
  let valorFormateado = valor.match(/.{1,4}/g)?.join(" ") || "";
  input.value = valorFormateado;

  const badge = document.getElementById("card-brand-badge");
  const label = document.getElementById("card-detected-label");

  badge.className = "card-badge-dynamic";

  if (valor.length === 0) {
    badge.innerText = "DESCONOCIDO";
    label.innerText = "Escribe los dígitos para detectar el tipo";
    return;
  }

  if (/^4/.test(valor)) {
    badge.innerText = "VISA";
    badge.classList.add("visa");
    label.innerText = "Tarjeta Visa (Débito/Crédito) Detectada ✔️";
  } else if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(valor)) {
    badge.innerText = "MASTERCARD";
    badge.classList.add("mastercard");
    label.innerText = "Tarjeta MasterCard Detectada ✔️";
  } else if (/^3[47]/.test(valor)) {
    badge.innerText = "AMEX";
    badge.classList.add("amex");
    label.innerText = "American Express Detectada ✔️";
  } else if (/^3\d{9}$/.test(valor)) {
    badge.innerText = "NEQUI";
    badge.classList.add("nequi");
    label.innerText = "Número de Nequi Registrado ✔️";
  } else {
    badge.innerText = "OTRA";
    label.innerText = "Tarjeta de Crédito / Débito Genérica";
  }
}

function togglePaymentInputs() {
  const method = document.getElementById("payment-type-select").value;
  const cardBox = document.getElementById("card-input-box");
  const cardInput = document.getElementById("card-number-input");

  if (method === "efectivo") {
    cardBox.style.display = "none";
  } else {
    cardBox.style.display = "block";
    cardInput.placeholder =
      method === "nequi" ? "300 123 4567" : "4000 1234 5678 9010";
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  if (data) {
    usuarioLogueado = {
      nombre: data.name,
      email: data.email,
      foto: data.picture,
    };
    actualizarInterfazUsuario();
    cerrarModalLogin();
  }
}

function actualizarInterfazUsuario() {
  const container = document.getElementById("user-profile-container");
  if (usuarioLogueado) {
    container.innerHTML = `
      <img src="${usuarioLogueado.foto}" alt="${usuarioLogueado.nombre}" class="user-avatar" title="${usuarioLogueado.email}">
      <span class="user-name">${usuarioLogueado.nombre.split(" ")[0]}</span>
      <button class="btn-logout" onclick="cerrarSesion()" title="Cerrar sesión"><i class="fa-solid fa-right-from-bracket"></i></button>
    `;
  } else {
    container.innerHTML = `<button class="icon-btn" onclick="openLoginModal()"><i class="fa-solid fa-user"></i></button>`;
  }
}

function cerrarSesion() {
  usuarioLogueado = null;
  actualizarInterfazUsuario();
}

function openLoginModal() {
  document.getElementById("modal-login").style.display = "flex";
}

function cerrarModalLogin() {
  document.getElementById("modal-login").style.display = "none";
}

function abrirModalDetalle(id) {
  const prod = productosBase.find((p) => p.id === id);
  if (!prod) return;
  productoSeleccionadoModal = prod;
  cantidadModal = 1;

  document.getElementById("modal-img").src = prod.img;
  document.getElementById("modal-title").innerText = prod.nombre;
  document.getElementById("modal-price").innerText =
    `$${prod.precio.toLocaleString()}`;
  document.getElementById("modal-desc").innerText = prod.desc;

  document.getElementById("modal-product-detail").style.display = "flex";
}

function cerrarModalDetalle() {
  document.getElementById("modal-product-detail").style.display = "none";
}

function enviarPedidoWhatsApp() {
  // 1. Validar que el carrito no esté vacío
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega algún producto antes de finalizar.");
    return;
  }

  // 2. Validar Dirección
  const direccionInput = document.getElementById("user-address-input");
  const direccion = direccionInput ? direccionInput.value.trim() : "";

  if (!direccion) {
    alert("Por favor ingresa tu dirección exacta de entrega.");
    direccionInput.focus();
    return;
  }

  // Validación básica de dirección (mínimo 8 caracteres para evitar textos como "no", "casa", "x")
  if (direccion.length < 8) {
    alert(
      "Por favor ingresa una dirección de entrega válida y completa (ej. Calle 15 # 4-20 Apt 302).",
    );
    direccionInput.focus();
    return;
  }

  // 3. Validar Datos de Pago (Tarjeta / Cuenta)
  const selectorMetodoPago = document.getElementById(
    "payment-type-select",
  ).value;
  const cardInput = document.getElementById("card-number-input");
  const numTarjeta = cardInput ? cardInput.value.trim() : "";
  const tipoTarjeta = document.getElementById("card-brand-badge")
    ? document.getElementById("card-brand-badge").innerText
    : "";

  // Si el pago NO es efectivo/contraentrega, exigimos el número de tarjeta/cuenta
  if (selectorMetodoPago !== "efectivo") {
    if (!numTarjeta) {
      alert("Por favor ingresa el número de tu tarjeta o cuenta.");
      cardInput.focus();
      return;
    }

    // Limpiamos espacios para contar solo los dígitos
    const digitos = numTarjeta.replace(/\s+/g, "");

    // Si es Nequi exigimos 10 dígitos (número de celular en Colombia), si es tarjeta entre 13 y 19 dígitos
    if (selectorMetodoPago === "nequi" && digitos.length !== 10) {
      alert("Por favor ingresa un número de cuenta Nequi válido (10 dígitos).");
      cardInput.focus();
      return;
    } else if (
      selectorMetodoPago !== "nequi" &&
      (digitos.length < 13 || digitos.length > 19)
    ) {
      alert("Por favor ingresa un número de tarjeta válido.");
      cardInput.focus();
      return;
    }
  }

  // --- SI PASA TODAS LAS VALIDACIONES, SE CONSTRUYE EL MENSAJE ---
  const selectorEnvio = document.getElementById("shipping-city").value;
  const costoEnvio = selectorEnvio === "nacional" ? 22000 : 10000;
  const textoEnvio =
    selectorEnvio === "nacional"
      ? "Nacional ($22.000)"
      : "Bogotá / Soacha Contraentrega ($10.000)";

  let subtotal = 0;
  let lineas = [];

  lineas.push("¡Hola MARÃO! Quiero realizar el siguiente pedido desde la web:");
  lineas.push("");

  if (typeof usuarioLogueado !== "undefined" && usuarioLogueado) {
    lineas.push(
      `• *Cliente:* ${usuarioLogueado.nombre} (${usuarioLogueado.email})`,
    );
    lineas.push("");
  }

  carrito.forEach((item, index) => {
    const totalProd = item.precio * item.cantidad;
    subtotal += totalProd;
    lineas.push(
      `${index + 1}. *${item.nombre}* x${item.cantidad} - $${totalProd.toLocaleString()}`,
    );
  });

  const totalFinal = subtotal + costoEnvio;

  lineas.push("");
  lineas.push(`• *Tipo de Envío:* ${textoEnvio}`);
  lineas.push(`• *Dirección:* ${direccion}`);

  let detallePago = `• *Método de Pago:* ${selectorMetodoPago.toUpperCase()}`;
  if (selectorMetodoPago !== "efectivo" && numTarjeta) {
    const ultimos4 = numTarjeta.slice(-4);
    detallePago += ` (${tipoTarjeta} terminada en ****${ultimos4})`;
  }
  lineas.push(detallePago);

  lineas.push(`• *Total a pagar:* $${totalFinal.toLocaleString()}`);
  lineas.push("");
  lineas.push("¡Quedo atento(a) para confirmar la entrega de mi pedido");

  const mensajeTexto = lineas.join("\n");
  const urlWA = `https://wa.me/573243744983?text=${encodeURIComponent(mensajeTexto)}`;

  window.open(urlWA, "_blank");
}
