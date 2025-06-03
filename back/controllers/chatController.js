const { Op } = require("sequelize");
const models = require("../models");

class ChatController {
  static async obtenerMensajes(req, res) {
    try {
      const { emisorId, receptorId } = req.params;

      if (!emisorId || !receptorId) {
        return res
          .status(400)
          .json({ message: "Emisor o receptor no proporcionado" });
      }

      const mensajes = await models.Mensaje.findAll({
        where: {
          [Op.or]: [
            { emisor: emisorId, receptor: receptorId },
            { emisor: receptorId, receptor: emisorId },
          ],
        },
        include: [
          {
            model: models.Usuario,
            as: "emisorUsuario",
            attributes: ["id", "nombre", "email"],
          },
          {
            model: models.Usuario,
            as: "receptorUsuario",
            attributes: ["id", "nombre", "email"],
          },
          {
            model: models.Asset,
            as: "files",
            attributes: ["path"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      return res.status(200).json({
        success: true,
        mensajes: mensajes,
      });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async enviarMensaje(req, res) {
    try {
      const { emisorId, receptorId, texto } = req.body;

      if (!texto) {
        return res
          .status(400)
          .json({ message: "El contenido del mensaje es obligatorio" });
      }

      const nuevoMensaje = await models.Mensaje.create({
        emisor: emisorId,
        receptor: receptorId,
        texto: texto,
        leido: false,
      });

      return res.status(201).json({
        success: true,
        message: "Mensaje enviado exitosamente",
        data: nuevoMensaje,
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async marcarComoLeido(req, res) {
    try {
      const { mensajeId } = req.body;

      const mensaje = await models.Mensaje.findByPk(mensajeId);
      if (!mensaje) {
        return res.status(404).json({ message: "Mensaje no encontrado" });
      }

      mensaje.leido = true;
      await mensaje.save();

      return res
        .status(200)
        .json({ success: true, message: "Mensaje marcado como leído" });
    } catch (error) {
      console.error("Error al marcar como leído:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async subirArchivosMensaje(req, res) {
    try {
      const filesSubidos = await uploadFiles(req.files, {
        fileExtension: ["jpg", "png", "jpeg"],
        dir: "chat_images",
        numberLimit: 4,
      });
      const archivosParaEnviar = [];

      filesSubidos.forEach((file) => {
        archivosParaEnviar.push(file.secure_url);
      });

      return res.status(200).json({
        executed: true,
        files: archivosParaEnviar,
      });
    } catch (e) {
      return res.status(500).json({ executed: false, error: e.message });
    }
  }

  static async obtenerChats(req, res) {
    const { usuarioId } = req.params;

    try {
      const mensajes = await models.Mensaje.findAll({
        where: {
          [Op.or]: [{ emisor: usuarioId }, { receptor: usuarioId }],
        },
        include: [
          {
            model: models.Usuario,
            as: "emisorUsuario", 
            attributes: ["id", "nombre", "foto_perfil"],
          },
          {
            model: models.Usuario,
            as: "receptorUsuario", 
            attributes: ["id", "nombre", "foto_perfil"],
          },
        ],
      });

      const uniqueChats = [];
      const seenUsers = new Set();

      mensajes.forEach((mensaje) => {
        const otherUser =
          mensaje.emisor === parseInt(usuarioId)
            ? mensaje.receptorUsuario
            : mensaje.emisorUsuario;

        if (!seenUsers.has(otherUser.id)) {
          seenUsers.add(otherUser.id);
          uniqueChats.push(otherUser);
        }
      });

      return res.status(200).json({ success: true, chats: uniqueChats });
    } catch (error) {
      console.error("Error al obtener los chats:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los chats.",
        error: error.message,
      });
    }
  }
}

module.exports = ChatController;
