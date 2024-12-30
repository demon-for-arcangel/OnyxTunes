const { response, request } = require("express");
const ConexionSeguidores = require("../database/seguidoresConnection");

const conx = new ConexionSeguidores();

/**
 * Obtener los seguidores de un artista
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
 */
async function addFollower(req, res) {
  try {
    const { artistaId, followerId } = req.body;

    const result = await conx.addFollower(artistaId, followerId);

    if (result.success) {
      return res
        .status(200)
        .json({ message: result.message, data: result.data || null });
    }

    return res.status(400).json({ message: result.message });
  } catch (error) {
    console.error("Error al añadir el seguidor:", error);
    return res.status(500).json({ message: "Ocurrió un error en el servidor" });
  }
}

/**
 * Eliminar un seguidor de un artista
 */
const removeFollower = async (req, res) => {
  const { artistaId, followerId } = req.body;

  if (!artistaId || !followerId) {
    return res
      .status(400)
      .json({ msg: "Se requieren los IDs del artista y del seguidor." });
  }

  try {
    const result = await conx.removeFollower(artistaId, followerId);

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

/**
 * Listar los artistas más famosos por sus seguidores
 */
const getTopArtists = async (req, res) => {
  //probar
  const { limit } = req.query;

  try {
    const topArtists = await conx.getTopArtists(limit || 10);

    if (!topArtists || topArtists.length === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontraron artistas con seguidores." });
    }

    res.status(200).json(topArtists);
  } catch (error) {
    console.error("Error al obtener los artistas con más seguidores:", error);
    res
      .status(500)
      .json({ msg: "Error al obtener los artistas con más seguidores." });
  }
};

module.exports = {
  getFollowers,
  getFollowing,
  addFollower,
  removeFollower,
  getTopArtists,
};
