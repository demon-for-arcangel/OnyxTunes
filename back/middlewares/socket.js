const {verifyToken} = require("../helpers/jwt");
const {tokenTypes} = require("../constants/common.constants");

/**
 * Middleware de autenticacion de socket
 * @function authMiddleware Middleware de autenticacion de socket
 */
const authMiddleware = (socket, next) => {
    const token = socket.handshake.headers.token;

    if (token === null) throw new Error('Unauthorized')

    const {userId, type} = verifyToken(token);

    if (!type || type !== tokenTypes.socket) throw new Error('Invalid token.')
    if (!userId) throw new Error('Unauthorized')

    socket.user = {userId} 

    next();
};

module.exports = {
    authMiddleware
}