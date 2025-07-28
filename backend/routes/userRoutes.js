// routes/userRoutes.js
const express = require('express');
const { handleRegisterUser, handleGetUserData } = require('../controllers/userController');
const { verifyCredentials, verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta POST /usuarios: Para registrar nuevos usuarios
// Usa el middleware verifyCredentials para asegurar que email y password estén presentes
router.post('/usuarios', verifyCredentials, handleRegisterUser);

// Ruta GET /usuarios: Para devolver los datos de un usuario autenticado
// Usa el middleware verifyToken para validar el JWT antes de acceder a los datos
router.get('/usuarios', verifyToken, handleGetUserData);

module.exports = router;