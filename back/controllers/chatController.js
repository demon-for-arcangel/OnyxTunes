const { findRecentChatMessages } = require("../database/Message");
const { uploadFiles } = require("../helpers/cloudinary");
const UserQuery = require("../database/user/UserConnection");
const Message = require("../database/Message");

class ChatController {
    static getMessages = async (req, res) => {
        try {
            const receptorId = req.params.receptor; // Asegúrate de que este ID se pase correctamente en la URL
            console.log('payload = ',req.userId); // Verifica el contenido de req.payload
            const emisorId = req.userId;
            console.log('emisorId = ',emisorId);
            console.log('receptorId = ',receptorId);

            if (!receptorId || !emisorId) {
                return res.status(400).json({
                    message: 'ID de emisor o receptor no proporcionado.'
                });
            }

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
        } catch (error) {
            console.error('Error en getMessages:', error);
            return res.status(500).json({
                executed: false,
                error: error.message
            });
        }
    }

    static async getChats(req, res) {
        const userId = req.payload.userId; // Asegúrate de que este ID se extraiga correctamente del payload

        try {
            const pendingChats = await Message.getPendingChats(userId);
            const notPendingChats = await Message.getNotPendingChats(userId);

            return res.status(200).json({
                executed: true,
                message: "Se han obtenido la lista de chats correctamente",
                chats: {
                    pending: pendingChats.query,
                    notPending: notPendingChats.query
                }
            });
        } catch (error) {
            console.error('Error en getChats:', error);
            return res.status(500).json({
                executed: false,
                error: error.message
            });
        }
    }

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