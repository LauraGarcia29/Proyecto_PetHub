require('dotenv').config();
console.log('⚡ Cargando variables de entorno:');
console.log('Host:', process.env.DATABASE_HOST);
console.log('Usuario:', process.env.DATABASE_USER);
console.log('Base de datos:', process.env.DATABASE_NAME);
console.log('Dialect:', process.env.DATABASE_DIALECT);
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT || 'mysql',
    port: process.env.DATABASE_PORT || 3306,
    logging: process.env.NODE_ENV === 'development'
});

// Verificar la conexión
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('🚀 Conexión con MySQL usando Sequelize establecida correctamente!');
    } catch (error) {
        console.error('❌ Error al conectar con MySQL:', error);
        process.exit(1); // ✅ Sale del proceso si la conexión falla
    }
};

connectDB();

module.exports = sequelize;