/* Hacer un algoritmo de recomendacion diario que cree una lista basandonos en historial, likes y generos, si las canciones que se van a recomendar estan en like no se muestran en la lista, si solo estan en el historial si se deben de mostrar y añadir canciones que no haya ni en like ni en historial basandonos por preferencias de genero
 meter tambien numero de veces reproducida la cancion por el usuario para asi coger tambien del historial las que mas ha reproducido el usuario cada mes

- en cada inicio de sesion recomendar una sola cancion por los generos más escuchados por el usuario */

const { Op, Sequelize } = require("sequelize");
const models = require("../models");

class RecommendConnection {
  /**
   * Generar una lista diaria de recomendaciones basada en historial, likes y géneros.
   */
  async generateDailyRecommendations(userId) {
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
  
        const songIds = randomSongs.map((song) => song.dataValues.id);
        console.log("IDs de canciones procesados:", songIds);
        await this.addSongsToPlaylist(userId, songIds);

        return randomSongs;
      }
  
      const historySongIds = userHistory.map((entry) => entry.cancion_id);
  
      const genresFromHistory = await models.GeneroCancion.findAll({
        where: { cancion_id: { [Op.in]: historySongIds } },
      });
  
      const genreCounts = {};
      genresFromHistory.forEach((entry) => {
        genreCounts[entry.genero_id] = (genreCounts[entry.genero_id] || 0) + 1;
      });
  
      const topGenres = Object.entries(genreCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([genreId]) => parseInt(genreId));
  
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
  
      const finalSongIds = dailyRecommendations.map((song) => song.id);
  
      await this.addSongsToPlaylist(userId, finalSongIds);
      console.log("Llamada realizada a addSongsToPlaylist con IDs:", finalSongIds)
  
      return dailyRecommendations.slice(0, 20); 
    } catch (error) {
      console.error("Error al generar recomendaciones diarias:", error);
  
      const fallbackSongs = await models.Cancion.findAll({
        order: Sequelize.literal("RAND()"),
        limit: 20,
      });
  
      await this.addSongsToPlaylist(userId, fallbackSongs.map((song) => song.id));
      return fallbackSongs;
    }
  }

