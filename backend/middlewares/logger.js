// middlewares/logger.js

// Middleware para registrar las peticiones HTTP
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    console.log(`[${timestamp}] ${method}: ${url}`); // Registra la ruta y el método
    next(); // Pasa el control al siguiente middleware o ruta
};

module.exports = {
    requestLogger
};
