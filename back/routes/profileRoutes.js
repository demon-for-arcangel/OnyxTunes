const { Router } = require("express");
const router = Router();
const controlador = require("../controllers/user/profileController");

router.get("/playlist/public/:userId", controlador.getPlaylistPublics);

module.exports = router;