const express = require('express');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const petController = require('../controllers/petController');
const router = express.Router();


// 🚀 Aplicar `verifyToken` en todas las rutas
// ADMIN puede crear mascotas
router.post('/pets', verifyToken, checkRole(['Admin']), petController.createPet);  

// ADMIN pueden ver mascotas generales
router.get('/pets', verifyToken, checkRole(['Admin']), petController.getPets);

//ADMIN y USER pueden ver mascotas específicas
router.get('/pets/:id', verifyToken, checkRole(['Admin', 'User']), petController.getPetById);

//ADMIN y SPECIALIST pueden actualizar mascotas
router.put('/pets/:id', verifyToken, checkRole(['Admin', 'Specialist']), petController.updatePet);

// ADMIN puede eliminar mascotas
router.delete('/pets/:id', verifyToken, checkRole(['Admin']), petController.deletePet);

module.exports = router;    