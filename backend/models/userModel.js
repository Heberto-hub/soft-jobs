const pool = require('../config/db');
const bcrypt = require('bcryptjs'); // Importa bcryptjs para encriptar contraseñas

/**
 * Registra un nuevo usuario en la base de datos.
 * La contraseña se encripta antes de ser almacenada.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario (sin encriptar).
 * @param {string} rol - El rol del usuario.
 * @param {string} lenguage - El lenguaje preferido del usuario.
 * @returns {Object} El objeto usuario recién creado (sin la contraseña encriptada).
 */
const registerUser = async (email, password, rol, lenguage) => {
    try {
        // Encriptar la contraseña antes de guardarla en la base de datos
        // El '10' es el número de rondas de salting, un valor común y seguro.
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO usuarios (email, password, rol, lenguage)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, rol, lenguage;
        `;
        const values = [email, hashedPassword, rol, lenguage];
        const { rows } = await pool.query(query, values);
        return rows[0]; // Retorna el usuario recién creado (sin la contraseña encriptada)
    } catch (error) {
        console.error('Error en userModel.registerUser:', error);
        // Si el error es por email duplicado (violación de la restricción UNIQUE)
        if (error.code === '23505') {
            throw { code: 409, message: 'El email ya está registrado.' };
        }
        throw { code: 500, message: 'Error al registrar el usuario en la base de datos.' };
    }
};

/**
 * Busca un usuario por su email.
 * @param {string} email - El email del usuario a buscar.
 * @returns {Object|null} El objeto usuario si se encuentra, incluyendo la contraseña encriptada, de lo contrario null.
 */
const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT id, email, password, rol, lenguage FROM usuarios WHERE email = $1;';
        const values = [email];
        const { rows } = await pool.query(query, values);
        return rows[0] || null; // Retorna el usuario o null si no se encuentra
    } catch (error) {
        console.error('Error en userModel.findUserByEmail:', error);
        throw { code: 500, message: 'Error al buscar el usuario en la base de datos.' };
    }
};

/**
 * Obtiene los datos de un usuario por su email (sin la contraseña).
 * Usado para la ruta GET /usuarios después de la autenticación.
 * @param {string} email - El email del usuario.
 * @returns {Object|null} El objeto usuario (sin password) si se encuentra, de lo contrario null.
 */
const getUserDataByEmail = async (email) => {
    try {
        const query = 'SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1;';
        const values = [email];
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (error) {
        console.error('Error en userModel.getUserDataByEmail:', error);
        throw { code: 500, message: 'Error al obtener los datos del usuario.' };
    }
};

module.exports = {
    registerUser,
    findUserByEmail,
    getUserDataByEmail
};