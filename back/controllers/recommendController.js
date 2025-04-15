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
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const existingRecommendation = await models.Recomendacion.findOne({
        where: {
          usuario_id: userId,
        },
        include: [{ model: models.Cancion, as: "Cancion" }],
        order: [["fecha_recomendacion", "DESC"]], 
      });

      console.log("Recomendación existente:", existingRecommendation);
  
      if (existingRecommendation && new Date(existingRecommendation.fecha_recomendacion).setHours(0, 0, 0, 0) === today.getTime()) {
        return res.status(200).json({
          ok: true,
          songRecommendation: existingRecommendation.Cancion.dataValues,
        });
      }
  
      const songRecommendation = await conx.recommendOnLogin(userId);
  
      if (!songRecommendation) {
        return res.status(404).json({
          ok: false,
          msg: "No se pudo generar una recomendación en este momento.",
        });
      }
  
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
