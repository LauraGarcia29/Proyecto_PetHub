const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importa la instancia de Sequelize

// 📩 Definimos el modelo User con Sequelize
const User = sequelize.define('User', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    PASSWORD: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ROL: {
        type: DataTypes.ENUM('Admin', 'User', 'Specialist'), // Coincide con la base de datos MySQL
        allowNull: false,
        defaultValue: 'User'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: false // Activa `createdAt` y `updatedAt` automáticamente
});

module.exports = User;