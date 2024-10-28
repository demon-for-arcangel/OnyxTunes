const { validationResult } = require('express-validator');

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