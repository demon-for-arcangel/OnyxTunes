const { response, request } = require("express");
const models = require("../models");
const conx = require("../database/RecommendConnection");

class RecommendController {
  /**
   * Generar recomendaciones diarias para un usuario.
   * @param {request} req - Objeto de solicitud HTTP.
   * @param {response} res - Objeto de respuesta HTTP.
   */
  static async getDailyRecommendations(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          ok: false,
          msg: "El ID del usuario es obligatorio.",
        });
      }

      const recommendations = await conx.generateDailyRecommendations(userId);

      return res.status(200).json({
        ok: true,
        recommendations,
      });
    } catch (error) {
      console.error("Error al obtener recomendaciones diarias:", error);
      return res.status(500).json({
        ok: false,
        msg: "Error interno del servidor.",
        error: error.message,
      });
    }
  }

  /**
   * Recomendar una canción en el inicio de sesión.
   * @param {request} req - Objeto de solicitud HTTP.
   * @param {response} res - Objeto de respuesta HTTP.
   */
  static async getRecommendationOnLogin(req, res) {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({
          ok: false,
          msg: "El ID del usuario es obligatorio.",
        });
      }
  
      // Obtener la fecha actual
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Establecer hora en 00:00:00 para comparar solo la fecha
  
      // Buscar si ya existe una recomendación para hoy
      const existingRecommendation = await models.Recomendacion.findOne({
        where: {
          usuario_id: userId,
        },
        include: [{ model: models.Cancion, as: "Cancion" }],
        order: [["fecha_recomendacion", "DESC"]], // Obtener la última recomendación
      });
  
      // Comprobar si la última recomendación es de hoy
      if (existingRecommendation && new Date(existingRecommendation.fecha_recomendacion).setHours(0, 0, 0, 0) === today.getTime()) {
        return res.status(200).json({
          ok: true,
          songRecommendation: existingRecommendation.cancion,
        });
      }
  
      // Generar una nueva recomendación si no hay una previa para hoy
      const songRecommendation = await conx.recommendOnLogin(userId);
  
      if (!songRecommendation) {
        return res.status(404).json({
          ok: false,
          msg: "No se pudo generar una recomendación en este momento.",
        });
      }
  
      // Guardar la recomendación en la base de datos
      await models.Recomendacion.create({
        usuario_id: userId,
        cancion_id: songRecommendation.id,
        fecha_recomendacion: new Date(),
        habilitada: true,
      });
  
      return res.status(200).json({
        ok: true,
        songRecommendation,
      });
    } catch (error) {
      console.error("Error al obtener recomendación en inicio de sesión:", error);
      return res.status(500).json({
        ok: false,
        msg: "Error interno del servidor.",
        error: error.message,
      });
    }
  }
}

module.exports = RecommendController;
