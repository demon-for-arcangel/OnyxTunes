const { Op } = require("sequelize");
const models = require("../models/index");

/**
 * Conexion de Seguidores
 * @class ConexionSeguidores
 * @method getFollowers - Obtener los seguidores de un artista
 * @method getFollowing - Obtener a quién sigue un usuario
 * @method addFollower - Añadir un seguidor a un artista
 * @method removeFollower - Eliminar un seguidor de un artista
 */
class ConexionSeguidores {
  constructor() {}

  /**
   * Obtener los seguidores de un artista
   */
  async getFollowers(artistId) {
    try {
      const followers = await models.Seguidor.findAll({
        where: { user_id: artistId },
        include: [
          {
            model: models.Usuario,
            as: "seguidor",
            attributes: ["id", "nombre", "email"],
          },
        ],
      });
      return followers;
    } catch (error) {
      console.error("Error al obtener los seguidores:", error);
      throw new Error("Error al obtener los seguidores");
    }
  }

  /**
   * Obtener a quién sigue un usuario
   */
  async getFollowing(userId) {
    try {
      const following = await models.Seguidor.findAll({
        where: { seguidor_id: userId },
        include: [
          {
            model: models.Usuario,
            as: "artista",
            attributes: ["id", "nombre", "email"],
          },
        ],
      });
      return following;
    } catch (error) {
      console.error("Error al obtener los artistas seguidos:", error);
      throw new Error("Error al obtener los artistas seguidos");
    }
  }

  /**
   * Añadir un seguidor a un artista
   */
  async addFollower(artistaId, followerId) {
    try {
      const usuario = await models.Usuario.findByPk(artistaId, {
        include: [
          {
            model: models.Rol,
            attributes: ["nombre"],
          },
        ],
      });

      if (!usuario.Rol || usuario.Rol.nombre.toLowerCase() !== "artista") {
        return {
          success: false,
          message: "El usuario que intentas seguir no es un artista",
        };
      }

      const existingFollower = await models.Seguidor.findOne({
        where: {
          user_id: artistaId,
          seguidor_id: followerId,
        },
      });

      if (existingFollower) {
        return { success: true, message: "El usuario ya sigue a este artista" };
      }

      const newFollower = await models.Seguidor.create({
        user_id: artistaId,
        seguidor_id: followerId,
      });

      return {
        success: true,
        message: "Seguidor añadido con éxito",
        data: newFollower,
      };
    } catch (error) {
      console.error("Error al añadir un seguidor:", error);
      return {
        success: false,
        message: error.message || "Error al añadir un seguidor",
      };
    }
  }

  /**
   * Eliminar un seguidor de un artista
   */
  async removeFollower(artistaId, followerId) {
    try {
      const result = await models.Seguidor.destroy({
        where: {
          user_id: artistaId,
          seguidor_id: followerId,
        },
      });
      return result;
    } catch (error) {
      console.error("Error al eliminar un seguidor:", error);
      throw new Error("Error al eliminar un seguidor");
    }
  }

  /**
   * Obtener los artistas con más seguidores
   */
  async getTopArtists(limit = 10) {
    try {
      const seguidores = await models.Seguidor.findAll({
        include: [
          {
            model: models.Usuario,
            as: "artista",
            attributes: ["id", "nombre", "email"],
          },
        ],
      });

      const followersCount = new Map();
      seguidores.forEach((seguidor) => {
        const artistId = seguidor.user_id;
        followersCount.set(artistId, (followersCount.get(artistId) || 0) + 1);
      });

      const artistasOrdenados = [];
      followersCount.forEach((count, artistId) => {
        artistasOrdenados.push({ artistId, count });
      });

      artistasOrdenados.sort((a, b) => b.count - a.count);
      const topArtists = artistasOrdenados.slice(0, limit);

      const artistIds = topArtists.map((artist) => artist.artistId);
      const artists = await models.Usuario.findAll({
        where: { id: artistIds },
        attributes: ["id", "nombre", "email"],
      });

      const result = artists.map((artist) => {
        const artistId = artist.id;
        const artistFollowers = followersCount.get(artistId);
        return {
          ...artist.dataValues,
          followers: artistFollowers,
        };
      });

      return result;
    } catch (error) {
      console.error("Error al obtener los artistas con más seguidores:", error);
      throw new Error("Error al obtener los artistas con más seguidores");
    }
  }
}

module.exports = ConexionSeguidores;
