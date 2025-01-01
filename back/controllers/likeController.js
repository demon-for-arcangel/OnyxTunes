const { response } = require("express");
const Conexion = require("../database/likeConnection");

const conx = new Conexion();

/**
 * Controlador de Likes
 * @function getLikesByUserId Obtener los likes de un usuario
 * @function deleteLike Eliminar un like
 */
const getLikesByUserId = async (req, res) => {
    const { userId } = req.params;

    try{
        const likes = await conx.getLikesUserId(userId);
        res.status(200).json({ data: likes });
    } catch (error) {
        console.error("error al obtener los likes del usuario", error)
        res.status(500).json({ mgs: "error en la obtencion de likes"})
    }
}
const deleteLike = async (req, res) => {
    const { likeId } = req.params; 

    try {
        const result = await conx.deleteLike(likeId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al eliminar el like:", error);
        res.status(500).json({ message: "Error al eliminar el like" });
    }
};

module.exports = {
    getLikesByUserId, deleteLike
}