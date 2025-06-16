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
});
