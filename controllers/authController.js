const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { NAME, EMAIL, PASSWORD, ROL = 'USER' } = req.body; // 🔹 Si ROL no existe, toma "USER"

    if (!NAME || !EMAIL || !PASSWORD) { // 📌 Eliminamos la verificación de ROL
        return res.status(400).json({ error: 'Todos los campos son requeridos excepto ROL' });
    }

    try {
        const existingUser = await User.findOne({ where: { EMAIL } }); 
        if (existingUser) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);
        const newUser = await User.create({ NAME, EMAIL, PASSWORD: hashedPassword, ROL });

        return res.status(201).json({ message: 'Usuario registrado correctamente', user: { ID: newUser.ID, NAME: newUser.NAME, EMAIL: newUser.EMAIL, ROL: newUser.ROL } });
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        return res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { EMAIL, PASSWORD } = req.body;

    if (!EMAIL || !PASSWORD) {
        return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    }

    try {
        const user = await User.findOne({ where: { EMAIL } });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log("Usuario autenticado:", user);

        const validPassword = await bcrypt.compare(PASSWORD, user.PASSWORD);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { ID: user.dataValues.ID, EMAIL: user.EMAIL, ROL: user.ROL },
            process.env.JWT_SECRET, // 📌 Usa la clave del archivo `.env`
            { expiresIn: '2h' }
        );
        
        // 📌 Verifica que la sesión esté disponible antes de asignar valores
        if (!req.session) {
            return res.status(500).json({ error: 'Sesión no inicializada correctamente' });
        }
        
        req.session.user = {
            ID:  user.dataValues.ID,
            NAME: user.NAME,
            EMAIL: user.EMAIL,
            ROL: user.ROL
        };

        return res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.session.user, token });
    } catch (error) {
        console.error('❌ Error en inicio de sesión:', error);
        return res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
};