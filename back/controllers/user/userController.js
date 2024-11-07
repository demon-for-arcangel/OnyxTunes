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

const getUserById = async (req, res) => {}

const getUserByEmail = async (req, res) => {}

const sendMail = async (mailOptions) => {}

const registerUserByAdmin = async (req, res) => {}

const updateUser = async (req, res) => {}

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
    index, indexArtist, getUserById, getUserByEmail, sendMail, registerUserByAdmin, updateUser, deleteUsers, 
    getUserByToken, searchUsers
}