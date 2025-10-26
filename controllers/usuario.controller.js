const bcrypt = require('bcrypt');
const { Usuario, Rol, UsuarioCategoria, Categoria } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class UsuarioController {
    async getAll(req, res) {
        try {
            const { estado, rol } = req.query;

            const where = {};
            if (estado !== undefined) where.estado = estado;
            if (rol) where.rol = rol;

            const usuarios = await Usuario.findAll({
                where,
                include: [
                    {
                        model: Rol,
                        as: 'rolInfo',
                        attributes: ['id', 'nombre']
                    }
                ],
                attributes: { exclude: ['contrasena'] },
                order: [['fecha_registro', 'DESC']]
            });

            return ApiResponse.success(res, usuarios, 'Usuarios obtenidos exitosamente');
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return ApiResponse.error(res, 'Error al obtener usuarios', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(id, {
                include: [
                    {
                        model: Rol,
                        as: 'rolInfo'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    }
                ],
                attributes: { exclude: ['contrasena'] }
            });

            if (!usuario) {
                return ApiResponse.notFound(res, 'Usuario no encontrado');
            }

            return ApiResponse.success(res, usuario, 'Usuario obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return ApiResponse.error(res, 'Error al obtener usuario', 500);
        }
    }

    async create(req, res) {
        try {
            const {
                nombre,
                apellido,
                tipo_documento,
                documento,
                email,
                telefono,
                rol,
                contrasena,
                categorias
            } = req.body;

            // Verificar duplicado de documento
            const existeDocumento = await Usuario.findOne({ where: { documento } });
            if (existeDocumento) {
                return ApiResponse.error(res, 'Ya existe un usuario con ese documento', 409);
            }

            // Verificar duplicado de email si se proporciona
            if (email) {
                const existeEmail = await Usuario.findOne({ where: { email } });
                if (existeEmail) {
                    return ApiResponse.error(res, 'Ya existe un usuario con ese email', 409);
                }
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // Crear usuario
            const usuario = await Usuario.create({
                nombre,
                apellido,
                tipo_documento,
                documento,
                email,
                telefono,
                rol,
                contrasena: hashedPassword,
                estado: 1,
                fecha_registro: new Date()
            });

            // Asignar categorías si se proporcionan
            if (categorias && Array.isArray(categorias) && categorias.length > 0) {
                const categoriasAsignaciones = categorias.map(catId => ({
                    id_usuario: usuario.id,
                    id_categoria: catId
                }));

                await UsuarioCategoria.bulkCreate(categoriasAsignaciones);
            }

            await AuditoriaService.registrar(
                'Usuario',
                'Crear',
                `Usuario creado: ${nombre} ${apellido} (${documento})`,
                req.user.id
            );

            // Obtener usuario completo
            const usuarioCompleto = await Usuario.findByPk(usuario.id, {
                include: [
                    { model: Rol, as: 'rolInfo' },
                    { model: Categoria, as: 'categorias', through: { attributes: [] } }
                ],
                attributes: { exclude: ['contrasena'] }
            });

            return ApiResponse.success(res, usuarioCompleto, 'Usuario creado exitosamente', 201);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return ApiResponse.error(res, 'Error al crear usuario', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nombre,
                apellido,
                tipo_documento,
                documento,
                email,
                telefono,
                rol,
                categorias
            } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return ApiResponse.notFound(res, 'Usuario no encontrado');
            }

            // Verificar duplicado de documento si cambió
            if (documento && documento !== usuario.documento) {
                const existeDocumento = await Usuario.findOne({
                    where: { documento, id: { [Op.ne]: id } }
                });
                if (existeDocumento) {
                    return ApiResponse.error(res, 'Ya existe un usuario con ese documento', 409);
                }
            }

            // Verificar duplicado de email si cambió
            if (email && email !== usuario.email) {
                const existeEmail = await Usuario.findOne({
                    where: { email, id: { [Op.ne]: id } }
                });
                if (existeEmail) {
                    return ApiResponse.error(res, 'Ya existe un usuario con ese email', 409);
                }
            }

            await usuario.update({
                nombre: nombre || usuario.nombre,
                apellido: apellido || usuario.apellido,
                tipo_documento: tipo_documento || usuario.tipo_documento,
                documento: documento || usuario.documento,
                email: email !== undefined ? email : usuario.email,
                telefono: telefono !== undefined ? telefono : usuario.telefono,
                rol: rol || usuario.rol
            });

            // Actualizar categorías si se proporcionan
            if (categorias && Array.isArray(categorias)) {
                await UsuarioCategoria.destroy({ where: { id_usuario: id } });

                if (categorias.length > 0) {
                    const categoriasAsignaciones = categorias.map(catId => ({
                        id_usuario: id,
                        id_categoria: catId
                    }));
                    await UsuarioCategoria.bulkCreate(categoriasAsignaciones);
                }
            }

            await AuditoriaService.registrar(
                'Usuario',
                'Actualizar',
                `Usuario actualizado: ${usuario.nombre} ${usuario.apellido}`,
                req.user.id
            );

            const usuarioActualizado = await Usuario.findByPk(id, {
                include: [
                    { model: Rol, as: 'rolInfo' },
                    { model: Categoria, as: 'categorias', through: { attributes: [] } }
                ],
                attributes: { exclude: ['contrasena'] }
            });

            return ApiResponse.success(res, usuarioActualizado, 'Usuario actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return ApiResponse.error(res, 'Error al actualizar usuario', 500);
        }
    }

    async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return ApiResponse.notFound(res, 'Usuario no encontrado');
            }

            const fecha_salida = estado === 0 ? new Date() : null;

            await usuario.update({ estado, fecha_salida });

            await AuditoriaService.registrar(
                'Usuario',
                'Cambio de estado',
                `Usuario ${estado === 1 ? 'activado' : 'desactivado'}: ${usuario.nombre} ${usuario.apellido}`,
                req.user.id
            );

            return ApiResponse.success(
                res,
                { id: usuario.id, estado: usuario.estado },
                `Usuario ${estado === 1 ? 'activado' : 'desactivado'} exitosamente`
            );
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            return ApiResponse.error(res, 'Error al cambiar estado del usuario', 500);
        }
    }

    async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { nueva_contrasena } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return ApiResponse.notFound(res, 'Usuario no encontrado');
            }

            const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);
            await usuario.update({ contrasena: hashedPassword });

            await AuditoriaService.registrar(
                'Usuario',
                'Cambio de contraseña',
                `Contraseña actualizada para: ${usuario.nombre} ${usuario.apellido}`,
                req.user.id
            );

            return ApiResponse.success(res, null, 'Contraseña actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            return ApiResponse.error(res, 'Error al actualizar contraseña', 500);
        }
    }
}

module.exports = new UsuarioController();
