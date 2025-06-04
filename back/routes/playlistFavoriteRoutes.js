const { Router } = require("express");
const controlador = require("../controllers/playlistFavoriteController");
const { checkToken } = require('../middlewares/abilities');

const router = Router();

router.post("/add", checkToken, controlador.addFavoritePlaylist);
router.delete("/remove", checkToken, controlador.removeFavoritePlaylist);
router.get("/:usuarioId", checkToken, controlador.getFavoritePlaylistsByUser);

module.exports = router; 