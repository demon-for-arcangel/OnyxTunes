const { validationResult } = require('express-validator');

/**
 * Middleware de validacion de campos
 * @function validateFilds Middleware de validacion de campos
 * @function validateTLF Middleware de validacion de telefono
 */
const validateFilds = ( req, res, next ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next();
}

function validateTLF(phoneNumber) {
    const tlfRegex = /^\d{9}$/;
   
    return new Promise((resolve, reject)=>{
        if(tlfRegex.test(phoneNumber)){
            resolve(true)
        }else{
            reject(false)
        }
    })
}

module.exports = {
    validateFilds,
    validateTLF
}