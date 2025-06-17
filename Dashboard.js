// =============================
// Configuración de Firebase
// =============================
const firebaseConfig = {
    apiKey: "AIzaSyCeVjR_a-Ws1MhmI6REyshNWk3-GUWK_Q",
    authDomain: "prueba-10764.firebaseapp.com",
    databaseURL: "https://prueba-10764-default-rtdb.firebaseio.com",
    projectId: "prueba-10764",
    storageBucket: "prueba-10764.appspot.com",
    messagingSenderId: "1088604649539",
    appId: "1:1088604649539:web:c3629a654dabc7c8a7cf6f"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// =============================
// Variables globales
// =============================
let usuarioActual = null;
let datosUsuario = null;
let transacciones = [];

// =============================
// Elementos del DOM
// =============================
const nombreUsuarioElem = document.getElementById("nombre-usuario");
const cuentaNumeroElem = document.getElementById("numero-cuenta");
const saldoElem = document.getElementById("saldo");
const fechaCreacionElem = document.getElementById("fecha-creacion");
const titularElem = document.getElementById("titular");

// =============================
// Función principal al cargar la página
// =============================
document.addEventListener("DOMContentLoaded", () => {
    const nombreUsuario = sessionStorage.getItem("usuario");
    if (!nombreUsuario) {
        alert("Debe iniciar sesión.");
        window.location.href = "usuario.html";
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!usuario) {
        alert("Usuario no encontrado.");
        return;
    }

    datosUsuario = usuario;

    if (!datosUsuario.numeroCuenta) {
        datosUsuario.numeroCuenta = generarNumeroCuenta();
        datosUsuario.fechaCreacion = obtenerFechaHoy();
        const index = usuarios.findIndex(u => u.nombre === nombreUsuario);
        usuarios[index] = datosUsuario;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        db.ref('usuarios/' + datosUsuario.cedula + '/numeroCuenta').set(datosUsuario.numeroCuenta);
        db.ref('usuarios/' + datosUsuario.cedula + '/fechaCreacion').set(datosUsuario.fechaCreacion);

    }

    db.ref("usuarios/" + datosUsuario.cedula).once("value").then(snapshot => {
        if (snapshot.exists()) {
            usuarioActual = snapshot.val();
            usuarioActual.cedula = datosUsuario.cedula;
            mostrarDatosUsuario();
            mostrarResumenTransacciones();
        } else {
            alert("No se encontraron datos del usuario en Firebase.");
        }
    });
});

// =============================
// Navegación
// =============================
let seccionVisible = null;

function mostrarOpcion(opcion) {
    if (opcion === 'cerrar') {
        cerrarSesion();
        return;
    }

    const nuevaSeccion = document.getElementById(opcion);
    if (!nuevaSeccion) return;

    const yaVisible = !nuevaSeccion.classList.contains("oculto");
    if (seccionVisible === nuevaSeccion && yaVisible) {
        nuevaSeccion.classList.add("oculto");
        seccionVisible = null;
        return;
    }

    ocultarSecciones();

    switch (opcion) {
        case 'consignacion':
            mostrarFormularioConsignacion();
            break;
        case 'retiro':
            retirar();
            break;
        case 'extracto':
            generarExtracto();
            break;
        case 'resumen':
            mostrarResumenTransacciones();
            break;
        case 'servicios':
            nuevaSeccion.classList.remove("oculto");
            break;
        case 'certificado':
            mostrarCertificado();
            break;
        default:
            console.warn("Opción no reconocida:", opcion);
            return;
    }

    seccionVisible = nuevaSeccion;
}

function ocultarSecciones() {
    const ids = [
        "consignacion", "retiro", "deposito", "contenido",
        "seccionReporte", "servicios", "certificado",
        "resumenTransacciones", "cerrarSesion"
    ];
    ids.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.classList.add("oculto");
    });
}

// =============================
// Funciones de operaciones bancarias
// =============================
function mostrarFormularioConsignacion() {
    document.getElementById("consignacion").classList.remove("oculto");
    document.getElementById("cuentaUsuario").textContent = usuarioActual.numeroCuenta || "---";
    document.getElementById("nombreUsuario").textContent = usuarioActual.nombre || "---";
}

