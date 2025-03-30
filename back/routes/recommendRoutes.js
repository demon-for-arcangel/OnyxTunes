const { Router } = require("express");
const router = Router();
const controlador = require("../controllers/recommendController");

// Ruta para obtener recomendaciones diarias para un usuario
router.get("/daily/:userId", controlador.getDailyRecommendations);

// Ruta para obtener una recomendación de canción al inicio de sesión
router.get("/login/:userId", controlador.getRecommendationOnLogin);

module.exports = router;
