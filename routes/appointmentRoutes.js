const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController'); 
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// 📅 Creación de citas (Admin y Usuario pueden crear)
router.post('/appointments', verifyToken, checkRole(['Admin', 'User']), appointmentController.createAppointment);

// 📅 Obtener todas las citas (Solo Admin)
router.get('/appointments', verifyToken, checkRole(['Admin']), appointmentController.getAppointments);

// 📅 Obtener citas asignadas a un especialista (Admin y Specialist pueden ver)
router.get('/appointments/specialist', verifyToken, checkRole(['Admin', 'Specialist']), appointmentController.getSpecialistAppointments);

// 📅 Obtener una cita específica (Admin y Usuario pueden ver)
router.get('/appointments/:id', verifyToken, checkRole(['Admin', 'User']), appointmentController.getAppointmentById);

// 📅 Actualizar citas (Solo Admin)
router.put('/appointments/:id', verifyToken, checkRole(['Admin']), appointmentController.updateAppointment);

// 📅 Eliminar citas (Solo Admin)
router.delete('/appointments/:id', verifyToken, checkRole(['Admin']), appointmentController.deleteAppointment);

// 📅 Soft delete de una cita (Admin y Specialist pueden marcar como eliminada)
router.put('/appointments/:id/soft-delete', verifyToken, checkRole(['Admin', 'Specialist']), appointmentController.softDeleteAppointment);

module.exports = router;