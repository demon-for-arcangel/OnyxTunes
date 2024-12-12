const models = require('../models/index');
const { Op } = require("sequelize");

/**
 * Conexion de Mensaje
 * @function findRecentChatMessages Obtener los mensajes de un chat
 * @function getReceptoresPorEmisor Obtener los receptores por un emisor
 * @function pushMessage Pushear un mensaje
 * @function pushMessageFiles Pushear archivos de un mensaje
 * @function getUnreadedMessages Obtener los mensajes no leídos
 * @function markMessageAsReaded Marcar un mensaje como leído
 * @function getChatsByUserId Obtener los chats de un usuario
 * @function getChatsGroupedByReceiver Obtener los chats agrupados por receptor
 */
class Message {
    static findRecentChatMessages = async (emisor, receptor) => {
        try {
            console.log(emisor, receptor);
            
            const emisorUser = await models.Usuario.findOne({
                where: { id: emisor },
                attributes: ['id', 'email', 'nickname', 'foto_perfil', 'connected']
            });
            console.log(emisorUser);

            const receptorUser = await models.Usuario.findOne({
                where: { id: receptor },
                attributes: ['id', 'email', 'nickname', 'foto_perfil', 'connected']
            });
            console.log(receptorUser);

            const messages = await models.Mensaje.findAll({
                where: {
                    [Op.or]: [
                        { emisor: emisor, receptor: receptor },
                        { emisor: receptor, receptor: emisor },
                    ]
                },
                include: {
                    model: models.Asset,
                    as: 'files',
                    attributes: ['file_link']
                },
            });
         
            console.log('Mensajes recuperados:', messages);  

            return {
                success: true,
                message: 'Se han obtenido los mensajes correctamente.',
                data: {
                    emisorUser,
                    receptorUser,
                    messages 
                }
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error al obtener los mensajes.');
        }
    };

    static getReceptoresPorEmisor = async (emisorId) => {
        console.log(emisorId);
    
        if (!emisorId) {
            return res.status(400).json({ success: false, message: 'Emisor ID no proporcionado.' });
        }
    
        try {
            const receptores = await models.Mensaje.findAll({
                where: {
                    emisor: emisorId
                },
                attributes: ['receptor'], 
                group: ['receptor'] 
            });

            console.log(receptores);
    
            const receptoresConInfo = await Promise.all(receptores.map(async (mensaje) => {
                const usuario = await models.Usuario.findByPk(mensaje.receptor);
                return {
                    id: mensaje.receptor,
                    nickname: usuario.nickname,
                    foto_perfil: usuario.foto_perfil
                };
            }));

            return {
                success: true,
                message: 'Se han obtenido los mensajes correctamente.',
                data: {
                    receptoresConInfo,
                }
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener los mensajes.');
        }
    };

    static pushMessage = async (emisor, receptor, texto) => {
        try {
            const data = {
                emisor,
                receptor,
                texto,
                leido: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const query = await models.Mensaje.create(data);
            const message = query.get({ plain: true });

            return {
                success: true,
                message: 'Se ha pusheado el mensaje correctamente.',
                data: message
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error al pushear el mensaje.');
        }
    };

    static pushMessageFiles = async (messageId, urls) => {
        try {
            const assetRecords = urls.map(url => ({
                message_id: messageId,
                file_link: url,
                createdAt: new Date(),
            }));

            const query = await models.Asset.bulkCreate(assetRecords);

            return {
                success: true,
                message: 'Se han añadido los archivos correctamente.',
                data: query
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error al añadir los archivos.');
        }
    };

    static getUnreadedMessages = async (emisor, receptor) => {
        try {
            const messages = await models.Mensaje.findAll({
                where: {
                    [Op.and]: [
                        { emisor: emisor },
                        { receptor: receptor },
                        { leido: false }
                    ]
                },
                attributes: ['id']
            });

            return {
                success: true,
                message: 'Se han obtenido los mensajes correctamente.',
                data: messages
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error al obtener los mensajes no leídos.');
        }
    };

    static markMessageAsReaded = async (id) => {
        try {
            const query = await models.Mensaje.update({ leido: true }, { where: { id } });

            return {
                success: true,
                message: 'Se han leído los mensajes correctamente.',
                data: query
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error al marcar el mensaje como leído.');
        }
    };

    static getChatsByUserId = async (userId) => {
        try {
            const usersWithReadMessages = await models.Mensaje.findAll({
                where: {
                    emisor: userId, 
                    leido: true,
                },
                attributes: [
                    'receptor', 
                    [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'readCount'],
                    [models.sequelize.fn('MAX', models.sequelize.col('createdAt')), 'lastReadMessageDate'] 
                ],
                group: ['receptor'],
                raw: true
            });
    
            const usersWithPendingMessages = await models.Mensaje.findAll({
                where: {
                    emisor: userId, 
                    leido: false,
                },
                attributes: [
                    'receptor', 
                    [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'pendingCount'],
                    [models.sequelize.fn('MAX', models.sequelize.col('createdAt')), 'lastPendingMessageDate'] 
                ],
                group: ['receptor'],
                raw: true
            });
    
            const readChats = await Promise.all(usersWithReadMessages.map(async (message) => {
                const receptorInfo = await models.Usuario.findOne({
                    where: { id: message.receptor },
                    attributes: ['id', 'nickname', 'foto_perfil'] 
                });
    
                return {
                    receptor: message.receptor,
                    readCount: message.readCount,
                    lastReadMessageDate: message.lastReadMessageDate,
                    receptorInfo 
                };
            }));
    
            const pendingChats = await Promise.all(usersWithPendingMessages.map(async (message) => {
                const receptorInfo = await models.Usuario.findOne({
                    where: { id: message.receptor },
                    attributes: ['id', 'nickname', 'foto_perfil'] 
                });
    
                return {
                    receptor: message.receptor,
                    pendingCount: message.pendingCount,
                    lastPendingMessageDate: message.lastPendingMessageDate,
                    receptorInfo 
                };
            }));
    
            return {
                success: true,
                message: 'Se han obtenido los chats correctamente.',
                data: {
                    readChats, 
                    pendingChats 
                }
            };
        } catch (e) {
            console.log(e);
            throw new Error('Error al obtener los chats.');
        }
    };

    static getChatsGroupedByReceiver = async (userId) => {
        try {
            const messages = await models.Mensaje.findAll({
                where: {
                    emisor: userId,
                },
                include: [
                    {
                        model: models.Usuario,
                        as: 'receptorUsuario', 
                        attributes: ['id', 'nickname', 'foto_perfil']
                    }
                ],
                order: [['createdAt', 'DESC']], 
                raw: true
            });
    
            const groupedChats = messages.reduce((acc, message) => {
                const receptorId = message['receptorUsuario.id']; 
                if (!acc[receptorId]) {
                    acc[receptorId] = {
                        receptorInfo: {
                            id: receptorId,
                            nickname: message['receptorUsuario.nickname'],
                            foto_perfil: message['receptorUsuario.foto_perfil']
                        },
                        messages: []
                    };
                }
                acc[receptorId].messages.push({
                    id: message.id,
                    texto: message.texto,
                    createdAt: message.createdAt,
                    leido: message.leido
                });
                return acc;
            }, {});
    
            const result = Object.values(groupedChats);
    
            return {
                success: true,
                message: 'Se han obtenido los chats agrupados correctamente.',
                data: result 
            };
        } catch (e) {
            console.log(e);
            throw new Error('Error al obtener los chats agrupados.');
        }
    };
}

module.exports = Message;