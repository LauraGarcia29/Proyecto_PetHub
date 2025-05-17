const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');//Importa la conexión a la base de datos

// 👩🏻‍🦰 Inicio de sesión con validación de la base de datos
exports.loginUser = async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);
    const { EMAIL, PASSWORD } = req.body;

    if (!EMAIL || !PASSWORD) {
      return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    }

    // 👩🏻‍🦰 Buscar usuario en la base de datos
    const user = await User.findOne({ where: { EMAIL, is_deleted: false } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 👩🏻‍🦰 Verificar la contraseña
    const validPassword = await bcrypt.compare(PASSWORD, user.PASSWORD);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // 🔑 Generar el JWT Token
    const token = jwt.sign(
      { ID: user.ID, EMAIL: user.EMAIL, ROL: user.ROL },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 👩🏻‍🦰 Verificar que la sesión está disponible
    if (!req.session) {
      return res.status(500).json({ error: 'Sesión no inicializada correctamente' });
    }

    req.session.user = {
      ID: user.ID,
      NAME: user.NAME,
      EMAIL: user.EMAIL,
      ROL: user.ROL
    };

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: req.session.user,
      token
    });

  } catch (error) {
    console.error('❌ Error en inicio de sesión:', error);
    return res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};