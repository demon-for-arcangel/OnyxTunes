const { Router } = require("express");
const controlador = require("../controllers/reproduccionesController");
const router = Router();

router.get('/user/:id', controlador.getReproduccionesByUserId); 
router.get('/music', controlador.getReproduccionesByEntidad);
router.post('/', controlador.createOrUpdateReproduccion); 

module.exports = router;