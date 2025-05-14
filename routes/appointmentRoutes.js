const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController'); // ✅ Importación correcta
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');


//ADMIN y USER pueden crear citas
router.post('/appointments', verifyToken, checkRole(['Admin', 'User']), appointmentController.createAppointment);

//ADMIN puede ver citas
router.get('/appointments', verifyToken, checkRole(['Admin']), appointmentController.getAppointments);

//SPECIALIST puede ver citas asignadas a él
router.get('/appointments/specialist', verifyToken, checkRole(['Admin','Specialist']), appointmentController.getSpecialistAppointments);

//ADMIN puede actualizar y eliminar citas
router.put('/appointments/:id', verifyToken, checkRole(['Admin']), appointmentController.updateAppointment);
router.delete('/appointments/:id', verifyToken, checkRole(['Admin']), appointmentController.deleteAppointment);

module.exports = router;