const { Rol } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');

class RolController {
    async getAll(req, res) {
        try {
            const roles = await Rol.findAll({
                where: { estado: 1 }
            });

            return ApiResponse.success(res, roles, 'Roles obtenidos exitosamente');
        } catch (error) {
            return ApiResponse.error(res, 'Error al obtener roles', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const rol = await Rol.findByPk(id);

            if (!rol) {
                return ApiResponse.notFound(res, 'Rol no encontrado');
            }

            return ApiResponse.success(res, rol, 'Rol obtenido exitosamente');
        } catch (error) {
            return ApiResponse.error(res, 'Error al obtener rol', 500);
        }
    }

    async create(req, res) {
        try {
            const { nombre, descripcion } = req.body;

            // Verificar duplicado
            const existente = await Rol.findOne({ where: { nombre } });
            if (existente) {
                return ApiResponse.error(res, 'Ya existe un rol con ese nombre', 409);
            }

            const rol = await Rol.create({
                nombre,
                descripcion,
                estado: 1
            });

            await AuditoriaService.registrar(
                'Rol',
                'Crear',
                `Rol creado: ${nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, rol, 'Rol creado exitosamente', 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error al crear rol', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, estado } = req.body;

            const rol = await Rol.findByPk(id);
            if (!rol) {
                return ApiResponse.notFound(res, 'Rol no encontrado');
            }

            // Verificar duplicado si se cambió el nombre
            if (nombre && nombre !== rol.nombre) {
                const existente = await Rol.findOne({ where: { nombre } });
                if (existente) {
                    return ApiResponse.error(res, 'Ya existe un rol con ese nombre', 409);
                }
            }

            await rol.update({
                nombre: nombre || rol.nombre,
                descripcion: descripcion !== undefined ? descripcion : rol.descripcion,
                estado: estado !== undefined ? estado : rol.estado
            });

            await AuditoriaService.registrar(
                'Rol',
                'Actualizar',
                `Rol actualizado: ${rol.nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, rol, 'Rol actualizado exitosamente');
        } catch (error) {
            return ApiResponse.error(res, 'Error al actualizar rol', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const rol = await Rol.findByPk(id);
            if (!rol) {
                return ApiResponse.notFound(res, 'Rol no encontrado');
            }

            // Soft delete
            await rol.update({ estado: 0 });

            await AuditoriaService.registrar(
                'Rol',
                'Eliminar',
                `Rol eliminado: ${rol.nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, null, 'Rol eliminado exitosamente');
        } catch (error) {
            return ApiResponse.error(res, 'Error al eliminar rol', 500);
        }
    }
}

module.exports = new RolController();
