const jwt = require('jsonwebtoken');

exports.loginUser = (req, res) => {
  console.log('BODY RECIBIDO:', req.body);
  const { email, password } = req.body;

  // Simular validación de usuario (debería consultar la base de datos)
  if (email === 'laura@email.com' && password === '123456') {
    // 🔑 Generar el JWT Token
    const token = jwt.sign({ id: 1, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Credenciales inválidas' });
};