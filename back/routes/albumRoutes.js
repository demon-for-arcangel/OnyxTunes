const { Router } = require('express');
const controlador = require('../controllers/albumController');
const { checkToken } = require('../middlewares/abilities');

const router = Router();

router.get('/', controlador.index);
router.get('/:id', controlador.getAlbumById);
router.post('/new', checkToken, controlador.createAlbum);
router.put('/:id', checkToken, controlador.updateAlbum);
router.delete('/', checkToken, controlador.deleteAlbum);

router.get('/user/:userId', controlador.getAlbumsByUserId);

module.exports = router;