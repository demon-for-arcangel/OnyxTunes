### **README: OnyxTunes**

#### **Descripción del proyecto**
**OnyxTunes** es una plataforma de streaming de música diseñada para ofrecer una experiencia personalizada y social. Inspirada en modelos como Spotify, permite a los usuarios explorar un amplio catálogo de canciones, crear listas de reproducción personalizadas, descubrir nueva música a través de recomendaciones y conectar con otros usuarios. La plataforma está construida con tecnologías modernas como **NodeJS** para el backend, **Angular 18** para el frontend, y **MySQL** como base de datos.

#### **Propósito**
El propósito principal de **OnyxTunes** es proporcionar una experiencia de escucha de música intuitiva, accesible y personalizada, con un fuerte enfoque en la interacción social y la facilidad de uso. A través de funcionalidades avanzadas, los usuarios pueden disfrutar de su música favorita, descubrir nuevos artistas y compartir sus gustos musicales con amigos y otros usuarios.

#### **Funcionalidades principales**
- Exploración y búsqueda de música.
- Reproducción de canciones en tiempo real.
- Creación y gestión de listas de reproducción.
- Recomendaciones personalizadas basadas en el historial de escucha.
- Perfiles de usuarios y características sociales para compartir música.
- Modo offline para escuchar música sin conexión.

#### **Configuración del entorno de desarrollo**
Sigue estos pasos para configurar el entorno de desarrollo de **OnyxTunes** en tu máquina local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/onyxtunes.git
   cd onyxtunes
   ```

2. Instala las dependencias del backend:
   ```bash
   cd back
   npm install
   ```

3. Instala las dependencias del frontend:
   ```bash
   cd ../front
   npm install
   ```

4. Configura el archivo `.env` con las credenciales de tu base de datos y otras variables de entorno:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=onyxtunes
   ```

5. Ejecuta el backend:
   ```bash
   cd back
   npm run dev
   ```

6. Ejecuta el frontend:
   ```bash
   cd ../front
   ng serve
   ```

#### **Librerías y dependencias**
A continuación, se enumeran las principales librerías y dependencias utilizadas en el proyecto:

- **Backend (NodeJS)**:
  - Express
  - Sequelize (ORM para MySQL)
  - dotenv (para la gestión de variables de entorno)
  - bcrypt (para la encriptación de contraseñas)
  - jsonwebtoken (para la autenticación)
  - cors (para la configuración de CORS)

- **Frontend (Angular 18)**:
  - Angular CLI
  - RxJS (para la gestión de estados reactivos)
  - Angular Material (para la interfaz de usuario)
  - HttpClient (para la comunicación con el backend)

#### **Requisitos del sistema**
- **NodeJS** (versión 18 o superior)
- **Angular CLI** (versión 18 o superior)
- **MySQL** (versión 5.7 o superior)
- **Navegador web** actualizado (Google Chrome, Firefox, etc.)
- **Git** para la clonación del repositorio

#### **Instrucciones adicionales**
- Asegúrate de que MySQL esté correctamente configurado y en ejecución antes de iniciar la aplicación.
- Si encuentras problemas de permisos en la instalación de dependencias, prueba ejecutar los comandos con permisos de administrador.

El **objetivo de este README** es ofrecer una guía clara y completa para cualquier desarrollador que quiera contribuir o probar **OnyxTunes**, proporcionando información esencial para entender el proyecto y ponerlo en funcionamiento.