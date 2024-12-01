const { Router } = require('express');
const controlador = require('../controllers/cancionController');

const router = Router();

router.get('/songs', controlador.index);//funcional
router.get('/songs/:id', controlador.getSongById);//funcional
router.post('/songs/new', controlador.createSong);//funcional
router.put('/songs/:id', controlador.updateSong);//funcional
router.delete('/songs', controlador.deleteSong);//funcional

module.exports = router;