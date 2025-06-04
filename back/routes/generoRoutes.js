const { Router } = require("express");
const router = Router();
const generoController = require('../controllers/generoController');
const { checkToken } = require('../middlewares/abilities');

router.get('/', checkToken, generoController.getGeneros);
router.get('/:id', checkToken, generoController.getGeneroById);
router.post('/new', checkToken, generoController.createGenero);
router.put('/:id', checkToken, generoController.updateGenero);
router.delete('/', checkToken, generoController.deleteGeneros);

module.exports = router;