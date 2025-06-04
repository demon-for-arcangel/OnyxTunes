### OnyxTunes
## 🎵 Descripción
OnyxTunes es una plataforma de streaming de música moderna y social, diseñada para ofrecer una experiencia personalizada y enriquecedora. Con una interfaz intuitiva y características avanzadas, conecta a los amantes de la música en un ambiente interactivo y personalizado.

## 🚀 Características Principales

- 🎶 Exploración y búsqueda avanzada de música
- 🎮 Reproducción en tiempo real con control preciso
- 📝 Listas de reproducción personalizadas y compartibles
- 🎯 Recomendaciones inteligentes basadas en tus gustos
- 👥 Perfiles sociales y funcionalidades de interacción
- 📱 Modo offline para escuchar música sin conexión
- 🎨 Interfaz moderna y responsiva

## 📋 Requisitos del Sistema

- NodeJS (versión 18 o superior)
- Angular CLI (versión 18 o superior)
- MySQL (versión 5.7 o superior)
- Navegador web moderno (Chrome, Firefox, Safari)
- Git (para clonación del repositorio)

## 🛠️ Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/usuario/onyxtunes.git
   cd onyxtunes
   ```

2. **Configurar el backend**:
   ```bash
   cd back
   npm install
   cp .env.example .env  # Copiar archivo de configuración
   ```
   Editar el archivo `.env` con tus credenciales de MySQL:
   ```bash
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=onyxtunes
   ```

3. **Configurar el frontend**:
   ```bash
   cd ../front
   npm install
   ```

4. **Inicializar la base de datos**:
   ```bash
   cd ../back
   npm run deploy-db  # Montar la base de datos
   ```

5. **Iniciar los servidores**:
   ```bash
   # Backend (en una terminal)
   cd back
   npm run start

   # Frontend (en otra terminal)
   cd front
   ng serve
   ```

## 🛠️ Tecnologías Utilizadas

### Backend (NodeJS)
- Express.js
- Sequelize (ORM)
- dotenv
- bcrypt
- jsonwebtoken
- cors

### Frontend (Angular 18)
- Angular CLI
- Angular Material
- HttpClient
- RxJS
- NgRx (para estado global)

## 📝 Documentación

- [API Documentation](./docs/api.md)
- [Frontend Architecture](./docs/frontend.md)
- [Backend Architecture](./docs/backend.md)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 📢 Soporte

Para reportar bugs o solicitar nuevas características, por favor abre un issue en el repositorio.

## 📈 Roadmap

- [ ] Soporte para podcasts
- [ ] Integración con redes sociales
- [ ] Sistema de notificaciones mejorado
