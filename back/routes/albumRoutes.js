const { Router } = require('express');
const controlador = require('../controllers/albumController');

const router = Router();

router.get('/albums', controlador.index);//funcional
router.get('/albums/:id', controlador.getAlbumById);//funcional
router.post('/albums/new', controlador.createAlbum);//funcional
router.put('/albums/:id', controlador.updateAlbum);//funcional
router.delete('/albums', controlador.deleteAlbum);

module.exports = router;