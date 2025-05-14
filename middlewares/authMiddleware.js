const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 Datos del token decodificado:", decoded); // 🔍 Verifica los datos que llegan del token

        req.session.user = { // ✅ Guarda correctamente el `ID` en la sesión
            ID: decoded.ID || decoded.id, // 🔹 Asegura que si el token tiene `id`, también lo guarde como `ID`
            NAME: decoded.NAME || 'Desconocido',
            EMAIL: decoded.EMAIL,
            ROL: decoded.ROL
        };

        console.log("📌 Token válido, usuario autenticado:", req.session.user); // 🔍 Verifica que los datos estén correctamente guardados

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

// 🔹 Middleware para verificar roles
exports.checkRole = (roles) => {
    return (req, res, next) => {
        const { ROL } = req.session.user;

        if (!roles.includes(ROL)) {
            return res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes' });
        }

        next();
    };
};

