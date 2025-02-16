const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  socketController,
} = require("../controllers/services/socketController");
const fileUpload = require("express-fileupload");
const path = require("path");

class Server {
  constructor() {
    this.app = express();

    this.RoutePath = "/api";
    this.apiUsers = "/api/users";
    this.apiFiles = "/api/file";
    this.apiMail = "/api/mail";
    this.apiChats = "/api/chats";
    this.apiPlaylist = "/api/playlist";
    this.apiProfile = "/api/profile";
    this.apiAssets = "/api/assets";
    this.apiSearch = "/api/search";
    this.apiSongs = "/api/songs";
    this.apiGeneros = "/api/generos";
    this.apiAlbums = "/api/albums";
    this.apiLikes = "/api/likes";
    this.apiReproducciones = "/api/reproducciones";
    this.apiSeguidores = "/api/seguidores";

    this.app.use(
      fileUpload({
        useTempFiles: true, 
        tempFileDir: '/tmp/', 
        limits: { fileSize: 50 * 1024 * 1024 }, 
        debug: false, 
      })
    );

    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server, {
      cors: {
        origin: "http://localhost:4200",
        methods: "*",
      },
    });

    this.middlewares();
    this.routes();
    this.sockets();
  }

  async start() {
    this.listen();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONT_URL,
        credentials: true,
      }),
    );
    this.app.use(express.json());
    console.log("RUTA", path.join(__dirname, "../../front/src/assets/uploads"));
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../public/uploads")),
    );
  }

  routes() {
    this.app.use(this.RoutePath, require("../routes/authRoutes"));
    this.app.use(this.apiUsers, require("../routes/userRoutes"));
    this.app.use(this.apiChats, require("../routes/chatRoutes"));
    this.app.use(this.apiMail, require("../routes/mailRoutes"));
    this.app.use(this.apiAssets, require("../routes/assetRoutes"));
    this.app.use(this.apiSearch, require("../routes/searchRoutes"));
    this.app.use(this.apiSongs, require("../routes/cancionRoutes"));
    this.app.use(this.RoutePath, require("../routes/rolRoutes"));
    this.app.use(this.apiAlbums, require("../routes/albumRoutes"));
    this.app.use(this.apiGeneros, require("../routes/generoRoutes"));
    this.app.use(this.apiPlaylist, require("../routes/PlaylistRoutes"));
    this.app.use(this.apiLikes, require("../routes/likesRoutes"));
    this.app.use(this.apiProfile, require("../routes/profileRoutes"));
    this.app.use(
      this.apiReproducciones,
      require("../routes/reproduccionesRoutes"),
    );
    this.app.use(this.apiSeguidores, require("../routes/seguidoresRoutes"));
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(
        `Servidor escuchando en: ${process.env.URL}:${process.env.PORT}`,
      );
    });
  }

  sockets() {
    this.io.on("connection", (socket) =>
      socketController.onConnect(socket, this.io),
    );
  }
}

module.exports = Server;
