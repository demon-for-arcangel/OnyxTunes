const { Router } = require('express');
const controlador = require('../controllers/cancionController');
const express = require('express');
const path = require('path');
const { checkToken } = require('../middlewares/abilities');
const router = Router();

router.get('/', controlador.index);//funcional
router.get('/:id', controlador.getSongById);
router.post('/new', checkToken, controlador.createSongs, express.static(path.join(__dirname, '../../front/src/assets/uploads')));//funcional
router.put('/:id', checkToken, controlador.updateSong);
router.delete('/', checkToken, controlador.deleteSong);
router.get('/user/:userId', checkToken, controlador.getSongByUser);
router.post('/add/history', checkToken, controlador.addToHistory);
router.get('/history/:userId', controlador.getHistoryByUser);
router.get('/:songId/genre', checkToken, controlador.getGenreBySong);

module.exports = router; 