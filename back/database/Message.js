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

    static getPendingChats = async (userId) => {
        try {
            const usersWithPendingMessages = await models.Mensaje.findAll({
                where: {
                    receptor: userId,
                    leido: false,
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'emisor',
                ],
                group: ['emisor'],
                raw: true
            });

            const users = await models.Usuario.findAll({
                where: {
                    id: {
                        [Op.in]: (usersWithPendingMessages.map(message => message.emisor))
                    }
                },
                raw: true
            });

            users.forEach(user => {
                const userPending = usersWithPendingMessages.find(message => message.emisor === user.id);
                user.pendingCount = userPending.count;
            });

            if (!users) throw new Error('El usuario indicado no existe.');

            return {
                success: true,
                message: 'Se han obtenido los chats correctamente.',
                data: users
            };
        } catch (e) {
            console.log(e);
            throw new Error('Error al obtener los chats pendientes.');
        }
    };

    static getNotPendingChats = async (userId) => {
        try {
            const usersWithPendingMessages = await models.Mensaje.findAll({
                where: {
                    receptor: userId,
                    leido: false,
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'emisor',
                ],
                group: ['emisor'],
                raw: true
            });

            const usersWithReadMessages = await models.Mensaje.findAll({
                where: {
                    receptor: userId,
                    emisor: {
                        [Op.and]: [
                            { [Op.not]: userId },
                            { [Op.notIn]: usersWithPendingMessages.map(message => message.emisor) }
                        ]
                    },
                    leido: true,
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'emisor',
                ],
                group: ['emisor'],
                raw: true
            });

            const usersWhoSendMessages = await models.Mensaje.findAll({
                where: {
                    emisor: userId,
                    receptor: {
                        [Op.and]: [
                            { [Op.not]: userId },
                            { [Op.notIn]: usersWithPendingMessages.map(message => message.emisor) }
                        ]
                    },
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'receptor',
                ],
                group: ['receptor'],
                raw: true
            });

            const users = await models.Usuario.findAll({
                where: {
                    id: {
                        [Op.or]: [
                            {
                                [Op.in]: (usersWhoSendMessages.map(message => message.receptor))
                            },
                            {
                                [Op.in]: (usersWithReadMessages.map(message => message.emisor))
                            },
                        ]
                    }
                },
                raw: true
            });

            if (!users) throw new Error('El usuario indicado no existe.');

            return {
                success: true,
                message: 'Se han obtenido los usuarios correctamente.',
                data: users
            };
        } catch (e) {
            console.log(e);
            throw new Error('Error al obtener los usuarios no pendientes.');
        }
    }
}

module.exports = Message;