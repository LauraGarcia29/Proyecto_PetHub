const Appointment = require('../models/appointment');
const moment = require('moment'); // ✅ Necesitamos moment.js para manejar fechas

exports.createAppointment = (req, res) => {
    const { DATE, TYPE, PET_ID, SPECIALIST_ID } = req.body;
    const { ID } = req.session.user; // ID del usuario autenticado

    const appointmentDate = moment(DATE); // 📌 Convertir la fecha a un objeto moment.js
    const dayOfWeek = appointmentDate.day(); // 📌 Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const hour = appointmentDate.hour(); // 📌 Obtener la hora de la cita

    console.log("🔍 Día de la semana:", dayOfWeek, "Hora:", hour); // 🔍 Depuración

    // 📌 Verificar que la cita sea en horarios permitidos
    if (
        (dayOfWeek >= 1 && dayOfWeek <= 5 && (hour < 8 || hour > 17)) || // Lunes a viernes de 8 AM a 5 PM
        (dayOfWeek === 6 && (hour < 9 || hour > 13)) // Sábados de 9 AM a 1 PM
    ) {
        return res.status(400).json({ error: "Las citas solo pueden agendarse de lunes a viernes de 8 AM a 5 PM y sábados de 9 AM a 1 PM." });
    }

    // 📌 Verificar si ya existe una cita con el mismo especialista y misma fecha/hora
    connection.query(
        'SELECT COUNT(*) AS count FROM appointments WHERE SPECIALIST_ID = ? AND DATE = ? AND is_deleted = FALSE',
        [SPECIALIST_ID, DATE],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result[0].count > 0) {
                return res.status(400).json({ error: "El especialista ya tiene una cita programada a esta hora." });
            }

            // 📌 Si no hay conflictos, proceder con la inserción
            connection.query(
                'INSERT INTO appointments (DATE, TYPE, PET_ID, USER_ID, SPECIALIST_ID) VALUES (?, ?, ?, ?, ?)',
                [DATE, TYPE, PET_ID, ID, SPECIALIST_ID],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({ message: "Cita creada correctamente", citaId: result.insertId });
                }
            );
        }
    );
};

exports.getAppointments = (req, res) => {
    Appointment.getAll((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
};

exports.getAppointmentById = (req, res) => {
    const { id } = req.params;

    Appointment.getById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json(result[0]);
    });
};

exports.getSpecialistAppointments = (req, res) => {
    console.log("📌 Usuario en sesión:", req.session.user); // 🔍 Verifica qué datos tiene la sesión

    const { ID, ROL } = req.session.user; // ✅ Ahora `ID` estará correctamente asignado

    if (ROL !== 'Specialist') {
        return res.status(403).json({ error: 'Acceso denegado: Solo especialistas pueden ver sus citas' });
    }

    console.log("📌 Buscando citas para SPECIALIST_ID:", ID); // 🔍 Confirma que el ID ahora tiene valor

    Appointment.getBySpecialistId(ID, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        console.log("📌 Resultados obtenidos:", result); // 🔍 Verifica qué devuelve la base de datos

        if (!result || result.length === 0) return res.status(404).json({ error: 'No hay citas asignadas' });

        return res.status(200).json({ citas: result }); // ✅ Asegura que la API devuelva las citas correctamente
    });
};

exports.softDeleteAppointment = (req, res) => {
    const appointmentId = req.params.id;

    connection.query(
        'UPDATE appointments SET is_deleted = TRUE WHERE ID = ?',
        [appointmentId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });

            return res.status(200).json({ message: 'Cita marcada como eliminada' });
        }
    );
};

exports.updateAppointment = (req, res) => {
    const { DATE, TYPE } = req.body;
    const { ID } = req.params;

    Appointment.getById(ID, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        Appointment.update(ID, DATE, TYPE, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Cita actualizada' });
        });
    });
};

exports.deleteAppointment = (req, res) => {
    const { id } = req.params;

    Appointment.getById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        Appointment.delete(id, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Cita eliminada correctamente' });
        });
    });
};

exports.getUserAppointments = (req, res) => {
    const { ID } = req.session.user;

    connection.query(
        'SELECT * FROM appointments WHERE USER_ID = ? AND is_deleted = FALSE',
        [ID],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ citas: result });
        }
    );
};

module.exports = {
    createAppointment: exports.createAppointment,
    getAppointments: exports.getAppointments,
    getAppointmentById: exports.getAppointmentById,
    updateAppointment: exports.updateAppointment,
    deleteAppointment: exports.deleteAppointment,
    getSpecialistAppointments: exports.getSpecialistAppointments
};

