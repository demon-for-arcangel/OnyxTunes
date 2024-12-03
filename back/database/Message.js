const models = require('../models/index');
const { Op } = require("sequelize");

class Message {
    static findRecentChatMessages = async (emitter, receiver) => {
        try {
            console.log(emitter, receiver);

            const emitterUser = await models.User.findOne({
                where: { id: emitter },
                attributes: ['id', 'email', 'nickname', 'pic_url', 'connected']
            });
            const receiverUser = await models.User.findOne({
                where: { id: receiver },
                attributes: ['id', 'email', 'nickname', 'pic_url', 'connected']
            });

            const messages = await models.Message.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { emitter: emitter, receiver: receiver },
                                { emitter: receiver, receiver: emitter },
                            ]
                        },
                    ]
                },
                include: {
                    model: models.Asset,
                    as: 'files',
                    attributes: ['file_link']
                },
                order: [
                    ['created_at', 'ASC'],
                ]
            });

            console.log(messages);

            return {
                success: true,
                message: 'Se han obtenido los mensajes correctamente.',
                data: { emitterUser, receiverUser, messages }
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error al obtener los mensajes.');
        }
    };

    static pushMessage = async (emitter, receiver, text) => {
        try {
            const data = {
                emitter,
                receiver,
                text,
                read: false,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const query = await models.Message.create(data);
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
                created_at: new Date(),
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

    static getUnreadedMessages = async (emitter, receiver) => {
        try {
            const messages = await models.Message.findAll({
                where: {
                    [Op.and]: [
                        { emitter: emitter },
                        { receiver: receiver },
                        { read: false }
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
            const query = await models.Message.update({ read: true }, { where: { id } });

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
            const usersWithPendingMessages = await models.Message.findAll({
                where: {
                    receiver: userId,
                    read: false,
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'emitter',
                ],
                group: ['emitter'],
                raw: true
            });

            const users = await models.User.findAll({
                where: {
                    id: {
                        [Op.in]: (usersWithPendingMessages.map(message => message.emitter))
                    }
                },
                raw: true
            });

            users.forEach(user => {
                const userPending = usersWithPendingMessages.find(message => message.emitter === user.id);
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
            const usersWithPendingMessages = await models.Message.findAll({
                where: {
                    receiver: userId,
                    read: false,
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'emitter',
                ],
                group: ['emitter'],
                order: [['created_at', 'DESC']],
                raw: true
            });

            const usersWithReadMessages = await models.Message.findAll({
                where: {
                    receiver: userId,
                    emitter: {
                        [Op.and]: [
                            { [Op.not]: userId },
                            { [Op.notIn]: usersWithPendingMessages.map(message => message.emitter) }
                        ]
                    },
                    read: true,
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'emitter',
                ],
                group: ['emitter'],
                order: [['created_at', 'ASC']],
                raw: true
            });

            const usersWhoSendMessages = await models.Message.findAll({
                where: {
                    emitter: userId,
                    receiver: {
                        [Op.and]: [
                            { [Op.not]: userId },
                            { [Op.notIn]: usersWithPendingMessages.map(message => message.emitter) }
                        ]
                    },
                },
                attributes: [
                    [models.sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
                    'receiver',
                ],
                group: ['receiver'],
                order: [['created_at', 'ASC']],
                raw: true
            });

            const users = await models.User.findAll({
                where: {
                    id: {
                        [Op.or]: [
                            {
                                [Op.in]: (usersWhoSendMessages.map(message => message.receiver))
                            },
                            {
                                [Op.in]: (usersWithReadMessages.map(message => message.emitter))
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