function realizarConsignacion() {
    const monto = parseFloat(document.getElementById("montoConsignar").value);
    if (isNaN(monto) || monto <= 0) return alert("Ingrese un valor válido.");

    usuarioActual.saldo = (usuarioActual.saldo || 0) + monto;

    const tx = {
        fecha: obtenerFechaHoy(),
        referencia: generarReferencia(),
        tipo: "Consignación",
        descripcion: "Consignación electrónica",
        valor: monto
    };

    usuarioActual.transacciones = usuarioActual.transacciones || [];
    usuarioActual.transacciones.push(tx);

    db.ref("usuarios/" + usuarioActual.cedula).update({
        saldo: usuarioActual.saldo,
        transacciones: usuarioActual.transacciones
    });

    document.getElementById("detalleConsignacion").innerHTML = `
      Se consignaron <strong>$${monto.toLocaleString()}</strong> a la cuenta <strong>${usuarioActual.numeroCuenta}</strong><br>
      Fecha: ${tx.fecha} | Ref: ${tx.referencia}
    `;
    document.getElementById("resumenConsignacion").classList.remove("oculto");

    mostrarDatosUsuario();
    mostrarResumenTransacciones();
    document.getElementById("montoConsignar").value = "";
}

function retirar() {
    document.getElementById("retiro").classList.remove("oculto");
    document.getElementById("cuentaUsuarioRetiro").textContent = usuarioActual.numeroCuenta || "---";
    document.getElementById("nombreUsuarioRetiro").textContent = usuarioActual.nombre || "---";
}

function realizarRetiro() {
    const monto = parseFloat(document.getElementById("montoRetirar").value);
    if (isNaN(monto) || monto <= 0) return alert("Ingrese un monto válido.");
    if (usuarioActual.saldo < monto) return alert("Saldo insuficiente.");

    usuarioActual.saldo -= monto;

    const tx = {
        fecha: obtenerFechaHoy(),
        referencia: generarReferencia(),
        tipo: "Retiro",
        descripcion: "Retiro de efectivo",
        valor: monto
    };

    usuarioActual.transacciones = usuarioActual.transacciones || [];
    usuarioActual.transacciones.push(tx);

    db.ref("usuarios/" + usuarioActual.cedula).update({
        saldo: usuarioActual.saldo,
        transacciones: usuarioActual.transacciones
    });

    document.getElementById("detalleRetiro").textContent = `Retiraste $${monto.toLocaleString()} el ${tx.fecha} (Ref: ${tx.referencia})`;
    document.getElementById("resumenRetiro").classList.remove("oculto");

    mostrarDatosUsuario();
    mostrarResumenTransacciones();
}

// =============================
// Pago de Servicios
// =============================
function realizarPagoServicio() {
    const tipo = document.getElementById("servicio").value;
    const monto = parseFloat(document.getElementById("valorServicio").value);
    if (isNaN(monto) || monto <= 0) return alert("Monto inválido.");
    if (monto > usuarioActual.saldo) return alert("Saldo insuficiente.");

    usuarioActual.saldo -= monto;

    const tx = {
        fecha: obtenerFechaHoy(),
        referencia: generarReferencia(),
        tipo: "Pago de servicios",
        descripcion: `Pago de ${tipo}`,
        valor: monto
    };

    usuarioActual.transacciones = usuarioActual.transacciones || [];
    usuarioActual.transacciones.push(tx);

    db.ref("usuarios/" + usuarioActual.cedula).update({
        saldo: usuarioActual.saldo,
        transacciones: usuarioActual.transacciones
    });

    mostrarDatosUsuario();
    mostrarResumenTransacciones();

    document.getElementById("detallePagoServicio").innerHTML = `
      Servicio: ${tipo}<br>
      Monto: $${monto.toLocaleString()}<br>
      Fecha: ${tx.fecha}<br>
      Referencia: ${tx.referencia}
    `;
    document.getElementById("resumenPagoServicio").classList.remove("oculto");
    document.getElementById("valorServicio").value = "";
}

