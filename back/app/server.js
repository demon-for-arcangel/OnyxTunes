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
    this.apiFiles = "/api/file";
    this.apiMail = "/api/mail";
    this.apiChats = "/api/chats"

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
    this.app.use(this.RoutePath, require("../routes/userRoutes"));
    this.app.use(this.RoutePath, require('../routes/rolRoutes'));
    this.app.use(this.RoutePath, require('../routes/albumRoutes'));
    this.app.use(this.RoutePath, require('../routes/cancionRoutes'));
    this.app.use(this.RoutePath, require('../routes/generoRoutes'));
    this.app.use(this.RoutePath, require('../routes/PlaylistRoutes'));
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