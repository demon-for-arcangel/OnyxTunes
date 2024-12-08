const { Router } = require('express');
const controlador = require('../controllers/cancionController');
const express = require('express');
const path = require('path');
const router = Router();

router.get('/', controlador.index);//funcional
router.get('/:id', controlador.getSongById);//funcional
router.post('/new', controlador.createSong);//funcional
router.put('/:id', controlador.updateSong);//funcional
router.delete('/', controlador.deleteSong);//funcional
router.get('/user/:userId', controlador.getSongByUser);

router.post('/add/history', controlador.addToHistory);
router.get('/history/:userId', controlador.getHistoryByUser);

module.exports = router;