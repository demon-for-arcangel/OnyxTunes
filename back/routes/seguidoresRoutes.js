const { Router } = require("express");
const controlador = require("../controllers/seguidoresController");

const router = Router();

router.get("/artist/:artistId", controlador.getFollowers); //funcional
router.get("/user/:userId", controlador.getFollowing); //funcional
router.post("/", controlador.addFollower); //funcional
router.delete("/", controlador.removeFollower);

module.exports = router;
