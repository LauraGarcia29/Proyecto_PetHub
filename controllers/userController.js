const User = require('../models/user');
const Pet = require('../models/pet');
const Appointment = require('../models/appointment');

// 👩🏻‍🦰 Obtener citas del usuario autenticado
exports.getUserAppointments = async (req, res) => {
  try {
    const { ID } = req.session.user;
    const citas = await Appointment.findAll({ where: { USER_ID: ID, is_deleted: false } });

    if (!citas.length) {
      return res.status(404).json({ error: 'No tienes citas activas' });
    }

    res.json({ citas });
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    res.status(500).json({ error: error.message });
  }
};

// 👩🏻‍🦰 Obtener mascotas del usuario autenticado
exports.getUserPets = async (req, res) => {
  try {
    const { ID } = req.session.user;
    const mascotas = await Pet.findAll({ where: { USER_ID: ID, is_deleted: false } });

    if (!mascotas.length) {
      return res.status(404).json({ error: 'No tienes mascotas registradas' });
    }

    res.json({ mascotas });
  } catch (error) {
    console.error('❌ Error al obtener mascotas:', error);
    res.status(500).json({ error: error.message });
  }
};
// 👩🏻‍🦰 Marcar usuario como eliminado (Soft Delete)
exports.softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.update({ is_deleted: true });
    res.status(200).json({ message: 'Usuario marcado como eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// 👩🏻‍🦰 Obtener todos los usuarios activos
exports.getAllUsers = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      where: { is_deleted: false },
      attributes: ['ID', 'NAME', 'EMAIL', 'ROL']
    });

    if (!usuarios.length) {
      return res.status(404).json({ error: 'No hay usuarios registrados' });
    }

    res.json({ usuarios });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  }
};

// 👩🏻‍🦰 Obtener especialistas activos
exports.getSpecialists = async (req, res) => {
  try {
    const especialistas = await User.findAll({
      where: { ROL: 'Specialist', is_deleted: false },
      attributes: ['ID', 'NAME', 'EMAIL']
    });

    if (!especialistas.length) {
      return res.status(404).json({ error: 'No hay especialistas registrados' });
    }

    res.status(200).json({ specialists: especialistas });
  } catch (error) {
    console.error('❌ Error al obtener especialistas:', error);
    res.status(500).json({ error: 'Error interno al obtener especialistas.' });
  }
};