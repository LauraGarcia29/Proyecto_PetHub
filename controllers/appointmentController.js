const { QueryTypes } = require('sequelize');
const Appointment = require('../models/appointment');
const sequelize = require('../db'); // Importa la conexión a la base de datos
const moment = require('moment'); //  Necesario para manejar fechas

// 📅 Crear una cita
exports.createAppointment = async (req, res) => {
  try {
    const { DATE, TYPE, PET_ID, SPECIALIST_ID } = req.body;
    const { ID } = req.session.user; // ID del usuario autenticado

    // 📅 Convertir la fecha a formato manejable y validar horario
    const appointmentDate = moment(DATE);
    const dayOfWeek = appointmentDate.day();
    const hour = appointmentDate.hour();

    console.log("🔍 Día de la semana:", dayOfWeek, "Hora:", hour); // 🔍 Depuración

    // 📅 Verificación de horarios permitidos
    if ((dayOfWeek >= 1 && dayOfWeek <= 5 && (hour < 8 || hour > 17)) || 
        (dayOfWeek === 6 && (hour < 9 || hour > 13))) {
      console.warn("⚠️ Intento de cita fuera de horario:", DATE);
      return res.status(400).json({ error: "Las citas solo pueden agendarse en horarios permitidos." });
    }

    // 📅 Verificación de disponibilidad del especialista
    const existingAppointment = await Appointment.findOne({
      where: { SPECIALIST_ID, DATE, is_deleted: false }
    });

    if (existingAppointment) {
      console.warn("⚠️ Intento de cita duplicada con el especialista:", SPECIALIST_ID, "Fecha:", DATE);
      return res.status(400).json({ error: "El especialista ya tiene una cita programada en este horario." });
    }

    const newAppointment = await Appointment.create({ DATE, TYPE, PET_ID, SPECIALIST_ID, USER_ID: ID });
    res.status(201).json({ message: 'Cita creada correctamente', id: newAppointment.ID });

  } catch (error) {
    console.error('❌ Error al crear la cita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Obtener todas las citas
exports.getAppointments = async (req, res) => {
  try {
    const citas = await Appointment.findAll({ where: { is_deleted: false } });
    res.json(citas);
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Obtener una cita por ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Appointment.findOne({ where: { ID: id, is_deleted: false } });

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(cita);
  } catch (error) {
    console.error('❌ Error al obtener la cita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Obtener citas de un especialista
exports.getSpecialistAppointments = async (req, res) => {
  try {
    const { ID, ROL } = req.session.user;

    if (ROL !== 'Specialist') {
      return res.status(403).json({ error: 'Acceso denegado: Solo especialistas pueden ver sus citas' });
    }

    const citas = await Appointment.findAll({ where: { SPECIALIST_ID: ID, is_deleted: false } });

    if (!citas.length) {
      return res.status(404).json({ error: 'No hay citas asignadas' });
    }

    res.json({ citas });

  } catch (error) {
    console.error('❌ Error al obtener citas del especialista:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Soft delete de una cita
exports.softDeleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Appointment.findByPk(id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await cita.update({ is_deleted: true });
    res.status(200).json({ message: 'Cita marcada como eliminada' });

  } catch (error) {
    console.error('❌ Error al eliminar cita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Actualizar una cita
exports.updateAppointment = async (req, res) => {
  try {
    const { DATE, TYPE } = req.body;
    const { id } = req.params;

    const cita = await Appointment.findByPk(id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await cita.update({ DATE, TYPE });
    res.json({ message: 'Cita actualizada correctamente' });

  } catch (error) {
    console.error('❌ Error al actualizar cita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Eliminar una cita de la base de datos
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Appointment.findByPk(id);

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await cita.destroy();
    res.json({ message: 'Cita eliminada correctamente' });

  } catch (error) {
    console.error('❌ Error al eliminar cita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 Obtener citas de un usuario
exports.getUserAppointments = async (req, res) => {
  try {
    const { ID } = req.session.user;
    const citas = await Appointment.findAll({ where: { USER_ID: ID, is_deleted: false } });

    res.json({ citas });

  } catch (error) {
    console.error('❌ Error al obtener citas del usuario:', error);
    res.status(500).json({ error: error.message });
  }
};