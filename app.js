
// ======================================================
// CLUBSOFT - SISTEMA DE GESTIÓN DE CLUBES DEPORTIVOS
// Archivo: app.js
// ======================================================

// Avatar por defecto si el socio no sube foto
const AVATAR_DEFAULT = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

// Credenciales iniciales de demostración
const USER_VALIDO = "user";
const PASS_VALIDO = "1234";

// Lista oficial de categorías
const CATEGORIAS_ORDENADAS = [
  "U8", "U10", "U12 M", "U12 F", "U14 M", "U14 F",
  "U16 M", "U16 F", "U18", "U23", "MAYORES MASC",
  "MAYORES FEM", "SENIOR"
];

// Leer datos guardados de forma segura
function leerDatosLocales(clave, valorPredeterminado) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : valorPredeterminado;
  } catch (error) {
    console.error("No se pudieron leer los datos:", clave, error);
    return valorPredeterminado;
  }
}

// Aranceles predeterminados
let aranceles = leerDatosLocales("clubsoft_aranceles", {
  "U8": 1000,
  "U10": 1100,
  "U12 M": 1200,
  "U12 F": 1200,
  "U14 M": 1300,
  "U14 F": 1300,
  "U16 M": 1400,
  "U16 F": 1400,
  "U18": 1500,
  "U23": 1600,
  "MAYORES MASC": 1800,
  "MAYORES FEM": 1800,
  "SENIOR": 1500
});

let socios = leerDatosLocales("clubsoft_socios", []);
let recibos = leerDatosLocales("clubsoft_recibos", []);
let movimientosCaja = leerDatosLocales("clubsoft_caja", []);
let fotoCargadaBase64 = "";

// Guardar todos los datos en el navegador
function guardarDatosLocales() {
  try {
    localStorage.setItem("clubsoft_socios", JSON.stringify(socios));
    localStorage.setItem("clubsoft_recibos", JSON.stringify(recibos));
    localStorage.setItem("clubsoft_caja", JSON.stringify(movimientosCaja));
    localStorage.setItem("clubsoft_aranceles", JSON.stringify(aranceles));
    return true;
  } catch (error) {
    console.error("No se pudieron guardar los datos:", error);
    alert("No se pudieron guardar los datos. Puede que el navegador no tenga espacio suficiente.");
    return false;
  }
}

// ======================================================
// ELEMENTOS DE LA PÁGINA
// ======================================================

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const btnLogout = document.getElementById("btn-logout");

const hamburgerBtn = document.getElementById("hamburger-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuItems = document.querySelectorAll(".menu-item");
const contentSections = document.querySelectorAll(".content-section");

const cardSocioForm = document.getElementById("card-socio-form");
const formSocioTitulo = document.getElementById("form-socio-titulo");
const socioForm = document.getElementById("socio-form");
const socioIdOriginalInput = document.getElementById("socio-id-original");
const socioFotoInput = document.getElementById("socio-foto-input");

const btnImportarExcel = document.getElementById("btn-importar-excel");
const cardExcelImport = document.getElementById("card-excel-import");
const btnDescargarPlantilla = document.getElementById("btn-descargar-plantilla");
const inputExcelFile = document.getElementById("input-excel-file");
const excelFilename = document.getElementById("excel-filename");

const inputBuscarSocio = document.getElementById("input-buscar-socio");
const pagoForm = document.getElementById("pago-form");
const pagoSocioSelect = document.getElementById("pago-socio-select");
const pagoMontoInput = document.getElementById("pago-monto");

const btnGestionarAranceles = document.getElementById("btn-gestionar-aranceles");
const cardArancelesPanel = document.getElementById("card-aranceles-panel");
const btnCerrarAranceles = document.getElementById("btn-cerrar-aranceles");
const gridArancelesInputs = document.getElementById("grid-aranceles-inputs");
const formAranceles = document.getElementById("form-aranceles");

// ======================================================
// INICIO Y SESIÓN
// ======================================================

function verificarSesionLocal() {
  return localStorage.getItem("clubsoft_logged_in") === "true";
}

function inicializarApp() {
  if (verificarSesionLocal()) {
    if (loginScreen) loginScreen.style.display = "none";
    if (appScreen) appScreen.style.display = "block";
    renderizarTodo();
  } else {
    if (loginScreen) loginScreen.style.display = "flex";
    if (appScreen) appScreen.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", inicializarApp);

// Inicio de sesión de demostración
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("login-user").value.trim().toLowerCase();
    const contrasena = document.getElementById("login-pass").value.trim();

    if (usuario === USER_VALIDO && contrasena === PASS_VALIDO) {
      localStorage.setItem("clubsoft_logged_in", "true");

      if (loginError) loginError.style.display = "none";
      if (loginScreen) loginScreen.style.display = "none";
      if (appScreen) appScreen.style.display = "block";

      renderizarTodo();
    } else if (loginError) {
      loginError.style.display = "block";
    }
  });
}

