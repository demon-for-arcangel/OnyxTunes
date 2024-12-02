const { Router } = require("express");
const playlistController = require("../controllers/playlistController");

const router = Router();

router.get("/playlist", playlistController.index); //funcional
router.get("/playlist/:id", playlistController.getPlaylistById); //funcional
router.post("/playlist/new", playlistController.createPlaylist); //funcional
router.put("/playlist/:id", playlistController.updatePlaylist); //funcional
router.delete("/playlist", playlistController.deletePlaylists); //funcional

module.exports = router;
 