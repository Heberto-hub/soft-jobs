const { findUserByEmail } = require('../models/userModel');
const bcrypt = require('bcryptjs'); // Importa bcryptjs para comparar contraseñas
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga JWT_SECRET

/**
 * Controlador para la ruta POST /login (Inicio de sesión y generación de token JWT).
 */
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // El middleware verifyCredentials ya valida email y password.

        const user = await findUserByEmail(email);
        
        // Verificar si el usuario existe
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas (email no encontrado).' });
        }

        // Comparar la contraseña proporcionada con la contraseña encriptada en la DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Credenciales inválidas (contraseña incorrecta).' });
        }

        // Si las credenciales son válidas, genera un token JWT
        // El payload del token debe incluir el email del usuario registrado.
        const token = jwt.sign(
            { email: user.email }, // Payload del token
            process.env.JWT_SECRET, // Clave secreta para firmar el token
            { expiresIn: '1h' } // El token expira en 1 hora
        );
        
        res.status(200).json({ message: 'Autenticación exitosa', token });
    } catch (error) {
        console.error('Error en authController.handleLogin:', error);
        res.status(error.code || 500).json({ message: error.message || 'Error interno del servidor al iniciar sesión.' });
    }
};

module.exports = {
    handleLogin
};