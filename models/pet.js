const connection = require('../db');
const Pet = {
  create: (NAME, SPECIE, AGE, USER_ID, callback) => {
    connection.query(
      'INSERT INTO pets (NAME, SPECIE, AGE, USER_ID) VALUES (?, ?, ?, ?)',
      [NAME, SPECIE, AGE, USER_ID],
      callback
    );
  },

  getAll: (callback) => {
    connection.query('SELECT * FROM pets', callback);
  },

  getById: (ID, callback) => {
    connection.query('SELECT * FROM pets WHERE ID = ?', [ID], callback);
  },

  update: (ID, NAME, SPECIE, AGE, callback) => {
    connection.query(
      'UPDATE pets SET NAME = ?, SPECIE = ?, AGE = ? WHERE ID = ?',
      [NAME, SPECIE, AGE, ID],
      callback
    );
  },

  delete: (ID, callback) => {
    connection.query('DELETE FROM pets WHERE ID = ?', [ID], callback);
  },
};

module.exports = Pet;