const { Router } = require('express');
const controlador = require('../controllers/cancionController');
const express = require('express');
const path = require('path');
const router = Router();

router.get('/', controlador.index);//funcional
router.get('/:id', controlador.getSongById);//funcional
router.post('/new', controlador.createSong, express.static(path.join(__dirname, '../assets/audio')));//funcional
router.put('/:id', controlador.updateSong);//funcional
router.delete('/', controlador.deleteSong);//funcional
router.get('/user/:userId', controlador.getSongByUser);

module.exports = router;