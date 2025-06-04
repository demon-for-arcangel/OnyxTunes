const { Router } = require("express");
const router = Router();
const controlador = require("../controllers/likeController");
const { checkToken } = require('../middlewares/abilities');

router.get("/user/:userId", checkToken, controlador.getLikesByUserId);
router.delete("/:likeId", checkToken, controlador.deleteLike);

module.exports = router