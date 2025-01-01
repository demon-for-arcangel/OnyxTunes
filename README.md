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

5. Montar la base de datos
Para montar la base de datos tendremos que utilizar el siguiente comando: `npm run deploy-db`

En caso de que tengamos ya la base de datos montada y necesitemos refrescarla usaremos: `npm run refresh`

7. Instalación
Para instalar el proyecto seguiremos los siguientes pasos:
- Añadiremos el archivo `.env` en el directorio `back`. El .env será una copia del .env.example en el que solo tendremos que añadir los datos que nos requieran.

- Necesitaremos crear una base de datos llama `onyxtunes`

- Con una terminal nos iremos al directorio back: `cd back`, ejecutaremos el comando `npm update` esto lo que hara es instalar todas las dependencias necesarias del proyecto. Seguidamente podremos ejecutar el comando `npm run deploy-db` para ejecutar las migrations y los seeders. Para arrancar el servidor del back ejecutaremos `nodemon`.

- Con otra terminal iremos al directorio front: `cd front`, ejecutaremos de nuevo el comando `npm update` para las dependencias y seguidamente podremos lanzar el servidor del front con el comando `ng serve`.

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
