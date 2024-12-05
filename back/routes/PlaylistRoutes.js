const { Router } = require("express");
const playlistController = require("../controllers/playlistController");
const router = Router();

router.get("/", playlistController.index); //funcional
router.get("/:id", playlistController.getPlaylistById); //funcional
router.post("/new", playlistController.createPlaylist); //funcional
router.put("/:id", playlistController.updatePlaylist); //funcional
router.delete("/", playlistController.deletePlaylists); //funcional
router.get('/user/:userId', playlistController.getUserPlaylists);
router.post('/:userId', playlistController.createPlaylistByUser);

module.exports = router;
 