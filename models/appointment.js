const { DataTypes } = require('sequelize');
const sequelize = require('../db');  // Importa la conexión a la base de datos

//📩 Definimos el modelo Appointment con Sequelize
const Appointment = sequelize.define('Appointment', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DATE: { 
        type: DataTypes.DATE,
        allowNull: false
    },
    TYPE: {
        type: DataTypes.ENUM('consulta', 'vacunación', 'baño', 'otro'),
        allowNull: false
    },
    PET_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pets',
            key: 'ID'
        }
    },
    USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'ID'
        }
    },
    SPECIALIST_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'ID'
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'appointments',
    timestamps: false // ✅ Activa `CREATED_AT` y `UPDATED_AT`
});

// 📩 Importamos modelos relacionados
const User = require('./user');
const Pet = require('./pet');

// 📩 Definimos relaciones correctamente
Appointment.belongsTo(User, { foreignKey: 'USER_ID' });
Appointment.belongsTo(Pet, { foreignKey: 'PET_ID' });
Appointment.belongsTo(User, { foreignKey: 'SPECIALIST_ID', as: 'Specialist' });

User.hasMany(Appointment, { foreignKey: 'USER_ID' });
User.hasMany(Appointment, { foreignKey: 'SPECIALIST_ID', as: 'SpecialistAppointments' });
Pet.hasMany(Appointment, { foreignKey: 'PET_ID' });

module.exports = Appointment;