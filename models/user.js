const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    ID: { type: DataTypes.INTEGER, primaryKey: true, field: 'ID' }, 
    NAME: { type: DataTypes.STRING, allowNull: false },
    EMAIL: { type: DataTypes.STRING, allowNull: false, unique: true },
    PASSWORD: { type: DataTypes.STRING, allowNull: false },
    ROL: { 
        type: DataTypes.ENUM('ADMIN', 'USER', 'SPECIALIST'), 
        allowNull: false, 
        defaultValue: 'USER' // 📌 Esto asignará "USER" por defecto si el usuario no ingresa nada
    }
}, { 
    tableName: 'users',
    timestamps: false 
});

module.exports = User;