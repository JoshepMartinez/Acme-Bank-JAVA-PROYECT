# Acme-Bank-JAVA-PROYECT

# 💳 Acme Bank - Plataforma Bancaria Web

**Acme Bank** es una aplicación web educativa que simula el funcionamiento de una banca virtual. Permite a los usuarios registrarse, iniciar sesión y realizar operaciones financieras como consignaciones, retiros, pagos de servicios, certificados y generación de extractos mensuales. Toda la información se almacena en tiempo real usando Firebase Realtime Database.

---

## 👥 Autores

- **Daniel Santiago González Hernández**
- **Joshep Martínez**
- Proyecto académico - Campus Bucaramanga

---

## 🚀 Funcionalidades del sistema

Cada función fue desarrollada con lógica en JavaScript puro y persistencia en Firebase.

### 🔐 Inicio de sesión y registro
- Formulario modal para registro de usuarios por cédula única.
- Validaciones de campos vacíos y datos duplicados.
- Almacenamiento de los datos del usuario en Firebase bajo su número de cédula.
- Inicio de sesión con verificación en Firebase.
- Uso de `sessionStorage` para mantener la sesión activa.

### 🧾 Dashboard bancario
Tras iniciar sesión correctamente, el usuario es redirigido al Dashboard, que contiene:

#### 📄 Datos del cliente
- Nombre completo
- Número de cuenta
- Fecha de creación
- Saldo actual

#### 💵 Consignación
- Permite ingresar un valor positivo.
- Aumenta el saldo actual.
- Registra la transacción en Firebase con tipo "Consignación".

#### 🏧 Retiro
- Permite retirar dinero si hay saldo suficiente.
- Disminuye el saldo actual.
- Registra la transacción con tipo "Retiro".

#### 💡 Pago de servicios
- Solicita el nombre del servicio y valor a pagar.
- Disminuye el saldo si hay fondos suficientes.
- Guarda la transacción con tipo "Pago".

#### 📆 Generar extracto
- El usuario selecciona un año y mes.
- Se muestran todas las transacciones de ese periodo: fecha, referencia, tipo, concepto y valor.
- Incluye encabezado con nombre completo y número de cuenta.

#### 📜 Certificado bancario
- Muestra información resumida: nombre, cédula, saldo actual, fecha de creación.
- Puede imprimirse o exportarse desde el navegador.

#### 📊 Resumen de transacciones
- Tabla dinámica con todas las transacciones del usuario.
- Se actualiza en tiempo real desde Firebase.

#### 🔓 Cierre de sesión
- Elimina la sesión del navegador.
- Redirige al login automáticamente.

---

## 🛠️ Tecnologías utilizadas

- **HTML5** - estructura de la interfaz
- **CSS3** - estilos personalizados y responsive
- **JavaScript (Vanilla)** - lógica del frontend
- **Firebase Realtime Database** - almacenamiento y sincronización de datos
- **Firebase SDK** - conexión del frontend con la base de datos

---

## 🔧 Configuración del entorno

1. Clonar el repositorio:
```bash
git clone https://github.com/usuario/acme-bank.git
cd acme-bank
```

2. Crear un proyecto en [Firebase](https://console.firebase.google.com/)
   - Activar Realtime Database
   - Copiar la configuración y pegarla en `firebase-config.js`:
```js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  databaseURL: "https://TU_BASE.firebaseio.com",
  ...
};
```

3. Abrir `1.html` en el navegador para iniciar sesión o registrarse.

---

## 📁 Estructura del proyecto

```
/acme-bank/
├── 1.html                 # Login y Registro
├── dashboard.html         # Panel del usuario
├── style.css              # Estilos generales
├── inicio-de-sesion.js    # Validaciones de login/registro
├── Dashboard.js           # Funcionalidades bancarias del dashboard
├── firebase-config.js     # Configuración de Firebase
```

---

## 🧪 Estado del proyecto

- 🔄 En desarrollo activo
- ✅ Módulos funcionales: login, registro, dashboard, consignaciones, retiros, pagos, certificados y extractos.
- 📦 Pendientes: exportación PDF / impresión directa y mejoras visuales.

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos por estudiantes del Campus Bucaramanga. Todos los derechos reservados © 2025.