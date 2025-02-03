const { response, request } = require("express");
const Conexion = require("../../database/user/UserConnection");
const bcrypt = require("bcrypt");
/* const { generateRandPass } = require("../../helpers/generatePass");
 */const models = require('../../models');
/* const nodemailer = require('nodemailer');
 */const jwt = require('jsonwebtoken');

const conx = new Conexion();

/**
 * Controlador de Usuarios
 * @function index Obtener los usuarios
 * @function indexArtist Obtener los artistas
 * @function getUserById Obtener un usuario por su id
 * @function getUserByEmail Obtener un usuario por su email
 * @function sendMail Enviar un email
 * @function updateUser Actualizar un usuario
 * @function deleteUsers Eliminar usuarios
 * @function getUserByToken Obtener un usuario por su token
 * @function updatePassword Actualizar la contraseña de un usuario
 */
const index = async (req, res) => {
    try{
        const users = await conx.indexUser();
        res.status(200).json(users);
    }catch (error){
        console.error('Error al obtener usuarios', error);
        res.status(500).json({ msg: "Error"});
    }
}

const indexArtist = async (req, res = response) => {
    try {
        const artists = await conx.indexArtist();
        res.status(200).json(artists);
    } catch (error) {
        console.error('Error al obtener artistas', error);
        res.status(500).json({ msg: "Error al obtener la lista de artistas" });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await conx.getUserById(userId); 

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ msg: "Error al obtener el usuario" }); 
    }
};

const getUserByEmail = async (req, res) => {
    const email = req.query.email;

    try {
        const user = await conx.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ msg: "Usuario no encontrado" });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ msg: "Error al obtener el usuario" });
    }
};

const sendMail = async (mailOptions) => {} //por hacer

const updateUser = async (req, res) => {
    const userId = req.params.id; 
    const { nombre, email, nickname, fecha_nacimiento, foto_perfil, direccion, telefono, genero, activo, rol } = req.body; 
    const files = req.files; 

    try {
        const existingUser = await conx.getUserById(userId);
        if (!existingUser) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const updatedData = {
            nombre: nombre || existingUser.nombre, 
            email: email || existingUser.email, 
            nickname: nickname || existingUser.nickname,
            fecha_nacimiento: fecha_nacimiento || existingUser.fecha_nacimiento,
            foto_perfil: foto_perfil,
            direccion: direccion || existingUser.direccion,
            telefono: telefono || existingUser.telefono,
            genero: genero || existingUser.genero,
            activo: activo || existingUser.activo,
            rol: rol || existingUser.rol 
        };

        const updatedUser = await conx.updateUser(userId, updatedData, files);

        res.status(200).json({ msg: "Usuario actualizado exitosamente", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar usuario", error);
        res.status(500).json({ msg: "Error al actualizar usuario" });
    }
};


const deleteUsers = async (req, res) => {
    const userIds = req.body.userIds;
   
    try {
       if (!Array.isArray(userIds) || userIds.length === 0) {
         return res.status(400).json({ msg: "No se proporcionaron IDs de usuario para eliminar." });
       }

       await conx.deleteUsers(userIds);
       
       res.status(200).json({ message: 'Eliminado correctamente' });
    } catch (error) {
       console.error('Error al eliminar los usuarios:', error);
       res.status(500).json({ msg: "Error al eliminar los usuarios" });
    }
};

const getUserByToken = async (req, res) => {
    const token = req.headers['x-token'];
    
    if (!token) {
    return res.status(400).json({ error: 'Token no proporcionado en el encabezado x-token' });
    }
    
    try {
    const decodedToken = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decodedToken.uid;
    
    const user = await conx.getUserById(userId);
    
    res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario por token:', error);
        res.status(500).json({ error: 'Error al obtener el usuario por token' });
    }
};

const updatePassword = async (req, res) => {
    const userId = req.params.id; 
    const { currentPassword, newPassword, confirmPassword } = req.body; 

    try {
        const result = await conx.updatePassword(userId, currentPassword, newPassword, confirmPassword);
        res.status(200).json(result); 
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(400).json({ error: error.message }); 
    }
};

module.exports = {
    index, indexArtist, getUserById, getUserByEmail, sendMail, updateUser, deleteUsers, 
    getUserByToken, updatePassword
}