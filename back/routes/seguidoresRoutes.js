const { Router } = require("express");
const controlador = require("../controllers/seguidoresController");

const router = Router();

router.get("/artist/:artistId", controlador.getFollowers); //funcional
router.get("/user/:userId", controlador.getFollowing); //funcional
router.post("/", controlador.addFollower); //funcional
router.delete("/", controlador.removeFollower);
router.get("/top", controlador.getTopArtists); // probar /top?limit=5

module.exports = router;
