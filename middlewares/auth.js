const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/response');
const { Usuario, Rol } = require('../models');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return ApiResponse.error(res, 'Token no proporcionado', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario y su rol
        const usuario = await Usuario.findByPk(decoded.userId, {
            include: [{
                model: Rol,
                as: 'rolInfo'
            }]
        });

        if (!usuario || usuario.estado === 0) {
            return ApiResponse.error(res, 'Usuario no autorizado', 403);
        }

        req.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rolId: usuario.rol,
            rolNombre: usuario.rolInfo.nombre
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return ApiResponse.error(res, 'Token inválido', 401);
        }
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.error(res, 'Token expirado', 401);
        }
        return ApiResponse.error(res, 'Error de autenticación', 500);
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ApiResponse.error(res, 'No autenticado', 401);
        }

        if (!roles.includes(req.user.rolNombre)) {
            return ApiResponse.error(
                res,
                'No tienes permisos para realizar esta acción',
                403
            );
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorize
};
