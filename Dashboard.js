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
      window.location.href = "html1.html";
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
    window.location.href = "html1.html";
  }
  
  function generarReferencia() {
    return "REF" + Math.floor(100000 + Math.random() * 900000);
  }