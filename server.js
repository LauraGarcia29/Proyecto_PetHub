const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config(); // Cargar variables de entorno

// Habilitar CORS globalmente
app.use(cors({
  origin: 'http://localhost:4200', // Permitir solo el origen de tu frontend
  methods: ['GET', 'POST'], // Métodos permitidos
  credentials: true, // Para enviar cookies en solicitudes
}));

app.use(express.json()); // Necesario para procesar JSON

app.use(session({
  secret: 'tu_clave_secreta', // 📌 Clave para firmar las sesiones
  resave: false, // 🔹 Evita guardar la sesión si no hay cambios
  saveUninitialized: true, // 🔹 Guarda sesiones nuevas automáticamente
  //cookie: {maxAge: 6000}
  cookie: { secure: false }  // 📌 Usa "true" si estás en producción con HTTPS
}));

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes'); // Agregar las rutas de usuario

app.use(userRoutes);
app.use('/api', authRoutes); // Cargar rutas de autenticación
app.use('/api', petRoutes); // Cargar rutas de mascotas
app.use('/api', appointmentRoutes); // Cargar rutas de citas
app.use('/api', userRoutes); //Cargar rutas de usuario


app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});