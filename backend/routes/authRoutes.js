const express = require('express');
const { handleLogin } = require('../controllers/authController');
const { verifyCredentials } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta POST /login: Para iniciar sesión y obtener un token JWT
// Usa el middleware verifyCredentials para asegurar que email y password estén presentes
router.post('/login', verifyCredentials, handleLogin);

module.exports = router;