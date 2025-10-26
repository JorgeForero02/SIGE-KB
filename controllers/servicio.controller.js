const { Servicio, Categoria, HistorialTarifa } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class ServicioController {
    async getAll(req, res) {
        try {
            const { estado, categoria } = req.query;

            const where = {};
            if (estado !== undefined) where.estado = estado;
            if (categoria) where.categoria = categoria;

            const servicios = await Servicio.findAll({
                where,
                include: [{
                    model: Categoria,
                    as: 'categoriaInfo',
                    attributes: ['id', 'nombre']
                }],
                order: [['nombre', 'ASC']]
            });

            return ApiResponse.success(res, servicios, 'Servicios obtenidos exitosamente');
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            return ApiResponse.error(res, 'Error al obtener servicios', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const servicio = await Servicio.findByPk(id, {
                include: [{
                    model: Categoria,
                    as: 'categoriaInfo'
                }]
            });

            if (!servicio) {
                return ApiResponse.notFound(res, 'Servicio no encontrado');
            }

            return ApiResponse.success(res, servicio, 'Servicio obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener servicio:', error);
            return ApiResponse.error(res, 'Error al obtener servicio', 500);
        }
    }

    async create(req, res) {
        try {
            const {
                nombre,
                descripcion,
                duracion,
                categoria,
                precio,
                porcentaje
            } = req.body;

            // Verificar que la categoría existe
            const categoriaExiste = await Categoria.findByPk(categoria);
            if (!categoriaExiste) {
                return ApiResponse.error(res, 'La categoría especificada no existe', 400);
            }

            // Verificar duplicado en la misma categoría
            const existente = await Servicio.findOne({
                where: { nombre, categoria }
            });
            if (existente) {
                return ApiResponse.error(
                    res,
                    'Ya existe un servicio con ese nombre en esta categoría',
                    409
                );
            }

            const servicio = await Servicio.create({
                nombre,
                descripcion,
                duracion,
                categoria,
                precio,
                porcentaje,
                estado: 1
            });

            // Crear registro en historial de tarifa
            await HistorialTarifa.create({
                servicio: servicio.id,
                fecha_inicio: new Date().toISOString().split('T')[0],
                fecha_fin: null,
                valor: precio
            });

            await AuditoriaService.registrar(
                'Servicio',
                'Crear',
                `Servicio creado: ${nombre} - Precio: ${precio}`,
                req.user.id
            );

            const servicioCompleto = await Servicio.findByPk(servicio.id, {
                include: [{ model: Categoria, as: 'categoriaInfo' }]
            });

            return ApiResponse.success(res, servicioCompleto, 'Servicio creado exitosamente', 201);
        } catch (error) {
            console.error('Error al crear servicio:', error);
            return ApiResponse.error(res, 'Error al crear servicio', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nombre,
                descripcion,
                duracion,
                categoria,
                precio,
                porcentaje,
                estado
            } = req.body;

            const servicio = await Servicio.findByPk(id);
            if (!servicio) {
                return ApiResponse.notFound(res, 'Servicio no encontrado');
            }

            // Si cambió el precio, cerrar tarifa actual y crear nueva
            if (precio && parseFloat(precio) !== parseFloat(servicio.precio)) {
                const fechaHoy = new Date().toISOString().split('T')[0];

                // Cerrar tarifa actual
                await HistorialTarifa.update(
                    { fecha_fin: fechaHoy },
                    {
                        where: {
                            servicio: id,
                            fecha_fin: null
                        }
                    }
                );

                // Crear nueva tarifa
                await HistorialTarifa.create({
                    servicio: id,
                    fecha_inicio: fechaHoy,
                    fecha_fin: null,
                    valor: precio
                });

                await AuditoriaService.registrar(
                    'Servicio',
                    'Cambio de tarifa',
                    `Tarifa actualizada de ${servicio.precio} a ${precio} para: ${servicio.nombre}`,
                    req.user.id
                );
            }

            // Verificar duplicado si se cambió el nombre
            if (nombre && nombre !== servicio.nombre) {
                const existente = await Servicio.findOne({
                    where: {
                        nombre,
                        categoria: categoria || servicio.categoria,
                        id: { [Op.ne]: id }
                    }
                });
                if (existente) {
                    return ApiResponse.error(
                        res,
                        'Ya existe un servicio con ese nombre en esta categoría',
                        409
                    );
                }
            }

            await servicio.update({
                nombre: nombre || servicio.nombre,
                descripcion: descripcion !== undefined ? descripcion : servicio.descripcion,
                duracion: duracion || servicio.duracion,
                categoria: categoria || servicio.categoria,
                precio: precio || servicio.precio,
                porcentaje: porcentaje !== undefined ? porcentaje : servicio.porcentaje,
                estado: estado !== undefined ? estado : servicio.estado
            });

            await AuditoriaService.registrar(
                'Servicio',
                'Actualizar',
                `Servicio actualizado: ${servicio.nombre}`,
                req.user.id
            );

            const servicioActualizado = await Servicio.findByPk(id, {
                include: [{ model: Categoria, as: 'categoriaInfo' }]
            });

            return ApiResponse.success(res, servicioActualizado, 'Servicio actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            return ApiResponse.error(res, 'Error al actualizar servicio', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const servicio = await Servicio.findByPk(id);
            if (!servicio) {
                return ApiResponse.notFound(res, 'Servicio no encontrado');
            }

            // Soft delete
            await servicio.update({ estado: 0 });

            await AuditoriaService.registrar(
                'Servicio',
                'Eliminar',
                `Servicio eliminado: ${servicio.nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, null, 'Servicio eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            return ApiResponse.error(res, 'Error al eliminar servicio', 500);
        }
    }
}

module.exports = new ServicioController();
