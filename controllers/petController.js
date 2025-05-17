const Pet = require('../models/pet');
const sequelize = require('../db'); //Importa la conexión a la base de datos

// 🐶 Crear una mascota
exports.createPet = async (req, res) => {
  try {
    const { NAME, SPECIE, AGE, USER_ID } = req.body; 
    if (!NAME || !SPECIE || !AGE || !USER_ID) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevaMascota = await Pet.create({ NAME, SPECIE, AGE, USER_ID });
    res.status(201).json({ message: 'Mascota registrada', id: nuevaMascota.ID });
  } catch (error) {
    console.error('❌ Error al crear la mascota:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🐶 Obtener todas las mascotas
exports.getPets = async (req, res) => {
  try {
    const mascotas = await Pet.findAll({ where: { is_deleted: false } });
    res.json(mascotas);
  } catch (error) {
    console.error('❌ Error al obtener mascotas:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🐶 Obtener una mascota por ID
exports.getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Pet.findOne({ where: { ID: id, is_deleted: false } });

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    res.json(mascota);
  } catch (error) {
    console.error('❌ Error al obtener la mascota:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🐶 Actualizar una mascota
exports.updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { NAME, SPECIE, AGE } = req.body;

    const mascota = await Pet.findOne({ where: { ID: id, is_deleted: false } });
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    await mascota.update({ NAME, SPECIE, AGE });
    res.status(200).json({ message: 'Mascota actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar mascota:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🐶 Soft delete de una mascota
exports.softDeletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Pet.findByPk(id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    await mascota.update({ is_deleted: true });
    res.status(200).json({ message: 'Mascota marcada como eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar mascota:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🐶 Eliminar una mascota de la base de datos
exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Pet.findByPk(id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    await mascota.destroy();
    res.status(200).json({ message: 'Mascota eliminada permanentemente' });
  } catch (error) {
    console.error('❌ Error al eliminar mascota:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🐶 Obtener todas las mascotas de un usuario
exports.getUserPets = async (req, res) => {
  try {
    const userId = req.params.userId || req.session.user?.ID;

    if (!userId) {
      return res.status(400).json({ error: 'El ID de usuario es requerido' });
    }

    const mascotas = await Pet.findAll({ where: { USER_ID: userId, is_deleted: false } });

    res.json({ mascotas });
  } catch (error) {
    console.error('❌ Error al obtener mascotas del usuario:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};