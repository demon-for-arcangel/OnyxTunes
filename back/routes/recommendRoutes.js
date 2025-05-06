const { Router } = require("express");
const router = Router();
const controlador = require("../controllers/recommendController");

// Ruta para obtener recomendaciones diarias para un usuario
router.get("/daily/:userId", controlador.getDailyRecommendations);

// Ruta para obtener una recomendación de canción al inicio de sesión
router.get("/login/:userId", controlador.getRecommendationOnLogin);//por hacer

// Obtener el estado de recomendaciones para un usuario
router.get("/status/:userId", controlador.getRecommendationStatus);

// Activar o desactivar recomendaciones para un usuario
router.post("/update-status/:userId", controlador.updateRecommendationStatus);

module.exports = router;