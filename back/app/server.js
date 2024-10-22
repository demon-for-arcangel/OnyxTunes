const express = require("express");
const cors = require("cors");
require('dotenv').config()
/* const { socketController } = require("../controllers/services/socketController");
 *//* const fileUpload = require('express-fileupload'); */
/* const { ApolloServer } = require('@apollo/server');
 *//* const { expressMiddleware } = require('@apollo/server/express4')
const typeDefs = require('../typeDefs/typeDefs.js');
const resolvers = require('../resolvers/resolvers.js'); */

class Server {
  constructor() {
    this.app = express();

    this.middlewares();

    this.RoutePath = "/api";
    this.apiFiles = "/api/file";
    this.apiMail = "/api/mail";
    this.apiRols = "/api/rols"
    this.apiEvents = "/api/events"
    this.apiPreferences = "/api/preferences"
    this.apiUserPreferences = "/api/userPreferences"
    this.apiChats = "/api/chats"
    this.apiAssets = "/api/assets"
    this.apiUserEvents = "/api/userEvents"
    this.apiRecommendUsers = "/api/recommendations"
  
/*     this.serverExpress = require('http').createServer(this.app);
 */  
    this.routes();
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
/*     this.app.use(this.apiMail, require('../routes/services/mailRoutes'));
    this.app.use(this.apiRols, require('../routes/rols/rolRoutes'));
    this.app.use(this.apiEvents, require('../routes/events/eventsRoutes'));
    this.app.use(this.apiPreferences, require('../routes/preferences/preferencesRoutes'));
    this.app.use(this.apiUserPreferences, require('../routes/preferences/userPreferencesRoutes'))
    this.app.use(this.apiChats, require("../routes/services/socketRoutes.js"));
    this.app.use(this.apiAssets, require("../routes/assets/assetsRoutes.js"));
    this.app.use(this.apiUserEvents, require('../routes/events/userEventsRoutes.js'));
    this.app.use(this.apiRecommendUsers, require("../routes/users/userRecommendRoutes.js"));
 */  }

  listen() {      
    this.app.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en: ${process.env.URL}:${process.env.PORT}${this.graphQLPath}`);
    });
  }
}
  
module.exports = Server; 