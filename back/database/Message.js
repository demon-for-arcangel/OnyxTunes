const models = require('../models/index');
const { Op } = require("sequelize");

class Message {
    static findRecentChatMessages = async (emisor, receptor) => {
        try {
            console.log(emisor, receptor);

            // Obtener información del emisor
            const emisorUser = await models.Usuario.findOne({
                where: { id: emisor },
                attributes: ['id', 'email', 'nickname', 'foto_perfil', 'connected']
            });
            console.log(emisorUser);

            // Obtener información del receptor
            const receptorUser = await models.Usuario.findOne({
                where: { id: receptor },
                attributes: ['id', 'email', 'nickname', 'foto_perfil', 'connected']
            });
            console.log(receptorUser);

            // Obtener mensajes entre el emisor y el receptor
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
         
            console.log('Mensajes recuperados:', messages);  // Verifica que los mensajes se estén recuperando correctamente

            // Retornar la respuesta con los datos
            return {
                success: true,
                message: 'Se han obtenido los mensajes correctamente.',
                data: {
                    emisorUser,
                    receptorUser,
                    messages // Asegúrate de que los mensajes se incluyan aquí
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
                attributes: ['receptor'], // Solo queremos el ID del receptor
                group: ['receptor'] // Agrupamos por receptor para obtener solo únicos
            });

            console.log(receptores);
    
            // Si necesitas obtener información adicional sobre los receptores, puedes hacer un join con el modelo Usuario
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
            // Obtener mensajes leídos
            const usersWithReadMessages = await models.Mensaje.findAll({
                where: {
                    emisor: userId, // Aquí se busca el emisor
                    leido: true,
                },
                attributes: [
                    'receptor', // ID del receptor
                    [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'readCount'],
                    [models.sequelize.fn('MAX', models.sequelize.col('createdAt')), 'lastReadMessageDate'] // Última fecha del mensaje leído
                ],
                group: ['receptor'],
                raw: true
            });
    
            // Obtener mensajes no leídos
            const usersWithPendingMessages = await models.Mensaje.findAll({
                where: {
                    emisor: userId, // Aquí se busca el emisor
                    leido: false,
                },
                attributes: [
                    'receptor', // ID del receptor
                    [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'pendingCount'],
                    [models.sequelize.fn('MAX', models.sequelize.col('createdAt')), 'lastPendingMessageDate'] // Última fecha del mensaje no leído
                ],
                group: ['receptor'],
                raw: true
            });
    
            // Obtener información de los usuarios receptores para mensajes leídos
            const readChats = await Promise.all(usersWithReadMessages.map(async (message) => {
                const receptorInfo = await models.Usuario.findOne({
                    where: { id: message.receptor },
                    attributes: ['id', 'nickname', 'foto_perfil'] // Atributos que deseas incluir
                });
    
                return {
                    receptor: message.receptor,
                    readCount: message.readCount,
                    lastReadMessageDate: message.lastReadMessageDate,
                    receptorInfo // Información del usuario receptor
                };
            }));
    
            // Obtener información de los usuarios receptores para mensajes no leídos
            const pendingChats = await Promise.all(usersWithPendingMessages.map(async (message) => {
                const receptorInfo = await models.Usuario.findOne({
                    where: { id: message.receptor },
                    attributes: ['id', 'nickname', 'foto_perfil'] // Atributos que deseas incluir
                });
    
                return {
                    receptor: message.receptor,
                    pendingCount: message.pendingCount,
                    lastPendingMessageDate: message.lastPendingMessageDate,
                    receptorInfo // Información del usuario receptor
                };
            }));
    
            return {
                success: true,
                message: 'Se han obtenido los chats correctamente.',
                data: {
                    readChats, // Chats leídos
                    pendingChats // Chats no leídos
                }
            };
        } catch (e) {
            console.log(e);
            throw new Error('Error al obtener los chats.');
        }
    };

    static getChatsGroupedByReceiver = async (userId) => {
        try {
            // Obtener todos los mensajes donde el emisor es el userId
            const messages = await models.Mensaje.findAll({
                where: {
                    emisor: userId,
                },
                include: [
                    {
                        model: models.Usuario,
                        as: 'receptorUsuario', // Usar el alias correcto para el receptor
                        attributes: ['id', 'nickname', 'foto_perfil']
                    }
                ],
                order: [['createdAt', 'DESC']], // Ordenar por createdAt descendente
                raw: true
            });
    
            // Agrupar mensajes por receptor
            const groupedChats = messages.reduce((acc, message) => {
                const receptorId = message['receptorUsuario.id']; // ID del receptor
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
    
            // Convertir el objeto agrupado en un array
            const result = Object.values(groupedChats);
    
            return {
                success: true,
                message: 'Se han obtenido los chats agrupados correctamente.',
                data: result // Retorna la lista de chats agrupados
            };
        } catch (e) {
            console.log(e);
            throw new Error('Error al obtener los chats agrupados.');
        }
    };
}

module.exports = Message;