const { response, request } = require("express");
const Conexion = require("../../database/user/UserConnection");
const bcrypt = require("bcrypt");
/* const { generateRandPass } = require("../../helpers/generatePass");
 */const models = require('../../models');
/* const nodemailer = require('nodemailer');
 *//* const jwt = require('jsonwebtoken'); */

const conx = new Conexion();

const index = async (req, res) => {}

const getUserById = async (req, res) => {}

const getUserByEmail = async (req, res) => {}

const sendMail = async (mailOptions) => {}

const registerUserByAdmin = async (req, res) => {}

const updateUser = async (req, res) => {}

const deleteUsers = async (req, res) => {}

const getUserByToken = async (req, res) => {}

const searchUsers = async (req, res) => {}

module.exports = {
    index, getUserById, getUserByEmail, sendMail, registerUserByAdmin, updateUser, deleteUsers, 
    getUserByToken, searchUsers
}