const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga JWT_SECRET desde .env

/**
 * Middleware para verificar la existencia de credenciales (email y password) en el body.
 * Se usa para las rutas de registro y login.
 */
const verifyCredentials = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }
    next(); // Si las credenciales existen, pasa al siguiente middleware/controlador
};

/**
 * Middleware para validar el token JWT en las cabeceras de autorización.
 * Decodifica el token y adjunta el payload (email del usuario) a req.user.
 */
const verifyToken = (req, res, next) => {
    try {
        const Authorization = req.header('Authorization');
        if (!Authorization) {
            return res.status(401).json({ message: 'Token no proporcionado. Acceso no autorizado.' });
        }

        // El token viene en formato "Bearer TOKEN_JWT", necesitamos extraer solo el token
        const token = Authorization.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Formato de token inválido. Use "Bearer <token>".' });
        }

        // Verificar y decodificar el token
        // Si el token es inválido o ha expirado, jwt.verify lanzará un error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adjuntar el payload decodificado a la solicitud para que los controladores puedan acceder a él
        req.user = decoded; 
        next(); // Si el token es válido, pasa al siguiente middleware/controlador

    } catch (error) {
        console.error('Error en verifyToken:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido o malformado.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado. Por favor, inicie sesión nuevamente.' });
        }
        res.status(500).json({ message: 'Error al verificar el token.' });
    }
};

module.exports = {
    verifyCredentials,
    verifyToken
};