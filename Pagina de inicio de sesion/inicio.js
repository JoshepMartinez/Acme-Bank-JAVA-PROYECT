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

document.addEventListener('DOMContentLoaded', () => {
// === Elementos Login ===
    const btnAbrirLogin = document.getElementById('btn-iniciar-sesion');
    const ventanaLogin = document.getElementById('window');
    const btnCerrarLogin = document.getElementById('btn-cerrar');
    const btnConfirmarLogin = document.getElementById('btn-confirmar');
    const mensajeLogin = document.getElementById('mensaje-login');
    const linkRegistrarDesdeLogin = document.getElementById('link-a-registrar');

    const inputUsuario = document.getElementById('usuario');
    const inputTipo = document.getElementById('tipo');
    const inputCedula = document.getElementById('cedula');
    const inputContraseña = document.getElementById('contraseña');

    const ventanaRegis = document.getElementById('window-regis');
    const btnAbrirRegis = document.getElementById('btn-registrarse');
    const btnCerrarRegistro = document.getElementById('btn-cerrar-registro');
    const btnRegistrar = document.getElementById('registrarse');

    const passwordInputLogin = document.getElementById('contraseña-login');
    const toggleButtonLogin = document.getElementById('toggle-password-login');
    const passwordInputRegis = document.getElementById('contraseña-regis');
    const toggleButtonRegis = document.getElementById('toggle-password-regis');

    const seccionInicio = document.getElementById('inicio');
    const seccionDashboard = document.getElementById('dashboard');

    const linkRecuperar = document.getElementById("link-recuperar");
    const ventanaRecuperar = document.getElementById("window-recuperar");
    const ventanaLogin1 = document.getElementById("window");
    const btnCerrarRecuperar = document.getElementById("btn-cerrar-recuperar");
    const btnEnviarRecuperacion = document.getElementById("btn-enviar-recuperacion");
    const btnCambiarContraseña = document.getElementById("btn-cambiar-contraseña");
    const formCambiarPass = document.getElementById("form-cambiar-pass");

    setInterval(cambiarFrase, 10000);

    btnAbrirLogin.addEventListener('click', () => {
        ventanaLogin.style.display = 'block';
        mensajeLogin.textContent = '';
      });
    
      btnCerrarLogin.addEventListener('click', () => {
        ventanaLogin.style.display = 'none';
        limpiarCamposLogin();
      });
    
      linkRegistrarDesdeLogin.addEventListener('click', (e) => {
        e.preventDefault();
        ventanaLogin.style.display = 'none';
        ventanaRegis.style.display = 'block';
      });

      btnConfirmarLogin.addEventListener('click', () => {
        const usuario = inputUsuario.value.trim();
        const tipo = inputTipo.value;
        const cedula = inputCedula.value.trim();
        const contraseña = passwordInputLogin.value;
      
        if (!usuario || !tipo || !cedula || !contraseña) {
          mensajeLogin.style.color = "red";
          mensajeLogin.textContent = "Por favor complete todos los campos.";
          return;
        }
      
        const usuarioRef = db.ref('usuarios/' + cedula);
        usuarioRef.once('value')
          .then((snapshot) => {
            const usuarioFirebase = snapshot.val();
            console.log(usuarioFirebase);
            
            if (!usuarioFirebase) {
              mensajeLogin.style.color = "red";
              mensajeLogin.textContent = "No se encontró un usuario con esa cédula.";
              return;
            }
            
            if (
              usuarioFirebase.nombre === usuario &&
              usuarioFirebase.tipo === tipo &&
              usuarioFirebase.contraseña === contraseña
            ) {
              mensajeLogin.style.color = "green";
              mensajeLogin.textContent = "Inicio de sesión exitoso.";
              sessionStorage.setItem("usuario", usuario);  
              cambiarFrase();           
              localStorage.setItem("usuarios", JSON.stringify(usuarioFirebase));
              setTimeout(() => {
                ventanaLogin.style.display = 'none';
                window.location.href = 'Dashboard.html';
              }, 1000);
              
            } else {
              mensajeLogin.style.color = "red";
              mensajeLogin.textContent = "Credenciales incorrectas. Intente nuevamente.";
    
            }
          })
          .catch((error) => {
            mensajeLogin.style.color = "red";
            mensajeLogin.textContent = "Error de conexión a Firebase: " + error.message;
          });
      });

      btnAbrirRegis.addEventListener('click', () => {
        ventanaRegis.style.display = 'block';
      });
    
      btnCerrarRegistro.addEventListener('click', () => {
        ventanaRegis.style.display = 'none';
        limpiarCamposRegistro();
      });

      function cambiarFrase() {
        const frases = [
          "¿Temporada de patos... otra vez? ¡No! Es temporada de ganancias explosivas en ACME Bank.",
          "¡Dinero va! Como en los Looney Tunes, pero aquí sí puedes atraparlo.",
          "Tus ahorros, más seguros que el Coyote comprando en ACME.",
          "¡Boom! Tus finanzas despegan con más fuerza que una dinamita de caricatura.",
          "Temporada de errores financieros... cancelada. ¡Bienvenido a ACME Bank!",
          "Saltando más alto que Bugs Bunny… así sube tu saldo aquí.",
          "¿Temporada de caos? No. Aquí solo hay temporada de control total de tu dinero.",
          "Más confiable que cualquier invento del Coyote. Así es ACME Bank.",
          "No necesitas una caja ACME, solo tu cuenta para lograrlo todo.",
          "Tus finanzas corren tan rápido como el Correcaminos… ¡pero aquí no se escapan!",
          "¿Temporada de pobreza? ¡Jamás! Aquí es temporada de progreso.",
          "Más giros que el Taz… pero con cada vuelta, crece tu saldo.",
          "Una cuenta tan fuerte como el rayo desintegrador de Marvin el Marciano.",
          "Aquí no caes en trampas del Coyote: cada clic te hace avanzar.",
          "¡Es temporada de inversión! Y tus ganancias desafían la gravedad."
        ];
      
        const pFrase = document.getElementById("frase-temporada");
        if (pFrase) {
          const aleatoria = frases[Math.floor(Math.random() * frases.length)];
          pFrase.textContent = aleatoria;
        }
      }
    
      btnRegistrar.addEventListener('click', () => {
        const numeroCuenta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const fechaCreacion = new Date().toLocaleDateString('es-CO');
    
        const nuevoUsuario = {
          tipo: document.getElementById('tipo-regis').value,
          cedula: document.getElementById('cedula-regis').value.trim(),
          nombre: document.getElementById('usuario-regis').value.trim(),
          genero: document.getElementById('genero-regis').value,
          telefono: document.getElementById('telefono-regis').value.trim(),
          correo: document.getElementById('correo-regis').value.trim(),
          direccion: document.getElementById('direccion-regis').value.trim(),
          ciudad: document.getElementById('ciudad-regis').value.trim(),
          contraseña: document.getElementById('contraseña-regis').value,
          saldo: 0,
          numero: numeroCuenta,
          fechaCreacion: fechaCreacion,
          transacciones: []
        };
    
        const correoValido = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/;
        if (!correoValido.test(nuevoUsuario.correo)) {
          alert("Solo se permiten correos @gmail.com o @hotmail.com.");
          return;
        }
    
        if (!nuevoUsuario.tipo || !nuevoUsuario.cedula || !nuevoUsuario.nombre || !nuevoUsuario.contraseña) {
          alert("Por favor complete todos los campos requeridos.");
          return;
        }
    
        db.ref('usuarios/' + nuevoUsuario.cedula).set(nuevoUsuario)
          .then(() => {
            alert("Registro exitoso.");
            ventanaRegis.style.display = 'none';
            limpiarCamposRegistro();
          })
          .catch((error) => {
            alert("Error al registrar en Firebase: " + error.message);
          });
      });

      toggleButtonLogin.addEventListener('click', () => {
        const isPassword = passwordInputLogin.type === 'password';
        passwordInputLogin.type = isPassword ? 'text' : 'password';
        toggleButtonLogin.textContent = isPassword ? '🙈' : '👁️';
      });
    
      toggleButtonRegis.addEventListener('click', () => {
        const isPassword = passwordInputRegis.type === 'password';
        passwordInputRegis.type = isPassword ? 'text' : 'password';
        toggleButtonRegis.textContent = isPassword ? '🙈' : '👁️';
      });

      const btnCerrarSesion = document.querySelector("button[onclick*='cerrar']");
      if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            sessionStorage.removeItem("usuario");
            seccionDashboard.classList.add("oculto");
            seccionInicio.classList.remove("oculto");
            cambiarFrase();
        });
      }

      const usuarioSesion = sessionStorage.getItem("usuario");
      if (usuarioSesion) {
        seccionInicio.classList.add("oculto");
        seccionDashboard.classList.remove("oculto");
      }

      function limpiarCamposLogin() {
        inputUsuario.value = '';
        inputTipo.selectedIndex = 0;
        inputCedula.value = '';
        inputContraseña.value = '';
        mensajeLogin.textContent = '';
      }

      function limpiarCamposRegistro() {
        document.getElementById('tipo-regis').selectedIndex = 0;
        document.getElementById('cedula-regis').value = '';
        document.getElementById('usuario-regis').value = '';
        document.getElementById('genero-regis').selectedIndex = 0;
        document.getElementById('telefono-regis').value = '';
        document.getElementById('correo-regis').value = '';
        document.getElementById('direccion-regis').value = '';
        document.getElementById('ciudad-regis').value = '';
        document.getElementById('contraseña-regis').value = '';
      }
      let cedulaActualRecuperar = null;

      linkRecuperar.addEventListener("click", (e) => {
        e.preventDefault();
        ventanaLogin1.style.display = 'none';
        ventanaRecuperar.style.display= 'block';
      });

      btnCerrarRecuperar.addEventListener("click", () => {
        ventanaRecuperar.style.display = 'none';
        formCambiarPass.classList.add("oculto");
        cedulaActualRecuperar = null;
      });  

      btnEnviarRecuperacion.addEventListener("click", () => {
        const cedula = document.getElementById("recuperar-cedula").value.trim();
        const tipo = document.getElementById("recuperar-tipo").value;
        const nombre = document.getElementById("recuperar-nombre").value.trim();

        if (!cedula || !tipo || !nombre) {
        alert("Por favor complete todos los campos.");
        return;
        }

        const refUsuario = db.ref("usuarios/" + cedula);
        refUsuario.once("value")
        .then(snapshot => {
            const usuario = snapshot.val();

            if (!usuario) {
            alert("Usuario no encontrado.");
            return;
            }

            if (usuario.tipo === tipo && usuario.nombre === nombre) {
            cedulaActualRecuperar = cedula;
            formCambiarPass.classList.remove("oculto");
            } else {
            alert("Los datos no coinciden con la base de datos.");
            }
        })
        .catch(error => {
            alert("Error al consultar Firebase: " + error.message);
        });
        });

        btnCambiarContraseña.addEventListener("click", () => {
            const nueva = document.getElementById("nueva-contraseña").value;

            if (!nueva || !cedulaActualRecuperar) {
            alert("Por favor ingrese una nueva contraseña.");
            return;
            }

            db.ref(`usuarios/${cedulaActualRecuperar}/contraseña`).set(nueva)
            .then(() => {
                alert("Contraseña actualizada correctamente.");
                ventanaRecuperar.classList.add("oculto");
                formCambiarPass.classList.add("oculto");
                cedulaActualRecuperar = null;
                limpiarCamposRecuperar();
            })
            .catch(error => {
                alert("Error al actualizar contraseña: " + error.message);
            });
        });
        
        function limpiarCamposRecuperar() {
          document.getElementById("recuperar-cedula").value = '';
          document.getElementById("recuperar-tipo").selectedIndex = 0;
          document.getElementById("recuperar-nombre").value = '';
          document.getElementById("nueva-contraseña").value = '';
          formCambiarPass.classList.add("oculto");
          cedulaActualRecuperar = null;
        }        
});
