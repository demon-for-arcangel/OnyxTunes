const { faker } = require('@faker-js/faker');
const ConexionUser = require("../database/user/UserConnection");
const ConexionRol = require("../database/RolConnection")

const usuarioRolFactory = async (num_gen) => {
    const conxU = new ConexionUser();
    const conxR = new ConexionRol();
    let arrUserRols = [];
    const users = await conxU.indexUser();
    const rols = await conxR.indexRols();

    for (let i = 0; i < num_gen; i++) {
        let randUserNum = Math.floor(Math.random() * users.length);
        let randRolNum = Math.floor(Math.random() * rols.length);

        let userId = users[randUserNum].id;
        let rolId = rols[randRolNum].id;

        if (userId && rolId) {
            const fakeUserRol = {
                usuario_id: userId,
                rol_id: rolId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            arrUserRols.push(fakeUserRol);
        }
    }
    return Promise.all(arrUserRols);
};

module.exports = {
    usuarioRolFactory
};