// Cerrar sesión
if (btnLogout) {
  btnLogout.addEventListener("click", function () {
    localStorage.removeItem("clubsoft_logged_in");

    if (loginForm) loginForm.reset();
    if (loginError) loginError.style.display = "none";
    if (appScreen) appScreen.style.display = "none";
    if (loginScreen) loginScreen.style.display = "flex";
  });
}

// ======================================================
// MENÚ Y NAVEGACIÓN
// ======================================================

function abrirMenu() {
  if (sidebar) sidebar.classList.add("open");
  if (overlay) overlay.classList.add("show");
}

function cerrarMenu() {
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
}

if (hamburgerBtn) hamburgerBtn.addEventListener("click", abrirMenu);
if (closeBtn) closeBtn.addEventListener("click", cerrarMenu);
if (overlay) overlay.addEventListener("click", cerrarMenu);

menuItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    const nombreSeccion = item.getAttribute("data-section");

    menuItems.forEach(function (elemento) {
      elemento.classList.remove("active");
    });

    item.classList.add("active");

    contentSections.forEach(function (seccion) {
      seccion.classList.remove("active");

      if (seccion.id === "sec-" + nombreSeccion) {
        seccion.classList.add("active");
      }
    });

    cerrarMenu();
  });
});

// ======================================================
// FOTO DEL SOCIO
// ======================================================

if (socioFotoInput) {
  socioFotoInput.addEventListener("change", function (e) {
    const archivo = e.target.files[0];

    if (!archivo) {
      fotoCargadaBase64 = "";
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      alert("Seleccioná un archivo de imagen válido.");
      socioFotoInput.value = "";
      return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {
      fotoCargadaBase64 = evento.target.result;
    };

    lector.onerror = function () {
      alert("No se pudo leer la imagen seleccionada.");
    };

    lector.readAsDataURL(archivo);
  });
}

// ======================================================
// UTILIDADES
// ======================================================

function formatearEnlaceWhatsApp(telefono) {
  if (!telefono || telefono === "-") return "-";

  let numero = telefono.toString().replace(/\D/g, "");

  if (numero.startsWith("09")) {
    numero = "598" + numero.substring(1);
  } else if (numero.length === 8 && numero.startsWith("9")) {
    numero = "598" + numero;
  }

  const iconoWhatsApp = `<svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`;

  return `<a href="https://wa.me/${numero}" target="_blank" rel="noopener noreferrer" class="wa-link">${iconoWhatsApp} ${telefono}</a>`;
}

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entidades[caracter];
  });
}

function obtenerEstadoFichaMedica(fechaVencimiento) {
  if (!fechaVencimiento) {
    return { texto: "Sin Registro", badge: "badge-vencido" };
  }

  // Comparar solo fechas, evitando problemas por la hora del día
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencimiento = new Date(fechaVencimiento + "T00:00:00");

  if (Number.isNaN(vencimiento.getTime())) {
    return { texto: "Fecha inválida", badge: "badge-vencido" };
  }

  if (vencimiento >= hoy) {
    return {
      texto: "Vigente (" + fechaVencimiento + ")",
      badge: "badge-vigente"
    };
  }

  return {
    texto: "VENCIDO (" + fechaVencimiento + ")",
    badge: "badge-vencido"
  };
}

// ======================================================
// DASHBOARD
// ======================================================

function renderizarDashboard() {
  const activos = socios.filter(function (socio) {
    return socio.estado === "Activo";
  }).length;

  const deudores = socios.filter(function (socio) {
    return (parseFloat(socio.deuda) || 0) > 0;
  }).length;

  const ingresos = recibos.reduce(function (total, recibo) {
    return total + (parseFloat(recibo.monto) || 0);
  }, 0);

  const elementoActivos = document.getElementById("dash-socios-activos");
  const elementoDeudores = document.getElementById("dash-socios-deudores");
  const elementoIngresos = document.getElementById("dash-ingresos");
  const elementoBalance = document.getElementById("dash-balance");

  if (elementoActivos) elementoActivos.textContent = activos;
  if (elementoDeudores) elementoDeudores.textContent = deudores;
  if (elementoIngresos) elementoIngresos.textContent = "$ " + ingresos.toLocaleString("es-UY");
  if (elementoBalance) elementoBalance.textContent = "$ " + ingresos.toLocaleString("es-UY");
}

// ======================================================
// PADRÓN DE SOCIOS
// ======================================================

