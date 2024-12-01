const jwt = require('jsonwebtoken')

const generarJWT = (uid = '') => {
    return jwt.sign({uid}, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '6h'
    });
}

let blacklistedTokens = [];

const revokeToken = (token) => {
    blacklistedTokens.push(token);
}

const verifyTokenRevoke = (token) => {
    if (blacklistedTokens.includes(token)) {
        throw new Error('Token has been revoked');
    }else{
        return 1
    }
}

const verifyToken = (token) => {
    if (blacklistedTokens.includes(token)) {
        throw new Error('Token has been revoked');
    } else {
        try {
            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            return decoded; 
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

module.exports ={
    generarJWT,
    revokeToken,
    verifyTokenRevoke,
    verifyToken
}