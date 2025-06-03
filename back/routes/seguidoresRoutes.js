const { Router } = require("express");
const controlador = require("../controllers/seguidoresController");
const { checkToken } = require('../middlewares/abilities');

const router = Router();

router.get("/artist/:artistId", controlador.getFollowers); //funcional
router.get("/user/:userId", checkToken, controlador.getFollowing);
router.post("/", checkToken, controlador.addFollower); 
router.delete("/", checkToken, controlador.removeFollower);
router.get("/top", controlador.getTopArtists); // probar /top?limit=5

module.exports = router;
