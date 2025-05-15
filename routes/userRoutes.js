const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware'); // ✅ Ahora importa `checkRole`

router.get('/user/appointments', verifyToken, checkRole(['Admin', 'User']), userController.getUserAppointments);
router.get('/user/pets', verifyToken, checkRole(['Admin', 'User']), userController.getUserPets);
router.get('/admin/users', verifyToken, checkRole(['Admin']), userController.getAllUsers);

router.get('/profile/session', (req, res) => {
    if (!req.session || !req.session.user) { // 📌 Verificación más robusta
        return res.status(403).json({ error: 'No hay sesión activa' });
    }

    return res.status(200).json(req.session.user);
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error al destruir sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.status(200).json({ message: '✅ Sesión cerrada correctamente' });
    });
});

module.exports = router;

