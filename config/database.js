const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('PetHub', 'root', '1234567890', { 
    host: 'localhost', // Usa 'mysql' si hay problemas en Docker
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;