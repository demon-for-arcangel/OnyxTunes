const { response, request } = require("express");
const Conexion = require("../../database/user/UserConnection");
const bcrypt = require("bcrypt");
/* const { generateRandPass } = require("../../helpers/generatePass");
 */const models = require('../../models');
/* const nodemailer = require('nodemailer');
 */const jwt = require('jsonwebtoken');

const conx = new Conexion();

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

const getUserById = async (req, res) => {} //por hacer

const getUserByEmail = async (req, res) => {
    const email = req.query;

    try {
        const user = await conx.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ msg: "Usuario no encontrado" }) 
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener usuario por email", error);
        res.status(500).json({ msg: "Error al obtener usuario por email" });
    }
}

const sendMail = async (mailOptions) => {} //por hacer

const registerUserByAdmin = async (req, res) => {} //por hacer

const createUser = async (req, res) => {
    const { nombre, email, password, roles } = req.body; 

    try {
        const existingUser = await conx.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ msg: "El correo ya está en uso" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await conx.createUser(nombre, email, hashedPassword);

        if (roles && roles.length > 0) {
            await conx.createUserRols(newUser.id, roles); 
        }

        res.status(201).json({ msg: "Usuario creado exitosamente", user: newUser });
    } catch (error) {
        console.error("Error al crear usuario", error);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id; 
    const { nombre, email, password, roles } = req.body; 

    try {
        const existingUser = await conx.getUserById(userId);
        if (!existingUser) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updatedData = {
            nombre: nombre || existingUser.nombre, 
            email: email || existingUser.email, 
            password: hashedPassword || existingUser.password 
        };

        const updatedUser = await conx.updateUser(userId, updatedData);

        if (roles && roles.length > 0) {
            await conx.createUserRols(userId, roles);
        }

        res.status(200).json({ msg: "Usuario actualizado exitosamente", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar usuario", error);
        res.status(500).json({ msg: "Error al actualizar usuario" });
    }
};

const deleteUsers = async (req, res) => {}

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

const searchUsers = async (req, res) => {}

module.exports = {
    index, indexArtist, getUserById, getUserByEmail, createUser, sendMail, /* registerUserByAdmin, */ updateUser, deleteUsers, 
    getUserByToken, searchUsers
}