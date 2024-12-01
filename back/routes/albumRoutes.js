const { Router } = require('express');
const controlador = require('../controllers/albumController');

const router = Router();

router.get('/albums', controlador.index);
router.get('/albums/:id', controlador.getAlbumById);
router.post('/albums/new', controlador.createAlbum);
router.put('/albums/:id', controlador.updateAlbum);
router.delete('/albums', controlador.deleteAlbum);

module.exports = router;