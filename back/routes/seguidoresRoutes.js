const { Router } = require("express");
const controlador = require("../controllers/seguidoresController");

const router = Router();

router.get("/:artistId", controlador.getFollowers);
router.get("/:userId", controlador.getFollowing);
router.post("/", controlador.addFollower);
router.delete("/", controlador.removeFollower);

module.exports = router;
