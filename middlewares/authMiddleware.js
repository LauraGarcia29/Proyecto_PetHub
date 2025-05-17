const jwt = require('jsonwebtoken');
const User = require('../models/user'); //Importa el modelo Sequelize

// 📌 Middleware para verificar el token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📌 Datos del token decodificado:", decoded); // 🔍 Depuración

    // 📌 Verificación del usuario en la base de datos
    const user = await User.findOne({ where: { ID: decoded.ID, is_deleted: false } });

    if (!user) {
      return res.status(403).json({ error: 'Acceso denegado: Usuario no encontrado o eliminado' });
    }

    req.session.user = {
      ID: user.ID,
      NAME: user.NAME,
      EMAIL: user.EMAIL,
      ROL: user.ROL
    };

    console.log("📌 Token válido, usuario autenticado:", req.session.user); // 🔍 Verificación
    next();

  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// 📌 Middleware para verificar roles
exports.checkRole = (roles) => {
  return (req, res, next) => {
    const { ROL } = req.session.user;

    if (!roles.includes(ROL)) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes' });
    }

    next();
  };
};