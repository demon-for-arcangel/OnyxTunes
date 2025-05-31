const { response, request } = require("express");
const models = require("../models");
const RecommendConnection  = require("../database/RecommendConnection");
const conx = new RecommendConnection();

class RecommendController {
  /**
   * Generar recomendaciones diarias para un usuario.
   */
  static async getDailyRecommendations(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          msg: "El ID del usuario es obligatorio.",
        });
      }

      const recommendations = await conx.generateDailyRecommendations(userId);

      return res.status(200).json({
        recommendations,
      });
    } catch (error) {
      console.error("Error al obtener recomendaciones diarias:", error);
      return res.status(500).json({
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
            return res.status(400).json({ msg: "El ID del usuario es obligatorio." });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingRecommendation = await models.Recomendacion.findOne({
            where: { usuario_id: userId },
            include: [{ model: models.Cancion, as: "Cancion" }],
            order: [["fecha_recomendacion", "DESC"]],
        });

        console.log("Recomendación existente:", existingRecommendation);

        if (existingRecommendation && new Date(existingRecommendation.fecha_recomendacion).setHours(0, 0, 0, 0) === today.getTime()) {
            return res.status(200).json({
                ok: true,
                songRecommendation: existingRecommendation.Cancion ? existingRecommendation.Cancion.dataValues : null,
                msg: existingRecommendation.Cancion ? "Recomendación del día encontrada." : "No hay una canción recomendada disponible.",
            });
        }

        const recommendationResponse = await conx.recommendOnLogin(userId);

        return res.status(200).json(recommendationResponse);
    } catch (error) {
        console.error("Error al obtener recomendación en inicio de sesión:", error);
        return res.status(500).json({ msg: "Error interno del servidor.", error: error.message });
    }
}


  /**
   * Obtiene el estado de habilitación de recomendaciones para un usuario.
   */
  static async getRecommendationStatus(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ ok: false, msg: "El ID del usuario es obligatorio." });
      }

      const habilitada = await conx.getRecommendationStatus(userId);
      return res.status(200).json({ ok: true, habilitada });
    } catch (error) {
      console.error("Error al obtener estado de recomendaciones:", error);
      return res.status(500).json({ ok: false, msg: "Error interno del servidor.", error: error.message });
    }
  }

  /**
   * Activa o desactiva recomendaciones para un usuario.
   */
  static async updateRecommendationStatus(req, res) {
    try {
      const { userId } = req.params;
      const { habilitada } = req.body;

      if (!userId || habilitada === undefined) {
        return res.status(400).json({ ok: false, msg: "El ID del usuario y el estado de habilitada son obligatorios." });
      }

      const resultado = await conx.updateRecommendationStatus(userId, habilitada);
      return res.status(200).json(resultado);
    } catch (error) {
      console.error("Error al actualizar estado de recomendaciones:", error);
      return res.status(500).json({ ok: false, msg: "Error interno del servidor.", error: error.message });
    }
  }
}

module.exports = RecommendController;
