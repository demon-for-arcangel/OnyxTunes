const { findRecentChatMessages } = require("../database/Message");
const { uploadFiles } = require("../helpers/cloudinary");
const UserQuery = require("../database/user/UserConnection");
const Message = require("../database/Message");

class ChatController {
    static getMessages = async (req, res) => {
        try {
            const receptorId = req.params.receptor; // Asegúrate de que este ID se pase correctamente en la URL
            const emisorId = req.payload.userId; // Asegúrate de que este ID se extraiga correctamente del payload

            // Llama a la función para obtener los mensajes
            const result = await findRecentChatMessages(emisorId, receptorId);

            // Verifica que la respuesta contenga los mensajes
            if (!result.success) {
                return res.status(404).json({
                    message: 'No se encontraron mensajes.',
                });
            }

            // Devuelve la respuesta con los mensajes
            return res.status(200).json({
                message: result.message,
                data: {
                    emisorUser: result.data.emisorUser,
                    receptorUser: result.data.receptorUser,
                    messages: result.data.messages // Asegúrate de que los mensajes se incluyan aquí
                }
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                executed: false,
                error: e.message
            });
        }
    }

    static getChats = async (req, res) => {
        try {
            const { userId } = req.payload;

            const pending = (await Message.getPendingChats(userId)).query;
            const notPending = (await Message.getNotPendingChats(userId)).query;

            return res.status(200).json({
                executed: true,
                chats: { pending, notPending }
            });
        } catch (e) {
            return res.status(500).json({
                executed: false,
                error: e.message
            });
        }
    };

    static uploadMessageImages = async (req, res) => {
        try {
            const filesUploaded = await uploadFiles(req.files, { fileExtension: ['jpg', 'png', 'jpeg'], dir: 'chat_images', numberLimit: 4 });
            const filesToSend = [];

            filesUploaded.forEach((file) => {
                filesToSend.push(file.secure_url);
            });

            return res.status(200).json({
                executed: true,
                files: filesToSend
            });
        } catch (e) {
            return res.status(500).json({
                executed: false,
                error: e.message
            });
        }
    }
}

module.exports = ChatController;