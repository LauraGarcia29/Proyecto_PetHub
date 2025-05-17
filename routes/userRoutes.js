const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware'); 

// 👩🏻‍🦰 Rutas para obtener información de usuarios
router.get('/user/appointments', verifyToken, checkRole(['Admin', 'User']), userController.getUserAppointments);
router.get('/user/pets', verifyToken, checkRole(['Admin', 'User']), userController.getUserPets);
router.get('/admin/users', verifyToken, checkRole(['Admin']), userController.getAllUsers);
router.get('/specialists', verifyToken, checkRole(['Admin', 'User']), userController.getSpecialists);

// 👩🏻‍🦰 Obtener datos de sesión del usuario autenticado
router.get('/profile/session', verifyToken, (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(403).json({ error: 'No hay sesión activa' });
    }

    res.status(200).json(req.session.user);
});

// 👩🏻‍🦰 Cerrar sesión del usuario
router.get('/logout', verifyToken, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.status(200).json({ message: '✅ Sesión cerrada correctamente' });
    });
});

module.exports = router;