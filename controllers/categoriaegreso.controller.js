const { CategoriaEgreso } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class CategoriaEgresoController {
    async getAll(req, res) {
        try {
            const { estado } = req.query;

            const where = {};
            if (estado !== undefined) where.estado = estado;

            const categorias = await CategoriaEgreso.findAll({
                where,
                order: [['nombre', 'ASC']]
            });

            return ApiResponse.success(res, categorias, 'Categorías de egreso obtenidas exitosamente');
        } catch (error) {
            console.error('Error al obtener categorías de egreso:', error);
            return ApiResponse.error(res, 'Error al obtener categorías de egreso', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const categoria = await CategoriaEgreso.findByPk(id);

            if (!categoria) {
                return ApiResponse.notFound(res, 'Categoría de egreso no encontrada');
            }

            return ApiResponse.success(res, categoria, 'Categoría de egreso obtenida exitosamente');
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            return ApiResponse.error(res, 'Error al obtener categoría de egreso', 500);
        }
    }

    async create(req, res) {
        try {
            const { nombre, descripcion } = req.body;

            // Verificar duplicado
            const existente = await CategoriaEgreso.findOne({ where: { nombre } });
            if (existente) {
                return ApiResponse.error(res, 'Ya existe una categoría de egreso con ese nombre', 409);
            }

            const categoria = await CategoriaEgreso.create({
                nombre,
                descripcion,
                estado: 1
            });

            await AuditoriaService.registrar(
                'CategoriaEgreso',
                'Crear',
                `Categoría de egreso creada: ${nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, categoria, 'Categoría de egreso creada exitosamente', 201);
        } catch (error) {
            console.error('Error al crear categoría:', error);
            return ApiResponse.error(res, 'Error al crear categoría de egreso', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, estado } = req.body;

            const categoria = await CategoriaEgreso.findByPk(id);
            if (!categoria) {
                return ApiResponse.notFound(res, 'Categoría de egreso no encontrada');
            }

            // Verificar duplicado si se cambió el nombre
            if (nombre && nombre !== categoria.nombre) {
                const existente = await CategoriaEgreso.findOne({
                    where: { nombre, id: { [Op.ne]: id } }
                });
                if (existente) {
                    return ApiResponse.error(res, 'Ya existe una categoría de egreso con ese nombre', 409);
                }
            }

            await categoria.update({
                nombre: nombre || categoria.nombre,
                descripcion: descripcion !== undefined ? descripcion : categoria.descripcion,
                estado: estado !== undefined ? estado : categoria.estado
            });

            await AuditoriaService.registrar(
                'CategoriaEgreso',
                'Actualizar',
                `Categoría de egreso actualizada: ${categoria.nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, categoria, 'Categoría de egreso actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            return ApiResponse.error(res, 'Error al actualizar categoría de egreso', 500);
        }
    }
}

module.exports = new CategoriaEgresoController();
