const connection = require('../db'); // ✅ Importar la conexión a la base de datos
const Pet = require('../models/pet');

exports.createPet = (req, res) => {
  const { NAME, SPECIE, AGE, USER_ID } = req.body;

  if (!NAME|| !SPECIE || !AGE || !USER_ID) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  Pet.create(NAME, SPECIE, AGE, USER_ID, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Mascota registrada', id: result.insertId });
  });
};

exports.getPets = (req, res) => {
  Pet.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getPetById = (req, res) => {
  const { id } = req.params;

  Pet.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(result[0]);
  });
};

exports.softDeletePet = (req, res) => {
    const petId = req.params.id;

    connection.query(
        'UPDATE pets SET is_deleted = TRUE WHERE ID = ?',
        [petId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Mascota no encontrada' });

            return res.status(200).json({ message: 'Mascota marcada como eliminada' });
        }
    );
};

exports.updatePet = (req, res) => {
    const petId = req.params.id; // ✅ Extrae correctamente el ID de la mascota desde la URL
    const { NAME, SPECIE, AGE } = req.body;

    console.log("🔍 ID de la mascota recibido en UPDATE:", petId); // 🔍 Verifica que el ID es el correcto

    connection.query(
        'UPDATE pets SET NAME = ?, SPECIE = ?, AGE = ? WHERE ID = ?',
        [NAME, SPECIE, AGE, petId], // ✅ Usa `petId` en lugar de `req.session.user.ID`
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }

            return res.status(200).json({ message: 'Mascota actualizada correctamente' });
        }
    );
};



exports.deletePet = (req, res) => {
  const { ID } = req.params;
  
  console.log('🔍 ID recibido en DELETE:', ID); // 🔥 Verifica qué está recibiendo

  Pet.getById(ID, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result.length) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    Pet.delete(ID, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Mascota eliminada correctamente' });
    });
  });
};

exports.getUserPets = (req, res) => {
    const { ID } = req.session.user;

    connection.query(
        'SELECT * FROM pets WHERE USER_ID = ? AND is_deleted = FALSE',
        [ID],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mascotas: result });
        }
    );
};