async getOrCreatePlaylist(userId) {
    try {
        const usuario = await models.Usuario.findByPk(userId);
        if (!usuario) {
            throw new Error(`❌ Usuario con ID ${userId} no encontrado.`);
        }

        const adminUsuario = await models.Usuario.findOne({ where: { email: "onyxtunes@gmail.com" } });
        if (!adminUsuario) {
            throw new Error("❌ Usuario administrador 'onyxtunes@gmail.com' no encontrado en la base de datos.");
        }

        const playlistName = `Recomendación Diaria ${usuario.email}`;

        // 🔹 Primero, buscar la playlist sin importar el usuario relacionado
        let playlist = await models.Playlist.findOne({
            where: { nombre: playlistName }
        });

        if (!playlist) {
            console.log(`🆕 Creando la playlist '${playlistName}' para el usuario ${usuario.nombre}.`);
            playlist = await models.Playlist.create({
                nombre: playlistName,
                descripcion: "Playlist generada automáticamente con las canciones recomendadas para el día.",
                fechaCreacion: new Date(),
                publico: false
            });

            // 🔹 Asociar la playlist al usuario administrador por defecto
            await models.UsuarioPlaylist.create({
                usuario_id: adminUsuario.id,
                playlist_id: playlist.id
            });
        } else {
            console.log(`✅ La playlist ya existía con ID: ${playlist.id}`);
            
            // 🔹 Ahora verificamos si el usuario ya está vinculado a la playlist
            const existeRelacion = await models.UsuarioPlaylist.findOne({
                where: { usuario_id: userId, playlist_id: playlist.id }
            });

            if (!existeRelacion) {
                console.log(`🔗 Vinculando la playlist '${playlistName}' al usuario ${usuario.email}.`);
                await models.UsuarioPlaylist.create({
                    usuario_id: userId,
                    playlist_id: playlist.id
                });
            } else {
                console.log(`🔹 El usuario ya está vinculado a la playlist '${playlistName}'.`);
            }
        }

        return playlist;
    } catch (error) {
        console.error("❌ Error al verificar o crear la playlist:", error);
        throw error;
    }
}
  
  async addSongsToPlaylist(userId, songIds) {
    console.log("Entrando en addSongsToPlaylist", userId);
    try {
      const playlist = await this.getOrCreatePlaylist(userId);
  
      if (!playlist || !playlist.id) {
        throw new Error("No se pudo obtener o crear la playlist. Playlist ID es inválido.");
      }
  
      if (!songIds || songIds.length === 0) {
        console.warn("La lista de canciones está vacía. No se añadirá nada a la playlist.");
        return;
      }
  
      const validSongIds = songIds.filter((id) => id !== null && id !== undefined);
  
      if (validSongIds.length === 0) {
        console.warn("No hay canciones válidas para añadir a la playlist.");
        return;
      }
  
      for (const cancionId of validSongIds) {
        try {
          await models.CancionPlaylist.create({
            playlist_id: playlist.id,
            cancion_id: cancionId,
            fechaAgregado: new Date(),
          });
          console.log(`Canción ${cancionId} añadida a la playlist ${playlist.id}`);
        } catch (error) {
          console.error(`Error al añadir la canción ${cancionId} a la playlist:`, error);
        }
      }
  
      console.log("Canciones añadidas a la playlist 'Recomendación Diaria'.");
    } catch (error) {
      console.error("Error al añadir canciones a la playlist:", error);
      throw error;
    }
  }

  /**
   * Recomendar una canción en cada inicio de sesión basada en géneros más escuchados.
   */
  async recommendOnLogin(userId) {
    try {
        const userPreference = await models.Recomendacion.findOne({
            where: { usuario_id: userId },
        });

        if (userPreference && !userPreference.habilitada) {
            console.log("El usuario ha deshabilitado las recomendaciones.");
            return {
                ok: true,
                msg: "Las recomendaciones están deshabilitadas para este usuario.",
                songRecommendation: null
            };
        }

        const userHistory = await models.Historial.findAll({
            where: { usuario_id: userId },
            include: [{ model: models.Cancion, as: "cancion" }]
        });

        let songRecommendation;

        if (!userHistory.length) {
            songRecommendation = await models.Cancion.findOne({
                order: Sequelize.literal("RAND()"),
            });
        } else {
            const genreCounts = userHistory.reduce((acc, entry) => {
                const genreId = entry.Cancion?.generoId;
                if (genreId) {
                    acc[genreId] = (acc[genreId] || 0) + 1;
                }
                return acc;
            }, {});

            const topGenre = Object.entries(genreCounts).sort(
                ([, countA], [, countB]) => countB - countA
            )[0]?.[0];

            if (!topGenre) {
                return {
                    ok: true,
                    msg: "No se pudo generar una recomendación en este momento.",
                    songRecommendation: null
                };
            }

            songRecommendation = await models.Cancion.findOne({
                where: {
                    generoId: topGenre,
                    id: {
                        [Op.notIn]: userHistory.map((entry) => entry.Cancion?.id),
                    },
                },
                order: Sequelize.literal("RAND()"),
            });
        }

        if (!songRecommendation) {
            return {
                ok: true,
                msg: "No se pudo generar una recomendación en este momento.",
                songRecommendation: null
            };
        }

        const newRecommendation = await models.Recomendacion.create({
            usuario_id: userId,
            cancion_id: songRecommendation.id,
            fecha_recomendacion: new Date(),
            habilitada: true,
        });

        const recommendationWithSong = await models.Recomendacion.findOne({
            where: { id: newRecommendation.id },
            include: [{ model: models.Cancion, as: "Cancion" }],
        });

        return {
            ok: true,
            songRecommendation: recommendationWithSong?.Cancion || null,
            msg: recommendationWithSong?.Cancion ? "Recomendación generada exitosamente." : "No se encontró una canción recomendada."
        };

    } catch (error) {
        console.error("Error al recomendar una canción en inicio de sesión:", error);
        return {
            ok: false,
            msg: "Error interno del servidor.",
            error: error.message,
        };
    }
  }

  /**
     * Obtener el estado de habilitación de recomendaciones para un usuario.
     */
  async getRecommendationStatus(userId) {
    try {
        const recommendation = await models.Recomendacion.findOne({
            attributes: ["habilitada"],
            where: { usuario_id: userId }
        });

        return recommendation ? recommendation.habilitada : false;
    } catch (error) {
        console.error("Error al obtener estado de recomendaciones:", error);
        throw new Error("Error al obtener estado de recomendaciones");
    }
  }

  /**
   * Activar o desactivar recomendaciones en la base de datos.
   */
  async updateRecommendationStatus(userId, habilitada) {
    try {
        await models.Recomendacion.update(
            { habilitada },
            { where: { usuario_id: userId } }
        );

        return { msg: `Recomendaciones ${habilitada ? "activadas" : "desactivadas"} correctamente.` };
    } catch (error) {
        console.error("Error al actualizar estado de recomendaciones:", error);
        throw new Error("Error al actualizar estado de recomendaciones");
    }
  }

  async getPlaylistByUserEmail(email) {
    console.log("🔍 Buscando la playlist de Recomendación Diaria para:", email);
    try {
        // 🔹 Buscar el usuario con el email proporcionado
        const usuario = await models.Usuario.findOne({ where: { email } });
        if (!usuario) {
            throw new Error(`Usuario con email ${email} no encontrado.`);
        }

        const playlistName = `Recomendación Diaria ${email}`;

        console.log("Nombre de la playlist a buscar:", playlistName);

        // 🔹 Buscar la playlist con el nombre generado
        const playlist = await models.Playlist.findOne({
            where: { nombre: playlistName },
            include: [{ model: models.Cancion, as: "canciones" }]
        });

        console.log("Playlist encontrada:", playlist ? playlist.id : "No encontrada");

        if (!playlist) {
            return { msg: "No se encontró una playlist de recomendaciones para este usuario.", data: null };
        }

        console.log("Playlist encontrada:", playlist.id);
        return { msg: "Playlist obtenida.", data: playlist };
    } catch (error) {
        console.error("Error al obtener la playlist de recomendaciones:", error);
        throw error;
    }
}
}

module.exports = RecommendConnection;
