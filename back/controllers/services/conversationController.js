const { v4: getUniqueId } = require('uuid');

// Las Rooms son 'salas' que incluye Socket.io para poder enviar peticiones a usuarios especificos. Esto es genial para hacer un chat.
// La idea que se ha planteado es que sea el backend el que se encargue de manejar estas rooms.
//
// La informacion que se guarda es:
// - El ID de la room, generada automaticamente.
// - Un array con los IDs de los usuarios que estén dentro.

// Se utilizan instancias de socket.io para que sea mas sencillo identificar al usuario que llame al controlador.

class ConversationController {
    constructor(socket) {
        this.socket = socket; // Aqui está la instancia de socket.io perteneciente a cada usuario que realiza una conexión.
        this.userId = this.socket.user.userId
    }

    /** Esto es una lista clave-valor, cuya claves son los uuid de las rooms, y los valores los usuarios de los mismos.
     *
     * @type {Map<string, Set<number>>}
     */
    static conversations = new Map();

    static getAllConversations = () => {
        return ConversationController.conversations;
    }

    createRoom = () => {
        const uuid = getUniqueId();
        const users = new Set();

        ConversationController.conversations.set(uuid, users);

        return uuid;
    }

    leaveRoom = (uuid) => {
        const userId = this.socket.user.userId;

        this.socket.leave(uuid);

        const roomUsers = ConversationController.getConversation(uuid);

        roomUsers.delete(userId);
        ConversationController.conversations.set(uuid, roomUsers);

        console.log(`Usuario ${this.socket.user.userId} ha salido de la room ${uuid}`);

        if (roomUsers.size === 0) {
            ConversationController.deleteConversation(uuid)
        }
    }

    leaveAllConversations = () => {
        const conversations = [...ConversationController.conversations.entries()];
        const userConversations = conversations.filter(([uuid, users]) => users.has(this.socket.user.userId))

        userConversations.forEach(([conversationUuid, conversationUsers]) => {
            this.leaveConversation(conversationUuid)
        });
    }

    static getConversation(uuid) {
            return ConversationController.conversations.get(uuid);
    }

    joinRoom = (uuid) => {
        console.log(`Metiendo al usuario ${this.socket.user.userId} en ${uuid}`)
        this.socket.join(uuid);

        const conversationUsers = ConversationController.getConversation(uuid);

        conversationUsers.add(this.socket.user.userId);

        ConversationController.conversations.set(uuid, conversationUsers);
    }

    joinUserFreeRoom = (userFindingId) => {
        if (userFindingId === this.socket.user.userId) {
            console.warn('No puedes incluirte a ti mismo.');
            return false;
        }

        const conversations = [...ConversationController.conversations.entries()];
        const firstConversationFree = conversations.find(([uuid, users]) => users.has(userFindingId));

        if (!firstConversationFree) return false;

        const conversationUuid = firstConversationFree[0];

        this.joinConversation(conversationUuid);

        return conversationUuid;
    }

    getUserFreeRoom = (userFindingId) => {
        const conversations = [...ConversationController.conversations.entries()];
        const firstConversationFree = conversations.find(([uuid, users]) => users.has(userFindingId));

        if (!firstConversationFree) return false;

        return firstConversationFree[0];
    }

    findChatRoom = (receptorId) => {
        const rooms = [...ConversationController.rooms.entries()];

        const chatConversation = conversations.find(([uuid, users]) => users.has(this.socket.user.userId) && users.has(receptorId));

        if (chatConversation) {
            return chatConversation[0] // La primera posicion es el ID de la room.
        } else {
            return false;
        }
    }

    static deleteConversation = (uuid) => {
        ConversationController.conversations.delete(uuid);
    }
}

module.exports = ConversationController;