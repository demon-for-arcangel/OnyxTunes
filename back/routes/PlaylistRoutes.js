const { Router } = require("express");
const playlistController = require("../controllers/playlistController");
const router = Router();

router.get("/", playlistController.index); 
router.get("/:id", playlistController.getPlaylistById); 
router.post("/new", playlistController.createPlaylist); 
router.put("/:id", playlistController.updatePlaylist); 
router.delete("/", playlistController.deletePlaylists);
router.get('/user/:userId', playlistController.getUserPlaylists);
router.post('/:userId', playlistController.createPlaylistByUser);

router.post('/song/like', playlistController.addToFavorites);
router.delete('/song/delete', playlistController.deleteSongPlaylist);

router.post("/genre/createPlaylist", playlistController.createPlaylistsByGenres);
router.post("/addSongsToPlaylist", playlistController.addSongsToPlaylist);


module.exports = router;
 