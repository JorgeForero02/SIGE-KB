const { Cliente } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class ClienteController {
    async getAll(req, res) {
        try {
            const { search } = req.query;

            const where = {};

            if (search) {
                where[Op.or] = [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { apellido: { [Op.like]: `%${search}%` } },
                    { documento: { [Op.like]: `%${search}%` } },
                    { telefono: { [Op.like]: `%${search}%` } }
                ];
            }

            const clientes = await Cliente.findAll({
                where,
                order: [['nombre', 'ASC'], ['apellido', 'ASC']]
            });

            return ApiResponse.success(res, clientes, 'Clientes obtenidos exitosamente');
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            return ApiResponse.error(res, 'Error al obtener clientes', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const cliente = await Cliente.findByPk(id);

            if (!cliente) {
                return ApiResponse.notFound(res, 'Cliente no encontrado');
            }

            return ApiResponse.success(res, cliente, 'Cliente obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            return ApiResponse.error(res, 'Error al obtener cliente', 500);
        }
    }

    async getByDocumento(req, res) {
        try {
            const { documento } = req.params;

            const cliente = await Cliente.findOne({
                where: { documento }
            });

            if (!cliente) {
                return ApiResponse.notFound(res, 'Cliente no encontrado');
            }

            return ApiResponse.success(res, cliente, 'Cliente obtenido exitosamente');
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            return ApiResponse.error(res, 'Error al buscar cliente', 500);
        }
    }

    async create(req, res) {
        try {
            const {
                nombre,
                apellido,
                telefono,
                tipo_documento,
                documento
            } = req.body;

            // Verificar duplicado de documento
            const existente = await Cliente.findOne({ where: { documento } });
            if (existente) {
                return ApiResponse.error(res, 'Ya existe un cliente con ese documento', 409);
            }

            const cliente = await Cliente.create({
                nombre,
                apellido,
                telefono,
                tipo_documento,
                documento
            });

            await AuditoriaService.registrar(
                'Cliente',
                'Crear',
                `Cliente creado: ${nombre} ${apellido} (${documento})`,
                req.user.id
            );

            return ApiResponse.success(res, cliente, 'Cliente creado exitosamente', 201);
        } catch (error) {
            console.error('Error al crear cliente:', error);
            return ApiResponse.error(res, 'Error al crear cliente', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nombre,
                apellido,
                telefono,
                tipo_documento,
                documento
            } = req.body;

            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                return ApiResponse.notFound(res, 'Cliente no encontrado');
            }

            // Verificar duplicado de documento si cambió
            if (documento && documento !== cliente.documento) {
                const existente = await Cliente.findOne({
                    where: { documento, id: { [Op.ne]: id } }
                });
                if (existente) {
                    return ApiResponse.error(res, 'Ya existe un cliente con ese documento', 409);
                }
            }

            await cliente.update({
                nombre: nombre || cliente.nombre,
                apellido: apellido || cliente.apellido,
                telefono: telefono !== undefined ? telefono : cliente.telefono,
                tipo_documento: tipo_documento || cliente.tipo_documento,
                documento: documento || cliente.documento
            });

            await AuditoriaService.registrar(
                'Cliente',
                'Actualizar',
                `Cliente actualizado: ${cliente.nombre} ${cliente.apellido}`,
                req.user.id
            );

            return ApiResponse.success(res, cliente, 'Cliente actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            return ApiResponse.error(res, 'Error al actualizar cliente', 500);
        }
    }
}

module.exports = new ClienteController();
