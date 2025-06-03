const { v4: getUniqueId } = require('uuid');

/**
 * NO IMPLEMENTADO
 * Controlador de las conversaciones de Chat
 */
class ConversationController {
    constructor(socket) {
        this.socket = socket; 
        this.userId = this.socket.user.userId
    }

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
            return chatConversation[0] 
        } else {
            return false;
        }
    }

    static deleteConversation = (uuid) => {
        ConversationController.conversations.delete(uuid);
    }
}

module.exports = ConversationController;