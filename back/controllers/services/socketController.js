const models = require("../../models");

class SocketController {
  static io;
  static usuariosConectados = new Map();

  static onConnect(socket, io) {
    SocketController.io = io;

    const userId = socket.user.userId;
    SocketController.usuariosConectados.set(userId, socket);

    io.emit("usuario-conectado", {
      count: SocketController.usuariosConectados.size,
    });

    socket.on("disconnect", () => SocketController.onDisconnect(socket));
    socket.on(
      "mensaje",
      async (params) => await SocketController.onMessage(socket, params),
    );
    socket.on(
      "unirse-chat",
      async (params) =>
        await SocketController.toggleChatRoom(socket, params, "join"),
    );
    socket.on(
      "dejar-chat",
      async (params) =>
        await SocketController.toggleChatRoom(socket, params, "leave"),
    );
    socket.on(
      "mensaje-leido",
      async (params) => await SocketController.onMessageRead(socket, params),
    );
  }

  static onDisconnect(socket) {
    SocketController.usuariosConectados.delete(socket.user.userId);
    SocketController.io.emit("usuario-desconectado", {
      count: SocketController.usuariosConectados.size,
    });
  }

  static async onMessage(socket, params) {
    const { texto, idParaEnviar } = params;
    if (!texto || !texto.texto) {
      return socket.emit("error", {
        message: "El contenido del mensaje es inválido.",
      });
    }

    try {
      const mensajeInsertado = await models.Mensaje.create({
        emisor: socket.user.userId,
        receptor: idParaEnviar,
        texto: texto.texto,
        leido: false,
      });

      const roomId = `room_${idParaEnviar}`;
      SocketController.io.to(roomId).emit("mensaje", mensajeInsertado);

      const targetSocket =
        SocketController.usuariosConectados.get(idParaEnviar);
      if (targetSocket) {
        targetSocket.emit("nuevo-mensaje", { from: socket.user.userId });
      }
    } catch (error) {
      socket.emit("error", { message: "Error al enviar el mensaje." });
    }
  }

  static toggleChatRoom(socket, params, action) {
    const { receptorId } = params;
    const roomId = `room_${receptorId}`;

    if (action === "join") {
      socket.join(roomId);
      socket.emit("unirse-chat", { unido: true });
    } else if (action === "leave") {
      socket.leave(roomId);
    }
  }

  static async onMessageRead(socket, params) {
    const { receptorId } = params;
    try {
      await models.Mensaje.update(
        { leido: true },
        { where: { receptor: receptorId, leido: false } },
      );
      socket.emit("mensaje-leido", { receptorId });
    } catch (error) {
      socket.emit("error", {
        message: "Error al marcar el mensaje como leído.",
      });
    }
  }
}

module.exports = SocketController;
