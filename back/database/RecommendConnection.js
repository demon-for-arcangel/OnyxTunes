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
            throw new Error(`Usuario con ID ${userId} no encontrado.`);
        }

        const adminUsuario = await models.Usuario.findOne({ where: { email: "onyxtunes@gmail.com" } });
        if (!adminUsuario) {
            throw new Error("Usuario administrador 'onyxtunes@gmail.com' no encontrado en la base de datos.");
        }

        const playlistName = `Recomendación Diaria ${usuario.email}`;

        let playlist = await models.Playlist.findOne({
            where: { nombre: playlistName }
        });

        if (!playlist) {
            playlist = await models.Playlist.create({
                nombre: playlistName,
                descripcion: "Playlist generada automáticamente con las canciones recomendadas para el día.",
                fechaCreacion: new Date(),
                publico: false
            });

            await models.UsuarioPlaylist.create({
                usuario_id: adminUsuario.id,
                playlist_id: playlist.id
            });
        } else {            
            const existeRelacion = await models.UsuarioPlaylist.findOne({
                where: { usuario_id: userId, playlist_id: playlist.id }
            });

            if (!existeRelacion) {
                await models.UsuarioPlaylist.create({
                    usuario_id: userId,
                    playlist_id: playlist.id
                });
            } else {
              throw new Error("El usuario ya está vinculado a la playlist");
            }
        }

        return playlist;
    } catch (error) {
        console.error("Error al verificar o crear la playlist:", error);
        throw error;
    }
}
  
  async addSongsToPlaylist(userId, songIds) {
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
        } catch (error) {
          console.error(`Error al añadir la canción ${cancionId} a la playlist:`, error);
        }
      }
  
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

        let newRecommendation; 
          if (!userHistory.length) {
              songRecommendation = await models.Cancion.findOne({
                  order: Sequelize.literal("RAND()"),
              });

              if (songRecommendation) {
                  newRecommendation = await models.Recomendacion.create({
                      usuario_id: userId,
                      cancion_id: songRecommendation.id,
                      fecha_recomendacion: new Date(),
                      habilitada: true,
                  });
              }
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

        newRecommendation = await models.Recomendacion.create({
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
        throw new Error("Error al obtener estado de recomendaciones");
    }
  }

  /**
   * Activar o desactivar recomendaciones en la base de datos.
   */
  async updateRecommendationStatus(userId, habilitada) {
  try {
    const existingRecommendation = await models.Recomendacion.findOne({
      where: { usuario_id: userId }
    });

    if (existingRecommendation) {
      await models.Recomendacion.update(
        { habilitada },
        { where: { usuario_id: userId } }
      );
    } else {
      await models.Recomendacion.create({
        usuario_id: userId,
        cancion_id: null, 
        fecha_recomendacion: new Date(),
        habilitada
      });
    }

    return { msg: `Recomendaciones ${habilitada ? "activadas" : "desactivadas"} correctamente.` };

  } catch (error) {
    throw new Error("Error al actualizar estado de recomendaciones");
  }
}


  async getPlaylistByUserEmail(email) {
    try {
        const usuario = await models.Usuario.findOne({ where: { email } });
        if (!usuario) {
            throw new Error(`Usuario con email ${email} no encontrado.`);
        }

        const playlistName = `Recomendación Diaria ${email}`;

        const playlist = await models.Playlist.findOne({
            where: { nombre: playlistName },
            include: [{ model: models.Cancion, as: "canciones" }]
        });

        if (!playlist) {
            return { msg: "No se encontró una playlist de recomendaciones para este usuario.", data: null };
        }
        return { msg: "Playlist obtenida.", data: playlist };
    } catch (error) {
        console.error("Error al obtener la playlist de recomendaciones:", error);
        throw error;
    }
}
}

module.exports = RecommendConnection;