function renderizarPadron() {
  const contenedor = document.getElementById("contenedor-padron-categorias");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const busqueda = inputBuscarSocio
    ? inputBuscarSocio.value.trim().toLowerCase()
    : "";

  const sociosFiltrados = socios.filter(function (socio) {
    if (!busqueda) return true;

    const nombre = (socio.nombre || "").toLowerCase();
    const ci = (socio.ci || "").toLowerCase();
    const numero = String(socio.num || "");

    return nombre.includes(busqueda) ||
      ci.includes(busqueda) ||
      numero.includes(busqueda);
  });

  const agrupados = {};

  CATEGORIAS_ORDENADAS.forEach(function (categoria) {
    agrupados[categoria] = [];
  });

  sociosFiltrados.forEach(function (socio) {
    if (!agrupados[socio.categoria]) {
      agrupados[socio.categoria] = [];
    }
    agrupados[socio.categoria].push(socio);
  });

  CATEGORIAS_ORDENADAS.forEach(function (categoria) {
    const lista = agrupados[categoria] || [];

    if (busqueda && lista.length === 0) return;

    const tarjeta = document.createElement("div");
    tarjeta.className = "categoria-card" + (busqueda ? " open" : "");

    let filas = "";

    if (lista.length === 0) {
      filas = `<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:1.2rem;">No hay socios registrados en esta categoría.</td></tr>`;
    } else {
      lista.forEach(function (socio) {
        const estadoSocio = socio.estado || "Activo";
        const claseEstado = estadoSocio === "Activo" ? "badge-activo" : "badge-inactivo";
        const deuda = parseFloat(socio.deuda) || 0;
        const claseCuota = deuda === 0 ? "badge-aldia" : "badge-deudor";
        const textoCuota = deuda === 0 ? "Al día" : "Deudor";
        const ficha = obtenerEstadoFichaMedica(socio.fichaVenc);
        const foto = socio.foto || AVATAR_DEFAULT;
        const telefono = formatearEnlaceWhatsApp(socio.telefono);
        const telefonoTutor = socio.tutorTel && socio.tutorTel !== "-"
          ? formatearEnlaceWhatsApp(socio.tutorTel)
          : "-";

        filas += `
          <tr>
            <td><img src="${escaparHTML(foto)}" class="avatar-img" alt="Foto del socio"></td>
            <td><strong>#${escaparHTML(socio.num)}</strong></td>
            <td>
              <strong>${escaparHTML(socio.nombre)}</strong>
              <span class="sub-info">CI: ${escaparHTML(socio.ci || "-")}</span>
            </td>
            <td><span class="badge ${claseEstado}">${escaparHTML(estadoSocio)}</span></td>
            <td>
              ${telefono}
              ${socio.tutorNombre && socio.tutorNombre !== "-"
                ? `<span class="sub-info">Tutor: ${escaparHTML(socio.tutorNombre)} (${telefonoTutor})</span>`
                : ""}
            </td>
            <td><span class="badge ${ficha.badge}">${escaparHTML(ficha.texto)}</span></td>
            <td><span class="badge ${claseCuota}">${textoCuota}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-edit" onclick="prepararEdicionSocio(${Number(socio.num)})">Editar</button>
                <button class="btn btn-delete" onclick="eliminarSocio(${Number(socio.num)})">Eliminar</button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    tarjeta.innerHTML = `
      <div class="categoria-header" onclick="toggleCategoria(this)">
        <div class="categoria-titulo">
          <span>Categoría ${escaparHTML(categoria)}</span>
          <span class="categoria-badge-count">${lista.length} socios - ($${aranceles[categoria] || 0}/mes)</span>
        </div>
        <svg class="categoria-icon-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div class="categoria-content">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>N°</th>
                <th>Nombre y CI</th>
                <th>Estado</th>
                <th>Teléfono / Contacto WhatsApp</th>
                <th>Ficha Médica</th>
                <th>Estado Cuota</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}

window.toggleCategoria = function (elemento) {
  if (elemento && elemento.parentElement) {
    elemento.parentElement.classList.toggle("open");
  }
};

if (inputBuscarSocio) {
  inputBuscarSocio.addEventListener("input", renderizarPadron);
}

// ======================================================
// IMPORTAR SOCIOS DESDE EXCEL O CSV
// ======================================================

if (btnImportarExcel && cardExcelImport) {
  btnImportarExcel.addEventListener("click", function () {
    const estaOculto = getComputedStyle(cardExcelImport).display === "none";

    cardExcelImport.style.display = estaOculto ? "block" : "none";

    if (estaOculto) {
      cardExcelImport.scrollIntoView({ behavior: "smooth" });
    }
  });
}

if (btnDescargarPlantilla) {
  btnDescargarPlantilla.addEventListener("click", function () {
    if (typeof XLSX === "undefined") {
      alert("No se pudo cargar la herramienta de Excel. Revisá tu conexión a Internet.");
      return;
    }

    const datosPlantilla = [{
      "Número": 201,
      "Nombre y Apellido": "Ejemplo Juan Pérez",
      "Cédula": "4.555.666-7",
      "Estado": "Activo",
      "Fecha Nacimiento": "2012-04-10",
      "Categoría": "U14 M",
      "Teléfono": "099123456",
      "Cobrador": "Cobrador Secretaría",
      "Vencimiento Ficha Médica": "2027-12-31",
      "Tutor Nombre": "Ana Pérez (Madre)",
      "Tutor Teléfono": "099000111"
    }];

    const hoja = XLSX.utils.json_to_sheet(datosPlantilla);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "PlantillaSocios");
    XLSX.writeFile(libro, "ClubSoft_Plantilla_Socios.xlsx");
  });
}

if (inputExcelFile) {
  inputExcelFile.addEventListener("change", function (e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (excelFilename) excelFilename.textContent = archivo.name;

    if (typeof XLSX === "undefined") {
      alert("No se pudo cargar la herramienta de Excel. Revisá tu conexión a Internet.");
      return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {
      try {
        const datos = new Uint8Array(evento.target.result);
        const libro = XLSX.read(datos, { type: "array" });
        const nombreHoja = libro.SheetNames[0];
        const hoja = libro.Sheets[nombreHoja];
        const filas = XLSX.utils.sheet_to_json(hoja);

        let contador = 0;

        filas.forEach(function (fila) {
          const numeroExistente = parseInt(fila["Número"], 10);
          const numeroSocio = Number.isFinite(numeroExistente) && numeroExistente > 0
            ? numeroExistente
            : obtenerSiguienteNumeroSocio();

          const nombre = fila["Nombre y Apellido"] || "Socio Sin Nombre";
          const ci = fila["Cédula"] || "-";
          const estado = fila["Estado"] === "Inactivo" ? "Inactivo" : "Activo";
          const fechaNacimiento = fila["Fecha Nacimiento"] || "";
          let categoria = String(fila["Categoría"] || "SENIOR").trim();

          if (!CATEGORIAS_ORDENADAS.includes(categoria)) {
            categoria = "SENIOR";
          }

          const socioNuevo = {
            num: numeroSocio,
            nombre: String(nombre),
            ci: String(ci),
            estado: estado,
            fechaNac: convertirFechaExcel(fechaNacimiento),
            categoria: categoria,
            telefono: fila["Teléfono"] ? String(fila["Teléfono"]) : "-",
            cobrador: fila["Cobrador"] || "Cobrador Secretaría",
            fichaVenc: convertirFechaExcel(fila["Vencimiento Ficha Médica"]),
            tutorNombre: fila["Tutor Nombre"] || "-",
            tutorTel: fila["Tutor Teléfono"] ? String(fila["Tutor Teléfono"]) : "-",
            foto: AVATAR_DEFAULT,
            deuda: 0,
            desde: "-"
          };

          const indice = socios.findIndex(function (socio) {
            return Number(socio.num) === numeroSocio;
          });

          if (indice >= 0) {
            // Conservar deuda, fecha de deuda y foto del socio existente
            socioNuevo.deuda = parseFloat(socios[indice].deuda) || 0;
            socioNuevo.desde = socios[indice].desde || "-";
            socioNuevo.foto = socios[indice].foto || AVATAR_DEFAULT;
            socios[indice] = { ...socios[indice], ...socioNuevo };
          } else {
            socios.push(socioNuevo);
          }

          contador++;
        });

        guardarDatosLocales();

        alert("Se procesaron " + contador + " socios correctamente.");

        if (cardExcelImport) cardExcelImport.style.display = "none";
        inputExcelFile.value = "";
        if (excelFilename) excelFilename.textContent = "Ningún archivo seleccionado";

        renderizarTodo();
      } catch (error) {
        console.error(error);
        alert("Error al procesar el archivo: " + error.message);
      }
    };

    lector.onerror = function () {
      alert("No se pudo leer el archivo seleccionado.");
    };

    lector.readAsArrayBuffer(archivo);
  });
}

function convertirFechaExcel(valor) {
  if (!valor) return "";

  // Excel puede entregar fechas como números
  if (typeof valor === "number" && typeof XLSX !== "undefined") {
    const fecha = XLSX.SSF.parse_date_code(valor);
    if (fecha) {
      return [
        fecha.y,
        String(fecha.m).padStart(2, "0"),
        String(fecha.d).padStart(2, "0")
      ].join("-");
    }
  }

  const texto = String(valor).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  const partes = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (partes) {
    return partes[3] + "-" +
      partes[2].padStart(2, "0") + "-" +
      partes[1].padStart(2, "0");
  }

  return texto;
}

function obtenerSiguienteNumeroSocio() {
  const mayor = socios.reduce(function (maximo, socio) {
    return Math.max(maximo, parseInt(socio.num, 10) || 0);
  }, 0);

  return mayor + 1;
}

// ======================================================
// GESTIÓN DE ARANCELES
// ======================================================

if (btnGestionarAranceles && cardArancelesPanel) {
  btnGestionarAranceles.addEventListener("click", function () {
    renderizarFormularioAranceles();
    cardArancelesPanel.style.display = "block";
    cardArancelesPanel.scrollIntoView({ behavior: "smooth" });
  });
}

if (btnCerrarAranceles && cardArancelesPanel) {
  btnCerrarAranceles.addEventListener("click", function () {
    cardArancelesPanel.style.display = "none";
  });
}

function renderizarFormularioAranceles() {
  if (!gridArancelesInputs) return;

  gridArancelesInputs.innerHTML = "";

  CATEGORIAS_ORDENADAS.forEach(function (categoria) {
    const grupo = document.createElement("div");
    grupo.className = "form-group";

    const id = "arancel-" + categoria.replace(/\s+/g, "-");

    grupo.innerHTML = `
      <label for="${id}">Cuota Categoría ${escaparHTML(categoria)} ($):</label>
      <input type="number" id="${id}" value="${Number(aranceles[categoria] ?? 0)}" min="0" step="1" required>
    `;

    gridArancelesInputs.appendChild(grupo);
  });
}

if (formAranceles) {
  formAranceles.addEventListener("submit", function (e) {
    e.preventDefault();

    CATEGORIAS_ORDENADAS.forEach(function (categoria) {
      const id = "arancel-" + categoria.replace(/\s+/g, "-");
      const entrada = document.getElementById(id);

      if (entrada) {
        aranceles[categoria] = Math.max(0, parseFloat(entrada.value) || 0);
      }
    });

    guardarDatosLocales();

    alert("Aranceles actualizados correctamente.");

    if (cardArancelesPanel) cardArancelesPanel.style.display = "none";
    renderizarTodo();
  });
}

// ======================================================
// ALTA Y EDICIÓN DE SOCIOS
// ======================================================

const btnNuevoSocio = document.getElementById("btn-nuevo-socio");
const btnCancelarSocio = document.getElementById("btn-cancelar-socio");

if (btnNuevoSocio && socioForm) {
  btnNuevoSocio.addEventListener("click", function () {
    socioForm.reset();
    fotoCargadaBase64 = "";

    if (socioIdOriginalInput) socioIdOriginalInput.value = "";

    const estado = document.getElementById("socio-estado");
    if (estado) estado.value = "Activo";

    if (formSocioTitulo) formSocioTitulo.textContent = "Alta de Socio";
    if (cardSocioForm) {
      cardSocioForm.style.display = "block";
      cardSocioForm.scrollIntoView({ behavior: "smooth" });
    }
  });
}

if (btnCancelarSocio && socioForm) {
  btnCancelarSocio.addEventListener("click", function () {
    if (cardSocioForm) cardSocioForm.style.display = "none";
    socioForm.reset();
    fotoCargadaBase64 = "";
  });
}

if (socioForm) {
  socioForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const idOriginal = socioIdOriginalInput ? socioIdOriginalInput.value : "";
    const numero = parseInt(document.getElementById("socio-num").value, 10);
    const nombre = document.getElementById("socio-nombre").value.trim();

    if (!Number.isInteger(numero) || numero <= 0) {
      alert("Ingresá un número de socio válido.");
      return;
    }

    if (!nombre) {
      alert("Ingresá el nombre y apellido del socio.");
      return;
    }

    // Evitar números de socio duplicados
    const duplicado = socios.some(function (socio) {
      return Number(socio.num) === numero &&
        Number(socio.num) !== Number(idOriginal);
    });

    if (duplicado) {
      alert("Ya existe un socio con ese número.");
      return;
    }

    const socioExistente = idOriginal
      ? socios.find(function (socio) {
          return Number(socio.num) === Number(idOriginal);
        })
      : null;

    const socioNuevo = {
      num: numero,
      nombre: nombre,
      ci: document.getElementById("socio-ci").value.trim(),
      estado: document.getElementById("socio-estado").value,
      fechaNac: document.getElementById("socio-fecha-nac").value,
      categoria: document.getElementById("socio-categoria").value,
      telefono: document.getElementById("socio-telefono").value.trim(),
      cobrador: document.getElementById("socio-cobrador").value,
      fichaVenc: document.getElementById("socio-ficha-venc").value,
      tutorNombre: document.getElementById("socio-tutor-nombre").value.trim() || "-",
      tutorTel: document.getElementById("socio-tutor-tel").value.trim() || "-",
      foto: fotoCargadaBase64 || (socioExistente ? socioExistente.foto : AVATAR_DEFAULT),
      deuda: socioExistente ? (parseFloat(socioExistente.deuda) || 0) : 0,
      desde: socioExistente ? (socioExistente.desde || "-") : "-"
    };

    if (socioExistente) {
      socios = socios.filter(function (socio) {
        return Number(socio.num) !== Number(idOriginal);
      });
    }

    socios.push(socioNuevo);

    guardarDatosLocales();

    alert("Socio guardado correctamente.");

    socioForm.reset();
    fotoCargadaBase64 = "";

    if (cardSocioForm) cardSocioForm.style.display = "none";

    renderizarTodo();
  });
}

window.prepararEdicionSocio = function (numeroSocio) {
  const socio = socios.find(function (elemento) {
    return Number(elemento.num) === Number(numeroSocio);
  });

  if (!socio) return;

  document.getElementById("socio-num").value = socio.num;
  document.getElementById("socio-nombre").value = socio.nombre || "";
  document.getElementById("socio-ci").value = socio.ci || "";
  document.getElementById("socio-estado").value = socio.estado || "Activo";
  document.getElementById("socio-fecha-nac").value = socio.fechaNac || "";
  document.getElementById("socio-categoria").value = socio.categoria || "SENIOR";
  document.getElementById("socio-telefono").value = socio.telefono || "";
  document.getElementById("socio-cobrador").value = socio.cobrador || "Cobrador Secretaría";
  document.getElementById("socio-ficha-venc").value = socio.fichaVenc || "";
  document.getElementById("socio-tutor-nombre").value =
    socio.tutorNombre === "-" ? "" : (socio.tutorNombre || "");
  document.getElementById("socio-tutor-tel").value =
    socio.tutorTel === "-" ? "" : (socio.tutorTel || "");

  fotoCargadaBase64 = socio.foto || "";

  if (socioIdOriginalInput) socioIdOriginalInput.value = socio.num;
  if (formSocioTitulo) formSocioTitulo.textContent = "Editar ficha del socio #" + socio.num;

  if (cardSocioForm) {
    cardSocioForm.style.display = "block";
    cardSocioForm.scrollIntoView({ behavior: "smooth" });
  }
};

window.eliminarSocio = function (numeroSocio) {
  const socio = socios.find(function (elemento) {
    return Number(elemento.num) === Number(numeroSocio);
  });

  if (!socio) return;

  const confirmar = confirm(
    "¿Estás seguro de eliminar la ficha de #" +
    numeroSocio + " - " + socio.nombre + "?"
  );

  if (!confirmar) return;

  socios = socios.filter(function (elemento) {
    return Number(elemento.num) !== Number(numeroSocio);
  });

  guardarDatosLocales();
  renderizarTodo();
};

// ======================================================
// CUENTA CORRIENTE
// ======================================================

function renderizarCuentaCorriente() {
  const tbody = document.getElementById("tabla-cuentas-corrientes");
  if (!tbody) return;

  tbody.innerHTML = "";

  socios.forEach(function (socio) {
    const fila = document.createElement("tr");
    const deuda = parseFloat(socio.deuda) || 0;
    const clase = deuda === 0 ? "badge-aldia" : "badge-deudor";
    const estado = deuda === 0 ? "Sin Deuda" : "Moroso";
    const textoBoton = deuda === 0 ? "Al día" : "Cobrar";
    const claseBoton = deuda === 0 ? "btn-secondary" : "btn-success";

    fila.innerHTML = `
      <td>${escaparHTML(socio.nombre)} (#${escaparHTML(socio.num)})</td>
      <td>${escaparHTML(socio.categoria)}</td>
      <td><strong>$ ${deuda.toLocaleString("es-UY")}</strong></td>
      <td>${escaparHTML(socio.desde || "-")}</td>
      <td><span class="badge ${clase}">${estado}</span></td>
      <td>
        <button class="btn ${claseBoton}" ${deuda === 0 ? "disabled" : ""}
          onclick="cobrarDeudaCompleta(${Number(socio.num)})">
          ${textoBoton}
        </button>
      </td>
    `;

    tbody.appendChild(fila);
  });
}

window.cobrarDeudaCompleta = function (numeroSocio) {
  const socio = socios.find(function (elemento) {
    return Number(elemento.num) === Number(numeroSocio);
  });

  if (!socio || (parseFloat(socio.deuda) || 0) <= 0) return;

  procesarCobroSocio(socio, parseFloat(socio.deuda), "Efectivo");
};

// ======================================================
// PAGOS Y RECIBOS
// ======================================================

function renderizarPagos() {
  if (pagoSocioSelect) {
    const seleccionado = pagoSocioSelect.value;
    pagoSocioSelect.innerHTML = "";

    socios.forEach(function (socio) {
      const opcion = document.createElement("option");
      opcion.value = socio.num;
      opcion.textContent =
        "#" + socio.num + " - " + socio.nombre +
        " (Deuda: $" + (parseFloat(socio.deuda) || 0) + ")";

      pagoSocioSelect.appendChild(opcion);
    });

    if (seleccionado) pagoSocioSelect.value = seleccionado;

    actualizarMontoSugerido();
  }

  const tbody = document.getElementById("tabla-recibos");
  if (!tbody) return;

  tbody.innerHTML = "";

  recibos.forEach(function (recibo) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td><strong>#${escaparHTML(recibo.id)}</strong></td>
      <td>${escaparHTML(recibo.socio)}</td>
      <td>$ ${(parseFloat(recibo.monto) || 0).toLocaleString("es-UY")}</td>
      <td>${escaparHTML(recibo.medio)}</td>
      <td>${escaparHTML(recibo.fecha)}</td>
    `;

    tbody.appendChild(fila);
  });
}

function actualizarMontoSugerido() {
  if (!pagoSocioSelect || !pagoMontoInput) return;

  const numero = parseInt(pagoSocioSelect.value, 10);

  const socio = socios.find(function (elemento) {
    return Number(elemento.num) === numero;
  });

  if (socio) {
    pagoMontoInput.value = parseFloat(socio.deuda) || 0;
  } else {
    pagoMontoInput.value = "";
  }
}

if (pagoSocioSelect) {
  pagoSocioSelect.addEventListener("change", actualizarMontoSugerido);
}

if (pagoForm) {
  pagoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const numero = parseInt(pagoSocioSelect.value, 10);
    const monto = parseFloat(pagoMontoInput.value);
    const medio = document.getElementById("pago-medio").value;

    const socio = socios.find(function (elemento) {
      return Number(elemento.num) === numero;
    });

    if (!socio) {
      alert("Seleccioná un socio válido.");
      return;
    }

    if (!Number.isFinite(monto) || monto <= 0) {
      alert("Ingresá un monto válido.");
      return;
    }

    if ((parseFloat(socio.deuda) || 0) <= 0) {
      alert("Este socio no tiene deuda pendiente.");
      return;
    }

    if (monto > socio.deuda) {
      alert("El monto no puede ser mayor que la deuda pendiente.");
      return;
    }

    procesarCobroSocio(socio, monto, medio);
    pagoForm.reset();
    actualizarMontoSugerido();
  });
}

function procesarCobroSocio(socio, monto, medio) {
  const deudaActual = parseFloat(socio.deuda) || 0;
  const montoCobrado = Math.min(deudaActual, parseFloat(monto) || 0);

  if (montoCobrado <= 0) return;

  socio.deuda = Math.max(0, deudaActual - montoCobrado);

  if (socio.deuda === 0) {
    socio.desde = "-";
  }

  const reciboId = Date.now();

  recibos.push({
    id: reciboId,
    socio: socio.nombre,
    monto: montoCobrado,
    medio: medio,
    fecha: new Date().toLocaleDateString("es-UY")
  });

  movimientosCaja.push({
    tipo: "Ingreso",
    concepto: "Recibo #" + reciboId,
    monto: montoCobrado,
    detalle: "Pago de " + socio.nombre
  });

  guardarDatosLocales();
  renderizarTodo();
}

// ======================================================
// CAJA
// ======================================================

function renderizarCaja() {
  const tbody = document.getElementById("tabla-caja");
  if (!tbody) return;

  tbody.innerHTML = "";

  movimientosCaja.forEach(function (movimiento) {
    const fila = document.createElement("tr");
    const clase = movimiento.tipo === "Ingreso" ? "badge-aldia" : "badge-deudor";

    fila.innerHTML = `
      <td><span class="badge ${clase}">${escaparHTML(movimiento.tipo)}</span></td>
      <td><strong>${escaparHTML(movimiento.concepto)}</strong></td>
      <td>$ ${(parseFloat(movimiento.monto) || 0).toLocaleString("es-UY")}</td>
      <td>${escaparHTML(movimiento.detalle)}</td>
    `;

    tbody.appendChild(fila);
  });
}

// ======================================================
// GENERAR DÉBITOS MENSUALES
// ======================================================

const btnGenerarDebitos = document.getElementById("btn-generar-debitos");

if (btnGenerarDebitos) {
  btnGenerarDebitos.addEventListener("click", function () {
    const entradaMes = document.getElementById("debit-mes");
    const entradaModo = document.getElementById("debit-modo");

    const mesSeleccionado = entradaMes ? entradaMes.value : "";
    const modo = entradaModo ? entradaModo.value : "categoria";

    if (!mesSeleccionado) {
      alert("Seleccioná el mes para generar las cuotas.");
      return;
    }

    const claveMes = "clubsoft_debitos_" + mesSeleccionado;
    const mesesGenerados = leerDatosLocales("clubsoft_meses_debitos", []);

    if (mesesGenerados.includes(mesSeleccionado)) {
      alert("Ya se generaron los débitos de " + mesSeleccionado + ". No se repetirán.");
      return;
    }

    let montoFijo = 0;

    if (modo === "fijo") {
      const entrada = prompt("Ingresá el monto fijo mensual para cada socio activo:");

      if (entrada === null) return;

      montoFijo = parseFloat(entrada);

      if (!Number.isFinite(montoFijo) || montoFijo <= 0) {
        alert("Ingresá un monto mayor que cero.");
        return;
      }
    }

    let cantidad = 0;

    socios.forEach(function (socio) {
      if (socio.estado !== "Activo") return;

      const cuota = modo === "fijo"
        ? montoFijo
        : (parseFloat(aranceles[socio.categoria]) || 0);

      if (cuota <= 0) return;

      socio.deuda = (parseFloat(socio.deuda) || 0) + cuota;

      if (!socio.desde || socio.desde === "-") {
        socio.desde = mesSeleccionado;
      }

      cantidad++;
    });

    mesesGenerados.push(mesSeleccionado);
    localStorage.setItem("clubsoft_meses_debitos", JSON.stringify(mesesGenerados));
    localStorage.setItem(claveMes, JSON.stringify({ cantidad: cantidad, fecha: new Date().toISOString() }));

    guardarDatosLocales();

    alert("Se generaron las cuotas de " + mesSeleccionado + " para " + cantidad + " socios activos.");

    renderizarTodo();
  });
}

// ======================================================
// EXPORTACIONES A EXCEL Y PDF
// ======================================================

window.exportarPadronExcel = function () {
  if (typeof XLSX === "undefined") {
    alert("No se pudo cargar la herramienta de Excel.");
    return;
  }

  const datos = socios.map(function (socio) {
    return {
      "Número": socio.num,
      "Nombre y Apellido": socio.nombre,
      "Cédula": socio.ci,
      "Estado": socio.estado,
      "Fecha Nacimiento": socio.fechaNac,
      "Categoría": socio.categoria,
      "Teléfono": socio.telefono,
      "Cobrador": socio.cobrador,
      "Vencimiento Ficha Médica": socio.fichaVenc,
      "Tutor": socio.tutorNombre,
      "Teléfono Tutor": socio.tutorTel,
      "Deuda": socio.deuda,
      "Debe Desde": socio.desde
    };
  });

  exportarDatosExcel(datos, "ClubSoft_Padron_Socios");
};

window.exportarDeudoresExcel = function () {
  const datos = socios
    .filter(function (socio) {
      return (parseFloat(socio.deuda) || 0) > 0;
    })
    .map(function (socio) {
      return {
        "Número": socio.num,
        "Nombre": socio.nombre,
        "Categoría": socio.categoria,
        "Deuda": socio.deuda,
        "Debe Desde": socio.desde
      };
    });

  exportarDatosExcel(datos, "ClubSoft_Deudores");
};

window.exportarCajaExcel = function () {
  const datos = movimientosCaja.map(function (movimiento) {
    return {
      "Tipo": movimiento.tipo,
      "Concepto": movimiento.concepto,
      "Monto": movimiento.monto,
      "Detalle": movimiento.detalle
    };
  });

  exportarDatosExcel(datos, "ClubSoft_Movimientos_Caja");
};

function exportarDatosExcel(datos, nombreArchivo) {
  if (typeof XLSX === "undefined") {
    alert("No se pudo cargar la herramienta de Excel.");
    return;
  }

  if (datos.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hoja, "Datos");
  XLSX.writeFile(libro, nombreArchivo + ".xlsx");
}

window.exportarAPDF = function (idContenedor, nombreArchivo) {
  if (typeof html2pdf === "undefined") {
    alert("No se pudo cargar la herramienta para generar PDF.");
    return;
  }

  const elemento = document.getElementById(idContenedor);

  if (!elemento) {
    alert("No se encontró el contenido que querés exportar.");
    return;
  }

  const opciones = {
    margin: 10,
    filename: nombreArchivo + ".pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
  };

  html2pdf().set(opciones).from(elemento).save();
};

// ======================================================
// ACTUALIZAR TODAS LAS PANTALLAS
// ======================================================

function renderizarTodo() {
  renderizarDashboard();
  renderizarPadron();
  renderizarCuentaCorriente();
  renderizarPagos();
  renderizarCaja();
}
