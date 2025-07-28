const { registerUser, getUserDataByEmail } = require('../models/userModel');

/**
 * Controlador para la ruta POST /usuarios (Registro de nuevos usuarios).
 */
const handleRegisterUser = async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        
        // El middleware verifyCredentials ya valida email y password,
        // pero se puede añadir validación adicional aquí si es necesario para rol/lenguage.
        if (!rol || !lenguage) {
            return res.status(400).json({ message: 'Rol y lenguaje son obligatorios para el registro.' });
        }

        const newUser = await registerUser(email, password, rol, lenguage);
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        console.error('Error en userController.handleRegisterUser:', error);
        // Manejo de errores específicos desde el modelo (ej. email duplicado)
        res.status(error.code || 500).json({ message: error.message || 'Error interno del servidor al registrar el usuario.' });
    }
};

/**
 * Controlador para la ruta GET /usuarios (Obtener datos de usuario autenticado).
 * Requiere que el middleware verifyToken haya adjuntado req.user.
 */
const handleGetUserData = async (req, res) => {
    try {
        // El email del usuario se obtiene del token JWT decodificado por verifyToken
        const { email } = req.user; 
        
        const userData = await getUserDataByEmail(email);
        
        if (!userData) {
            // Esto no debería ocurrir si el token es válido y el email existe en la DB
            return res.status(404).json({ message: 'Datos de usuario no encontrados.' });
        }
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error en userController.handleGetUserData:', error);
        res.status(error.code || 500).json({ message: error.message || 'Error interno del servidor al obtener los datos del usuario.' });
    }
};

module.exports = {
    handleRegisterUser,
    handleGetUserData
};