const connection = require('../db');

exports.getUserAppointments = (req, res) => {
    const { ID } = req.session.user;

    connection.query(
        'SELECT * FROM appointments WHERE USER_ID = ? AND is_deleted = FALSE', // ✅ Filtra solo citas activas
        [ID],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!result.length) {
                return res.status(404).json({ error: 'No tienes citas activas' });
            }

            res.json({ citas: result });
        }
    );
};

exports.getUserPets = (req, res) => {
    const { ID } = req.session.user; // ✅ Obtener el ID del usuario autenticado

    console.log("📌 Buscando mascotas del usuario con ID:", ID);

    connection.query(
        'SELECT * FROM pets WHERE USER_ID = ?',
        [ID],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!result || result.length === 0) {
                return res.status(404).json({ error: 'No tienes mascotas registradas' });
            }

            res.status(200).json({ mascotas: result });
        }
    );
};
exports.softDeleteUser = (req, res) => {
    const userId = req.params.id;

    connection.query(
        'UPDATE users SET is_deleted = TRUE WHERE ID = ?',
        [userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

            return res.status(200).json({ message: 'Usuario marcado como eliminado' });
        }
    );
};

exports.getUserPets = (req, res) => {
    const { ID } = req.session.user;

    connection.query(
        'SELECT * FROM pets WHERE USER_ID = ? AND is_deleted = FALSE', // ✅ Filtra solo mascotas activas
        [ID],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!result.length) {
                return res.status(404).json({ error: 'No tienes mascotas registradas' });
            }

            res.json({ mascotas: result });
        }
    );
};

exports.getAllUsers = (req, res) => {
    connection.query(
        'SELECT ID, NAME, EMAIL, ROL FROM users WHERE is_deleted = FALSE', // ✅ Filtra solo usuarios activos
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!result.length) {
                return res.status(404).json({ error: 'No hay usuarios registrados' });
            }

            res.json({ usuarios: result });
        }
    );
};


exports.getSpecialists = async (req, res) => {
    try {
        const sql = 'SELECT ID, NAME, EMAIL FROM users WHERE ROL = "Specialist" AND is_deleted = FALSE';
        
        // 📌 Usamos Promises para evitar bloqueos y manejar errores mejor
        const [results] = await connection.promise().query(sql);

        if (!results.length) {
            return res.status(404).json({ error: 'No hay especialistas registrados' });
        }

        res.status(200).json({ specialists: results });
    } catch (error) {
        console.error('❌ Error al obtener especialistas:', error);
        res.status(500).json({ error: 'Error interno al obtener especialistas.' });
    }
};