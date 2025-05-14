const connection = require('../db');

const Appointment = {
    create: (DATE, TYPE, PET_ID, USER_ID, SPECIALIST_ID, callback) => {
        connection.query(
            'INSERT INTO appointments (DATE, TYPE, PET_ID, USER_ID, SPECIALIST_ID) VALUES (?, ?, ?, ?, ?)',
            [DATE, TYPE, PET_ID, USER_ID, SPECIALIST_ID],
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        );
    },

   getBySpecialistId: (SPECIALIST_ID, callback) => {
    console.log("Consultando citas para SPECIALIST_ID:", SPECIALIST_ID); // 🔍 Verifica el ID antes de ejecutar la consulta

    connection.query(
        'SELECT * FROM appointments WHERE SPECIALIST_ID = ?', 
        [SPECIALIST_ID], 
        (err, result) => {
            if (err) return callback(err, null);
            console.log("Resultados obtenidos:", result); // 🔍 Muestra lo que devuelve la BD
            callback(null, result);
        }
    );
},


    getAll: (callback) => {
        connection.query('SELECT * FROM appointments', (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },

    getById: (ID, callback) => {
        connection.query('SELECT * FROM appointments WHERE ID = ?', [ID], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },

    update: (ID, DATE, TYPE, callback) => {
        connection.query(
            'UPDATE appointments SET DATE = ?, TYPE = ? WHERE ID = ?',
            [DATE, TYPE, ID],
            (err) => {
                if (err) return callback(err);
                callback(null);
            }
        );
    },

    delete: (ID, callback) => {
        connection.query('DELETE FROM appointments WHERE ID = ?', [ID], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    }
};

module.exports = Appointment;