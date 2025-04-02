/* Hacer un algoritmo de recomendacion diario que cree una lista basandonos en historial, likes y generos, si las canciones que se van a recomendar estan en like no se muestran en la lista, si solo estan en el historial si se deben de mostrar y añadir canciones que no haya ni en like ni en historial basandonos por preferencias de genero
 meter tambien numero de veces reproducida la cancion por el usuario para asi coger tambien del historial las que mas ha reproducido el usuario cada mes

- en cada inicio de sesion recomendar una sola cancion por los generos más escuchados por el usuario */

const { Op, Sequelize } = require("sequelize");
const models = require("../models");

class RecommendConnection {
  /**
   * Generar una lista diaria de recomendaciones basada en historial, likes y géneros.
   */
  static async generateDailyRecommendations(userId) {
    try {
      const userExists = await models.Usuario.findByPk(userId);
      if (!userExists) {
        console.warn(`El usuario con ID ${userId} no existe.`);
        return [];
      }
  
      const userHistory = await models.Historial.findAll({
        where: { usuario_id: userId },
      });
  
      if (userHistory.length === 0) {
        console.warn("El historial del usuario está vacío. Generando canciones aleatorias.");
        const randomSongs = await models.Cancion.findAll({
          order: Sequelize.literal("RAND()"),
          limit: 20,
        });
        return randomSongs;
      }
  
      const historySongIds = userHistory.map((entry) => entry.cancion_id);
  
      const genresFromHistory = await models.GeneroCancion.findAll({
        where: { cancion_id: { [Op.in]: historySongIds } },
      });
  
      if (genresFromHistory.length === 0) {
        console.warn("No se encontraron géneros en el historial del usuario.");
      }
  
      const genreCounts = {};
      genresFromHistory.forEach((entry) => {
        genreCounts[entry.genero_id] = (genreCounts[entry.genero_id] || 0) + 1;
      });
  
      const topGenres = Object.entries(genreCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([genreId]) => parseInt(genreId));
  
      if (topGenres.length === 0) {
        console.warn("No se encontraron géneros principales. Generando canciones aleatorias.");
        const randomSongs = await models.Cancion.findAll({
          order: Sequelize.literal("RAND()"),
          limit: 20,
        });
        return randomSongs;
      }
  
      const userLikes = await models.Like.findAll({
        where: { usuario_id: userId },
      });
  
      const likedSongIds = userLikes.map((like) => like.cancion_id);
  
      const recommendedSongs = await models.Cancion.findAll({
        where: {
          id: { [Op.notIn]: likedSongIds },
        },
        include: [
          {
            model: models.Genero,
            through: models.GeneroCancion,
            as: "generos",
            where: { id: { [Op.in]: topGenres } },
          },
        ],
        limit: 20,
      });
  
      const frequentlyPlayedIds = userHistory
        .reduce((counts, entry) => {
          counts[entry.cancion_id] = (counts[entry.cancion_id] || 0) + 1;
          return counts;
        }, {});
  
      const frequentlyPlayed = Object.entries(frequentlyPlayedIds)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10)
        .map(([songId]) => parseInt(songId));
  
      const frequentlyPlayedSongs = await models.Cancion.findAll({
        where: { id: { [Op.in]: frequentlyPlayed } },
      });
  
      const dailyRecommendations = [
        ...frequentlyPlayedSongs,
        ...recommendedSongs,
      ];
  
      return dailyRecommendations.slice(0, 20); 
    } catch (error) {
      console.error("Error al generar recomendaciones diarias:", error);
  
      const fallbackSongs = await models.Cancion.findAll({
        order: Sequelize.literal("RAND()"),
        limit: 20,
      });
      return fallbackSongs;
    }
  }


  static async getOrCreatePlaylist(userId) {
    try {
      let playlist = await models.Playlist.findOne({
        where: {
          usuarioId: userId,
          nombre: "Canciones Recomendadas de Hoy",
        },
      });
  
      if (!playlist) {
        console.log("Creando la playlist 'Canciones Recomendadas de Hoy'...");
        playlist = await models.Playlist.create({
          usuarioId: userId,
          nombre: "Canciones Recomendadas de Hoy",
          descripcion: "Playlist generada automáticamente con las canciones recomendadas para el día.",
          fechaCreacion: new Date(),
        });
      }
  
      return playlist;
    } catch (error) {
      console.error("Error al verificar o crear la playlist:", error);
      throw error;
    }
  }

  static async addSongsToPlaylist(playlistId, songIds) {
    try {
      const playlistEntries = songIds.map((cancionId) => ({
        playlistId,
        cancionId,
        fechaAgregado: new Date(),
      }));
  
      await models.CancionPlaylist.bulkCreate(playlistEntries, {
        ignoreDuplicates: true, 
      });
  
      console.log("Canciones añadidas a la playlist.");
    } catch (error) {
      console.error("Error al añadir canciones a la playlist:", error);
      throw error;
    }
  }

  /**
   * Recomendar una canción en cada inicio de sesión basada en géneros más escuchados.
   */
  static async recommendOnLogin(userId) {
    try {
      const userHistory = await models.Historial.findAll({
        where: { usuario_id: userId },
        include: [{ model: models.Cancion, as: "cancion" }],
      });

      const genreCounts = userHistory.reduce((acc, entry) => {
        const genreId = entry.cancion.generoId;
        acc[genreId] = (acc[genreId] || 0) + 1;
        return acc;
      }, {});

      const topGenre = Object.entries(genreCounts).sort(
        ([, countA], [, countB]) => countB - countA,
      )[0]?.[0];

      if (!topGenre) {
        return null; 
      }

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
