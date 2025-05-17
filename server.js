require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./db'); 

const app = express();

// 📌 Configuración de CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📌 Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_secreta_default',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // ✅ Solo seguro en producción
}));

// 📌 Sincronizar modelos con la base de datos
const syncDB = async () => {
  try {
    await sequelize.sync();
    console.log('📦 Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('⚠️ Error al sincronizar la base de datos:', error);
    process.exit(1); // ✅ Sale del proceso si la conexión falla
  }
};

syncDB();

// 📌 Importar rutas
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', authRoutes);
app.use('/api', petRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', userRoutes);

// 📌 Configurar puerto
const PORT = process.env.PORT || 3000;

// 📌 Iniciar servidor después de sincronización
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});