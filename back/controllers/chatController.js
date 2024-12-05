const { findRecentChatMessages } = require("../database/Message");
const { uploadFiles } = require("../helpers/cloudinary");
const UserQuery = require("../database/user/UserConnection");
const Message = require("../database/Message");

class ChatController {
    static getMessages = async (req, res) => {
        try {
            const receptorId = req.params.receptor; 
            console.log('payload = ',req.userId); 
            const emisorId = req.userId;
            console.log('emisorId = ',emisorId);
            console.log('receptorId = ',receptorId);

            if (!receptorId || !emisorId) {
                return res.status(400).json({
                    message: 'ID de emisor o receptor no proporcionado.'
                });
            }

            const result = await findRecentChatMessages(emisorId, receptorId);
    
            if (!result.success) {
                return res.status(404).json({
                    message: 'No se encontraron mensajes.',
                });
            }
    
            return res.status(200).json({
                message: result.message,
                data: {
                    emisorUser: result.data.emisorUser,
                    receptorUser: result.data.receptorUser,
                    messages: result.data.messages 
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
        const userId = req.userId; 

        try {
            const chats = await Message.getChatsGroupedByReceiver(userId);

            return res.status(200).json({
                executed: true,
                message: "Se han obtenido la lista de chats correctamente",
                chats: chats
            });
        } catch (error) {
            console.error('Error en getChats:', error);
            return res.status(500).json({
                executed: false,
                error: error.message
            });
        }
    }

    static getReceptoresPorEmisor = async (req, res) => {
        const emisorId = req.params.emisorId; 
    
        try {
            const receptores = await Message.getReceptoresPorEmisor(emisorId);

            return res.status(200).json({
                executed: true,
                message: "Se han obtenido los receptores correctamente",
                data: receptores
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ executed: false, message: 'Error al obtener los receptores.' });
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