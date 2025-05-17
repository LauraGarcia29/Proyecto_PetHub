const { DataTypes } = require('sequelize');
const sequelize = require('../db');   // Importa la conexión a la base de datos

// 📩 Definimos el modelo Pet con Sequelize
const Pet = sequelize.define('Pet', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SPECIE: { // Cambio de SPECIE a SPECIE para coincidir con la base de datos
        type: DataTypes.ENUM('perro', 'gato', 'ave', 'otro'),
        allowNull: false
    },
    AGE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 } // Evita edades negativas
    },
    USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: 'users', // Vincula correctamente con la tabla de usuarios
            key: 'ID'
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'pets',
    timestamps: false // Activa `createdAt` y `updatedAt` automáticamente
});

// 📩 Importamos modelos relacionados
const User = require('./user');

// 📩 Definimos relaciones con el modelo User
Pet.belongsTo(User, { foreignKey: 'USER_ID', onDelete: 'CASCADE' }); 
User.hasMany(Pet, { foreignKey: 'USER_ID' });

module.exports = Pet;