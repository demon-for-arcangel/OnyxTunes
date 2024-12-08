const { Router } = require("express");
const router = Router();
const controlador = require("../controllers/likeController");

router.get("/user/:userId", controlador.getLikesByUserId);
router.delete("/:likeId", controlador.deleteLike);

module.exports = router