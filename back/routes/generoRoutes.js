const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

router.get('/genero', generoController.index);//funcional
router.get('/genero/:id', generoController.getGeneroById);
router.post('/genero/new', generoController.createGenero);//funcional
router.put('/genero/:id', generoController.updateGenero);//funcional
router.delete('/genero/:id', generoController.deleteGenero);

module.exports = router;
