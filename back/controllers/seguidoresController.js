const { response, request } = require("express");
const ConexionSeguidores = require("../database/seguidoresConnection");

const conx = new ConexionSeguidores();

/**
 * Obtener los seguidores de un artista
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
const getFollowers = async (req, res) => {
  const { artistId } = req.params;

  try {
    const followers = await conx.getFollowers(artistId);

    if (!followers || followers.length === 0) {
      return res.status(404).json({ msg: "El artista no tiene seguidores." });
    }

    res.status(200).json(followers);
  } catch (error) {
    console.error("Error al obtener los seguidores:", error);
    res.status(500).json({ msg: "Error al obtener los seguidores." });
  }
};

/**
 * Obtener a quién sigue un usuario
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await conx.getFollowing(userId);

    if (!following || following.length === 0) {
      return res
        .status(404)
        .json({ msg: "El usuario no sigue a ningún artista." });
    }

    res.status(200).json(following);
  } catch (error) {
    console.error("Error al obtener los artistas seguidos:", error);
    res.status(500).json({ msg: "Error al obtener los artistas seguidos." });
  }
};

/**
 * Añadir un seguidor a un artista
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
const addFollower = async (req, res) => {
  const { artistaId, followerId } = req.body;

  if (!artistaId || !followerId) {
    return res
      .status(400)
      .json({ msg: "Se requieren los IDs del artista y del seguidor." });
  }

  try {
    const newFollower = await conx.addFollower(artistaId, followerId);
    res
      .status(201)
      .json({ msg: "Seguidor añadido exitosamente.", follower: newFollower });
  } catch (error) {
    console.error("Error al añadir el seguidor:", error);
    res.status(500).json({ msg: "Error al añadir el seguidor." });
  }
};

/**
 * Eliminar un seguidor de un artista
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
const removeFollower = async (req, res) => {
  const { artistId, followerId } = req.body;

  if (!artistId || !followerId) {
    return res
      .status(400)
      .json({ msg: "Se requieren los IDs del artista y del seguidor." });
  }

  try {
    const result = await conx.removeFollower(artistId, followerId);

    if (result === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontró la relación para eliminar." });
    }

    res.status(200).json({ msg: "Seguidor eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el seguidor:", error);
    res.status(500).json({ msg: "Error al eliminar el seguidor." });
  }
};

module.exports = {
  getFollowers,
  getFollowing,
  addFollower,
  removeFollower,
};
