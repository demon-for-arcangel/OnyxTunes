const { Router } = require("express");
const controlador = require("../controllers/playlistFavoriteController");

const router = Router();

//Ruta para añadir una playlist a favoritos
router.post("/add", controlador.addFavoritePlaylist);

//Ruta para eliminar una playlist de favoritos
router.delete("/remove", controlador.removeFavoritePlaylist);

//Ruta para obtener todas las playlists favoritas de un usuario
router.get("/:usuarioId", controlador.getFavoritePlaylistsByUser);

module.exports = router; 