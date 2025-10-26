const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');

class AuthController {
    async login(req, res) {
        try {
            const { documento, contrasena } = req.body;

            const usuario = await Usuario.findOne({
                where: { documento },
                include: [{
                    model: Rol,
                    as: 'rolInfo'
                }]
            });

            if (!usuario) {
                await AuditoriaService.registrar(
                    'Seguridad',
                    'Login fallido',
                    `Intento de acceso con documento inexistente: ${documento}`
                );
                return ApiResponse.error(res, 'Credenciales inválidas', 401);
            }

            if (usuario.estado === 0) {
                await AuditoriaService.registrar(
                    'Seguridad',
                    'Login fallido',
                    `Intento de acceso con usuario inactivo: ${documento}`,
                    usuario.id
                );
                return ApiResponse.error(res, 'Usuario inactivo', 403);
            }

            const passwordValid = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!passwordValid) {
                await AuditoriaService.registrar(
                    'Seguridad',
                    'Login fallido',
                    `Contraseña incorrecta para usuario: ${documento}`,
                    usuario.id
                );
                return ApiResponse.error(res, 'Credenciales inválidas', 401);
            }

            const token = jwt.sign(
                { userId: usuario.id, rol: usuario.rol },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
            );

            await AuditoriaService.registrar(
                'Seguridad',
                'Login exitoso',
                `Inicio de sesión exitoso`,
                usuario.id
            );

            return ApiResponse.success(res, {
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    email: usuario.email,
                    rol: usuario.rolInfo.nombre
                }
            }, 'Inicio de sesión exitoso');
        } catch (error) {
            console.error('Error en login:', error);
            return ApiResponse.error(res, 'Error al iniciar sesión', 500);
        }
    }

    async getProfile(req, res) {
        try {
            const usuario = await Usuario.findByPk(req.user.id, {
                include: [{
                    model: Rol,
                    as: 'rolInfo'
                }],
                attributes: { exclude: ['contrasena'] }
            });

            return ApiResponse.success(res, usuario, 'Perfil obtenido');
        } catch (error) {
            return ApiResponse.error(res, 'Error al obtener perfil', 500);
        }
    }
}

module.exports = new AuthController();
