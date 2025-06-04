const { response, request } = require("express");
const Conexion = require("../../database/user/UserConnection");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../../helpers/jwt");
const nodemailer = require('nodemailer');

const conx = new Conexion();

/**
 * Controlador para la autenticacion de usuarios
 * 
 * @function register Registro de un usuario
 * @function registerByAdmin Registro de un usuario por un administrador
 * @function login Login de un usuario
 */
const register = async (req, res) => {
    const body = req.body;

    try {
        const existingUser = await conx.getUserByEmail(body.email);
        if (existingUser) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        const newUser = await conx.registerUser({
            nombre: body.nombre,
            email: body.email,
            password: body.password,
            fecha_nacimiento: body.fecha_nacimiento,
            direccion: body.direccion,
            telefono: body.telefono,
            genero: body.genero,
            activo: 1,
            rol: 3
        });

        await conx.createDefaultPlaylist(newUser.id);

        const token = await generarJWT(newUser.id);

        res.status(201).json({
            nombre: newUser.nombre,
            email: newUser.email,
            fecha_nacimiento: newUser.fecha_nacimiento,
            direccion: newUser.direccion,
            telefono: newUser.telefono,
            genero: newUser.genero,
            activo: newUser.activo,
            rol: newUser.rol,
            token
        });

    } catch (err) {
        console.error("Error al registrar el usuario:", err);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};

const registerByAdmin = async (req, res) => {
    const body = req.body;

    try {
        const existingUser = await conx.getUserByEmail(body.email);
        if (existingUser) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        const newUser = await conx.registerUser({
            nombre: body.nombre,
            email: body.email,
            password: body.password,
            fecha_nacimiento: body.fecha_nacimiento,
            direccion: body.direccion,
            telefono: body.telefono,
            genero: body.genero,
            activo: body.activo, 
            rol: body.rol 
        });

        await conx.createDefaultPlaylist(newUser.id);

        res.status(201).json({
            nombre: newUser.nombre,
            email: newUser.email,
            fecha_nacimiento: newUser.fecha_nacimiento,
            direccion: newUser.direccion,
            telefono: newUser.telefono,
            genero: newUser.genero,
            activo: newUser.activo,
            rol: newUser.rol
        });

    } catch (err) {
        console.error("Error al registrar el usuario por el administrador:", err);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};

const login = async (req, res) => {
    let email = req.body.email;
    let storedHash = "";
    try {
        let searchUser = await conx.getUserByEmail(email);
        storedHash = searchUser.password;
        let isPasswordValid = await bcrypt.compare(req.body.password, storedHash);
        
        if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta");
        }

        let token = await generarJWT(searchUser.id);
        res.status(200).json({ token });
    } catch (err) {
        res.status(401).json({ msg: "Credenciales inválidas" });
    }
};

module.exports = {
  register, login, registerByAdmin
};