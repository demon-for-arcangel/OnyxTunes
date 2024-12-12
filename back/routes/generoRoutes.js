const { Router } = require("express");
const router = Router();
const generoController = require('../controllers/generoController');

router.get('/', generoController.getGeneros);
router.get('/:id', generoController.getGeneroById);
router.post('/new', generoController.createGenero);
router.put('/:id', generoController.updateGenero);
router.delete('/', generoController.deleteGeneros);

module.exports = router;