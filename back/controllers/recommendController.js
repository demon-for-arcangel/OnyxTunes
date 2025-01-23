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

      const songRecommendation = await conx.recommendOnLogin(userId);

      if (!songRecommendation) {
        return res.status(404).json({
          ok: false,
          msg: "No se pudo generar una recomendación en este momento.",
        });
      }

      return res.status(200).json({
        ok: true,
        songRecommendation,
      });
    } catch (error) {
      console.error(
        "Error al obtener recomendación en inicio de sesión:",
        error,
      );
      return res.status(500).json({
        ok: false,
        msg: "Error interno del servidor.",
        error: error.message,
      });
    }
  }
}

module.exports = RecommendController;
