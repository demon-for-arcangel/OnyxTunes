const nodemailer = require('nodemailer');
const { generarJWT, verifyToken, revokeToken } = require("../../helpers/jwt");
const bcrypt = require('bcrypt');
const { Usuario } = require('../../models');

/**
 * NO IMPLEMENTADO
 * Controlador de los emails
 */
let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        usuario: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
})

const sendMail = async (mailOptions, res) => {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
           res.status(203).json({'msg': 'Correo NO enviado'})
        } else {
           res.status(200).json({'msg': 'Correo enviado'})
        }
    })
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'El email es necesario' });
    }
    try {
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const resetToken = generarJWT({ id: user.id }, ['resetPassword']);

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Restablecer Contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: \n\n http://localhost:4200/reset/${resetToken}\n\n Si no solicitaste este restablecimeinto, por favor ignora este correo.`
        };

        await sendMail(mailOptions, res);
    } catch (error) {
        console.error('Error al buscar el usuario: ', error);
        if (!res.headersSent) {
            return res.status(500).json({ msg: 'Error del servidor' });
        }
    }
}

const resetPassword = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = req.params.token;

    if (!token) {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    const { newPassword } = req.body;

    try {
        const decoded = verifyToken(token);
        const userId = decoded.uid.id;

        const user = await Usuario.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        revokeToken(token);
        res.status(200).json({ msg: 'Contraseña restablecida con éxito' });
    } catch (error) {
        res.status(400).json({ msg: 'Error al restablecer la contraseña' });
    }
}

module.exports = {
    requestPasswordReset,
    resetPassword,
    sendMail
}