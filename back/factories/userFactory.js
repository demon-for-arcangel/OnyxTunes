const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");

/**
 * Factory de Usuario
 * @function userFactory Crear usuarios
 */
const userFactory = async (num_gen) => {
    let i = 0;
    let arrUsers = [];
    while (i < num_gen) {
        let newUser = {
            nombre: faker.person.firstName(),
            email: faker.internet.email(),
            password: await bcrypt.hash("1234", 10),
            fecha_nacimiento: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            foto_perfil: faker.image.avatar(),
            direccion: faker.location.streetAddress(),
            telefono: faker.phone.number('+34 91 ### ## ##'),
            rol: faker.helpers.arrayElement([1, 2, 3]),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        arrUsers.push(newUser);
        i++;
    }
    return arrUsers;
};

module.exports = { 
    userFactory
};
