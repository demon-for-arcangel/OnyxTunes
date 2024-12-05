const express = require("express");
const cors = require("cors");
require('dotenv').config()

const { socketController } = require("../controllers/services/socketController");
const fileUpload = require('express-fileupload');

/* const { ApolloServer } = require('@apollo/server');
 *//* const { expressMiddleware } = require('@apollo/server/express4')
const typeDefs = require('../typeDefs/typeDefs.js');
const resolvers = require('../resolvers/resolvers.js'); */

class Server {
  constructor() {
    this.app = express();


    this.RoutePath = "/api";
    this.apiUsers = "/api/users";
    this.apiFiles = "/api/file";
    this.apiMail = "/api/mail";
    this.apiChats = "/api/chats"
    this.apiPlaylist = "/api/playlist";
    this.apiAssets = "/api/assets"
    this.apiSearch = "/api/search";
    this.apiSongs = "/api/songs";


    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }))

 
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server, {
      cors: {
              origin: "http://localhost:4200",
              methods: '*'
            }
    });

    this.middlewares();
    this.routes();
    this.sockets();
  }
  
  async start() {
    this.listen();
  }
  
  middlewares() {
    this.app.use(cors({
      origin: process.env.FRONT_URL,
      credentials: true,
    }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.RoutePath, require("../routes/authRoutes"));
    this.app.use(this.apiUsers, require("../routes/userRoutes"));
    this.app.use(this.apiChats, require("../routes/chatRoutes"));
    this.app.use(this.apiMail, require('../routes/mailRoutes'));
    this.app.use(this.apiAssets, require("../routes/assetRoutes"));
    this.app.use(this.apiSearch, require("../routes/searchRoutes"));
    this.app.use(this.apiSongs, require("../routes/cancionRoutes"));
    this.app.use(this.RoutePath, require('../routes/rolRoutes'));
    this.app.use(this.RoutePath, require('../routes/albumRoutes'));
    this.app.use(this.RoutePath, require('../routes/cancionRoutes'));
    this.app.use(this.RoutePath, require('../routes/generoRoutes'));
    this.app.use(this.apiPlaylist, require('../routes/PlaylistRoutes'));
/* 
    this.app.use(this.RoutePath, require('../routes/PlaylistRoutes'));
    this.app.use(this.RoutePath, require('../routes/generoRoutes'));
 */
  }

  listen() {      
    this.app.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en: ${process.env.URL}:${process.env.PORT}`);
    });
  }

  sockets(){
/*     this.io.use(authMiddleware);
 */    this.io.on('connection', (socket) => socketController.onConnect(socket, this.io));
}
}
  
module.exports = Server; 