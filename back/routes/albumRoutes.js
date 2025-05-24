const { Router } = require('express');
const controlador = require('../controllers/albumController');

const router = Router();

router.get('/', controlador.index);//funcional
router.get('/:id', controlador.getAlbumById);//funcional
router.post('/new', controlador.createAlbum);//funcional
router.put('/:id', controlador.updateAlbum);//funcional
router.delete('/', controlador.deleteAlbum);//funcional

router.get('/user/:userId', controlador.getAlbumsByUserId);

module.exports = router;