// =============================
// Extracto y certificado
// =============================
function generarExtracto() {
    if (!usuarioActual) return console.warn("Usuario no cargado.");
    document.getElementById("reporteNombre").textContent = usuarioActual.nombre;
    document.getElementById("reporteCuenta").textContent = usuarioActual.numeroCuenta;
    document.getElementById("seccionReporte").classList.remove("oculto");

    // Vaciar resultados anteriores
    document.getElementById("tablaExtracto").innerHTML = "";
}
function filtrarTransaccionesPorFecha() {
    const anio = document.getElementById("anio").value;
    const mes = document.getElementById("mes").value;
    const cedula = sessionStorage.getItem("cedula");

    if (!anio || !mes) {
        alert("Por favor, ingresa el año y el mes.");
        return;
    }

    const ruta = `usuarios/${cedula}/transacciones`;
    get(ref(database, ruta)).then(snapshot => {
        const tbody = document.getElementById("tablaExtracto");
        tbody.innerHTML = "";

        if (!snapshot.exists()) {
            tbody.innerHTML = "<tr><td colspan='5'>No hay transacciones.</td></tr>";
            return;
        }

        const datos = Object.values(snapshot.val());
        const filtrados = datos.filter(t => {
            const fecha = new Date(t.fecha);
            return (
                fecha.getFullYear() === parseInt(anio) &&
                fecha.getMonth() + 1 === parseInt(mes)
            );
        });

        if (filtrados.length === 0) {
            tbody.innerHTML = "<tr><td colspan='5'>No se encontraron transacciones para ese mes.</td></tr>";
        } else {
            filtrados.forEach(t => {
                const fila = `
            <tr>
              <td>${t.fecha}</td>
              <td>${t.referencia}</td>
              <td>${t.tipo}</td>
              <td>${t.descripcion}</td>
              <td>$${t.valor}</td>
            </tr>
          `;
                tbody.innerHTML += fila;
            });
        }
    });
}


function mostrarCertificado() {
    if (!usuarioActual) return alert("No se ha cargado la información.");
    document.getElementById("titular").textContent = usuarioActual.nombre;
    document.getElementById("certCuenta").textContent = usuarioActual.numeroCuenta;
    document.getElementById("certSaldo").textContent = "$" + Number(usuarioActual.saldo || 0).toLocaleString();
    document.getElementById("certFecha").textContent = usuarioActual.fechaCreacion;
    document.getElementById("certEmision").textContent = new Date().toLocaleDateString("es-CO", {
        day: "2-digit", month: "long", year: "numeric"
    });
    ocultarSecciones();
    document.getElementById("certificado").classList.remove("oculto");
}

// =============================
// Mostrar resumen de transacciones
// =============================
function mostrarResumenTransacciones() {
    const tabla = document.getElementById("cuerpoTablaTransacciones");
    const seccion = document.getElementById("resumenTransacciones");

    if (!tabla || !seccion) return console.warn("Falta el contenedor");

    tabla.innerHTML = "";

    if (!usuarioActual.transacciones || usuarioActual.transacciones.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" style="text-align:center;">Sin movimientos registrados</td></tr>`;
        seccion.classList.remove("oculto");
        return;
    }

    usuarioActual.transacciones.forEach(tx => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${tx.fecha}</td>
        <td>${tx.referencia}</td>
        <td>${tx.tipo}</td>
        <td>${tx.descripcion}</td>
        <td>$${Number(tx.valor).toLocaleString()}</td>
      `;
        tabla.appendChild(fila);
    });

    ocultarSecciones();
    seccion.classList.remove("oculto");
}



// =============================
// Menú hamburguesa
// =============================
const toggleBtn = document.getElementById("hamburguesa");
const menuNav = document.getElementById("menu");

if (toggleBtn && menuNav) {
    toggleBtn.addEventListener("click", () => {
        menuNav.classList.toggle("mostrar");
    });

    const botonesMenu = menuNav.querySelectorAll("button");
    botonesMenu.forEach(btn => {
        btn.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                menuNav.classList.remove("mostrar");
            }
        });
    });

}

// =============================
// Auxiliares
// =============================
function generarNumeroCuenta() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function obtenerFechaHoy() {
    return new Date().toISOString().split('T')[0];
}

function mostrarDatosUsuario() {
    nombreUsuarioElem.textContent = usuarioActual.nombre;
    titularElem.textContent = usuarioActual.nombre;
    cuentaNumeroElem.textContent = usuarioActual.numeroCuenta;
    saldoElem.textContent = "$" + Number(usuarioActual.saldo || 0).toLocaleString();
    fechaCreacionElem.textContent = usuarioActual.fechaCreacion;
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    window.location.href = "usuario.html";
}

function generarReferencia() {
    return "REF" + Math.floor(100000 + Math.random() * 900000);
}