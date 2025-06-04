const { Router } = require("express");
const playlistController = require("../controllers/playlistController");
const { checkToken } = require('../middlewares/abilities');

const router = Router();

router.get("/", playlistController.index); 
router.get("/:id", playlistController.getPlaylistById); 
router.post("/new", checkToken, playlistController.createPlaylist); 
router.put("/:id", playlistController.updatePlaylist); 
router.delete("/", playlistController.deletePlaylists);
router.get('/user/:userId', checkToken, playlistController.getUserPlaylists);
router.post('/:userId', playlistController.createPlaylistByUser);

router.post('/song/like', checkToken, playlistController.addToFavorites);
router.delete('/song/delete', checkToken, playlistController.deleteSongPlaylist);
router.post("/genre/createPlaylist", checkToken, playlistController.createPlaylistsByGenres);
router.post("/add/songs", checkToken, playlistController.addSongsToPlaylist);


module.exports = router;
 