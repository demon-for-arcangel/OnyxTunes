/* Hacer un algoritmo de recomendacion diario que cree una lista basandonos en historial, likes y generos, si las canciones que se van a recomendar estan en like no se muestran en la lista, si solo estan en el historial si se deben de mostrar y añadir canciones que no haya ni en like ni en historial basandonos por preferencias de genero
 meter tambien numero de veces reproducida la cancion por el usuario para asi coger tambien del historial las que mas ha reproducido el usuario cada mes

- en cada inicio de sesion recomendar una sola cancion por los generos más escuchados por el usuario */

const { Op, Sequelize } = require("sequelize");
const models = require("../models");

class RecommendConnection {
  /**
   * Generar una lista diaria de recomendaciones basada en historial, likes y géneros.
   * @param {number} userId ID del usuario.
   * @returns {Promise<any[]>} Lista de canciones recomendadas.
   */
  static async generateDailyRecommendations(userId) {
    try {
      // Obtener historial del usuario
      const userHistory = await models.Historial.findAll({
        where: { usuarioId: userId },
        include: [{ model: models.Cancion, as: "cancion" }],
      });

      // Obtener likes del usuario
      const userLikes = await models.Like.findAll({
        where: { usuarioId: userId },
        include: [{ model: models.Cancion, as: "cancion" }],
      });

      // Obtener géneros más escuchados
      const genreCounts = userHistory.reduce((acc, entry) => {
        const genreId = entry.cancion.generoId;
        acc[genreId] = (acc[genreId] || 0) + 1;
        return acc;
      }, {});

      const topGenres = Object.entries(genreCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([genreId]) => genreId);

      // Canciones más reproducidas por el usuario en el último mes
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const frequentlyPlayed = await models.Historial.findAll({
        where: {
          usuarioId: userId,
          createdAt: { [Op.gte]: lastMonth },
        },
        attributes: [
          "cancionId",
          [Sequelize.fn("COUNT", Sequelize.col("cancionId")), "playCount"],
        ],
        group: ["cancionId"],
        order: [[Sequelize.literal("playCount"), "DESC"]],
        include: [{ model: models.Cancion, as: "cancion" }],
        limit: 10,
      });

      // Filtrar canciones que no estén en likes
      const likedSongIds = userLikes.map((like) => like.cancionId);
      const recommendedSongs = await models.Cancion.findAll({
        where: {
          id: {
            [Op.notIn]: likedSongIds,
          },
          [Op.or]: [
            { generoId: { [Op.in]: topGenres } },
            { id: { [Op.in]: userHistory.map((entry) => entry.cancionId) } },
          ],
        },
        limit: 20,
      });

      // Mezclar canciones frecuentes y basadas en género
      const dailyRecommendations = [
        ...frequentlyPlayed.map((entry) => entry.cancion),
        ...recommendedSongs,
      ];

      return dailyRecommendations.slice(0, 20); // Máximo 20 recomendaciones diarias
    } catch (error) {
      console.error("Error al generar recomendaciones diarias:", error);
      throw error;
    }
  }

  /**
   * Recomendar una canción en cada inicio de sesión basada en géneros más escuchados.
   * @param {number} userId ID del usuario.
   * @returns {Promise<any>} Una canción recomendada.
   */
  static async recommendOnLogin(userId) {
    try {
      // Obtener historial del usuario
      const userHistory = await models.Historial.findAll({
        where: { usuarioId: userId },
        include: [{ model: models.Cancion, as: "cancion" }],
      });

      // Obtener géneros más escuchados
      const genreCounts = userHistory.reduce((acc, entry) => {
        const genreId = entry.cancion.generoId;
        acc[genreId] = (acc[genreId] || 0) + 1;
        return acc;
      }, {});

      const topGenre = Object.entries(genreCounts).sort(
        ([, countA], [, countB]) => countB - countA,
      )[0]?.[0];

      if (!topGenre) {
        return null; // No hay suficientes datos para recomendar
      }

      // Seleccionar una canción aleatoria del género más escuchado
      const songRecommendation = await models.Cancion.findOne({
        where: {
          generoId: topGenre,
          id: {
            [Op.notIn]: userHistory.map((entry) => entry.cancionId),
          },
        },
        order: Sequelize.literal("RAND()"),
      });

      return songRecommendation;
    } catch (error) {
      console.error(
        "Error al recomendar una canción en inicio de sesión:",
        error,
      );
      throw error;
    }
  }
}

module.exports = RecommendConnection;
