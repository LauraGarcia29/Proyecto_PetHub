const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const petController = require('../controllers/petController'); 
const router = express.Router();

// 🐶 Ruta para crear una mascota (Admin y Usuario)
router.post('/pets', verifyToken, checkRole(['Admin', 'User']), petController.createPet);

// 🐶 Ruta para obtener todas las mascotas (Solo Admin)
router.get('/pets', verifyToken, checkRole(['Admin']), petController.getPets);

// 🐶 Ruta para obtener una mascota específica (Admin y Usuario)
router.get('/pets/:id', verifyToken, checkRole(['Admin', 'User']), petController.getPetById);

// 🐶 Ruta para actualizar una mascota (Admin y Especialista)
router.put('/pets/:id', verifyToken, checkRole(['Admin', 'Specialist']), petController.updatePet);

// 🐶 Ruta para eliminar una mascota (Solo Admin)
router.delete('/pets/:id', verifyToken, checkRole(['Admin']), petController.deletePet);

// 🐶 Ruta para obtener todas las mascotas de un usuario específico (Admin y Usuario)
router.get('/pets/user/:userId', verifyToken, checkRole(['Admin', 'User']), petController.getUserPets);

module.exports = router;