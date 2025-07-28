const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno desde .env

// Importa los middlewares
const { requestLogger } = require('./middlewares/logger');

// Importa los módulos de rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto del .env o 3000 por defecto

// --- Middlewares Globales ---
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Para parsear cuerpos de petición JSON
app.use(requestLogger); // Middleware para registrar todas las peticiones recibidas

// --- Rutas de la API ---

// Ruta de bienvenida (opcional, para verificar que el servidor está corriendo)
app.get("/", (req, res) => {
    res.send("¡Bienvenido al Backend de Soft Jobs!");
});

// Usa las rutas de usuario
app.use('/', userRoutes);

// Usa las rutas de autenticación
app.use('/', authRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
});

// --- Iniciación del servidor ---
app.listen(port, () => {
    console.log(`Servidor Soft Jobs escuchando en http://localhost:${port}`);
    console.log('Rutas disponibles:');
    console.log(`  POST   http://localhost:${port}/usuarios (Registro de usuario)`);
    console.log(`  POST   http://localhost:${port}/login (Inicio de sesión, devuelve JWT)`);
    console.log(`  GET    http://localhost:${port}/usuarios (Obtener datos de usuario, requiere JWT en cabecera Authorization)`);
});