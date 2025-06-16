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
      
              const frases = [
                "Temporada de patos... ¿otra vez? ¡No! Es temporada de ganancias explosivas en ACME Bank.",
                "¡Dinero va! Como en los Looney Tunes, pero aquí sí puedes atraparlo.",
                "Tus ahorros, más seguros que el Coyote comprando en ACME.",
                "¡Boom! Tus finanzas despegan con más fuerza que una dinamita de dibujos animados.",
                "Temporada de errores financieros... cancelada. ¡Bienvenido a ACME Bank!",
                "Saltando más alto que Bugs Bunny… así sube tu saldo aquí.",
                "¿Temporada de caos? No. Aquí solo temporada de control total de tu dinero.",
                "Más confiable que cualquier invento del Coyote. Así es ACME Bank.",
                "No necesitas una caja ACME, solo tu cuenta para lograrlo todo.",
                "Tus finanzas corren tan rápido como el Correcaminos… ¡pero aquí no se escapan!",
                "¿Temporada de pobreza? ¡Jamás! Aquí es temporada de progreso.",
                "Más giros que el Taz… pero con cada vuelta, crece tu saldo.",
                "Una cuenta tan fuerte como el martillo de Marvin el Marciano.",
                "Aquí no caes en trampas del Coyote: cada clic te hace avanzar.",
                "¡Es temporada de inversión! Y tus ganancias no conocen gravedad."
              ];
      
              const pFrase = document.getElementById("frase-temporada");
              if (pFrase) {
                const aleatoria = frases[Math.floor(Math.random() * frases.length)];
                pFrase.textContent = aleatoria;
              }
              localStorage.setItem("usuarios", JSON.stringify(usuarioFirebase));
              setTimeout(() => {
                ventanaLogin.style.display = 'none';
                window.location.href = 'html.html';
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
    
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
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
});
