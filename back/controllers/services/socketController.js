const models = require('../../models/index');

/**
 * NO IMPLEMENTADO
 * Controlador de las conexiones de socket
 */
class SocketController {
    static io;
    static usersConnected = new Map();

    static findUsersById = (ids) => {
        const userList = [...SocketController.usersConnected.entries()];
        return userList.filter(entry => ids.includes(entry[0]));
    }

    static onConnect = async (socket, io) => {
        try {
            SocketController.io = io;

            let ownId = socket.user.userId;
            SocketController.usersConnected.set(ownId, socket);

            io.emit('user-connected', { count: SocketController.usersConnected.size });

            socket.on('disconnect', () => SocketController.onDisconnect(socket));
            socket.on('msg', async (params) => await SocketController.onMessage(socket, params));
            socket.on('join-chat', async (params) => await SocketController.onJoinChat(socket, params, io));
            socket.on('leave-chat', async (params) => await SocketController.onLeaveChat(socket, params));
            socket.on('message-read', async (params) => await SocketController.onMessageRead(socket, params));
            socket.on('new-match', async (params) => await SocketController.onNewMatch(socket, params));
        } catch (e) {
            console.error(e);
        }
    }

    static onDisconnect = (socket) => {
        SocketController.usersConnected.delete(socket.user.userId);
        SocketController.io.emit('user-disconnected', { count: SocketController.usersConnected.size });

        console.log(`Se ha cerrado la conexión ${socket.id} (Usuario con ID ${socket.user.userId})`);

        console.log('Intentando desconectarse de las rooms...');
    }

    static onMessage = async (socket, params) => {
        const { content, idToSend } = params;

        if (content.text) {
            const inserted = await models.Message.pushMessage(socket.user.userId, idToSend, content.text);

            console.log(`Enviando mensaje a la room ${idToSend}`);
            SocketController.io.to(idToSend).emit('msg', inserted.data);
        } else if (content.urls) {
            const message = (await models.Message.pushMessage(socket.user.userId, idToSend, "")).data;

            const files = (await models.Asset.pushMessageFiles(message.id, content.urls)).data;

            console.log(`Enviando mensaje con archivos a la room ${idToSend}`);
            SocketController.io.to(idToSend).emit('msg-file', {
                message,
                files,
            });
        }

        const socketToSend = SocketController.usersConnected.get(idToSend);
        if (socketToSend) {
            socketToSend.emit('new-message', { from: socket.user.userId });
        }
    };

    static onMessageRead = async (socket, params) => {
        const receptorId = params.receptorId;
        const unreadMessages = await models.Message.getUnreadedMessages(receptorId, socket.user.userId);

        const readedMessages = [];
        if (unreadMessages.data.length > 0) {
            unreadMessages.data.forEach(message => {
                models.Mensaje.markMessageAsReaded(message.id);
                readedMessages.push(message.id);
            });

            this.io.to(receptorId).emit('message-read', { messages: readedMessages });
        }
    }

    static onNewMatch = async (socket, params) => {
        const targetId = params.targetId;

        const userExists = await models.User.checkIfIdExists(targetId);

        if (!userExists) return;

        const targetSocket = SocketController.usersConnected.get(targetId);

        if (targetSocket) {
            targetSocket.emit('new-match', { from: socket.user.userId });
        }
    };

    static onJoinChat = async (socket, params) => {
        const { receptorId } = params;
        const roomId = `room_${receptorId}`; 
        socket.join(roomId);

        console.log(`Usuario ${socket.user.userId} se unió a la sala ${roomId}`);
        socket.emit('join-chat', { joined: true });
    }

    static onLeaveChat = async (socket, params) => {
        const { receptorId } = params;
        const roomId = `room_${receptorId}`;
        socket.leave(roomId);

        console.log(`Usuario ${socket.user.userId} salió de la sala ${roomId}`);
    }
}

module.exports = SocketController;