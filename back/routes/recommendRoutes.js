const { Router } = require("express");
const router = Router();
const controlador = require("../controllers/recommendController");
const { checkToken } = require('../middlewares/abilities');

// Ruta para obtener recomendaciones diarias para un usuario
router.get("/daily/:userId", controlador.getDailyRecommendations);

// Ruta para obtener una recomendación de canción al inicio de sesión
router.get("/login/:userId", checkToken, controlador.getRecommendationOnLogin);

// Obtener el estado de recomendaciones para un usuario
router.get("/status/:userId", checkToken, controlador.getRecommendationStatus);

// Activar o desactivar recomendaciones para un usuario
router.post("/update-status/:userId", checkToken, controlador.updateRecommendationStatus);

router.get("/playlist/:email", checkToken, controlador.getPlaylistByUserEmail);

module.exports = router;