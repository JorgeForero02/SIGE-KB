const { Cita, Usuario, Cliente, Servicio, Ingreso } = require('../models');
const ApiResponse = require('../utils/response');
const { Op } = require('sequelize');

class ConsultaController {
    // Consultar agenda diaria de un empleado
    async getAgendaDiaria(req, res) {
        try {
            const { empleado, fecha } = req.query;

            if (!empleado || !fecha) {
                return ApiResponse.error(res, 'Empleado y fecha son requeridos', 400);
            }

            // Verificar que el empleado existe
            const empleadoInfo = await Usuario.findByPk(empleado, {
                attributes: ['id', 'nombre', 'apellido', 'email']
            });

            if (!empleadoInfo) {
                return ApiResponse.notFound(res, 'Empleado no encontrado');
            }

            // Obtener citas del día
            const citas = await Cita.findAll({
                where: {
                    empleado,
                    fecha,
                    estado: {
                        [Op.in]: ['Pendiente', 'Confirmada', 'En Proceso', 'Completada']
                    }
                },
                include: [
                    {
                        model: Cliente,
                        as: 'clienteInfo',
                        attributes: ['id', 'nombre', 'apellido', 'telefono', 'email']
                    },
                    {
                        model: Servicio,
                        as: 'servicioInfo',
                        attributes: ['id', 'nombre', 'precio', 'duracion']
                    }
                ],
                order: [['hora_inicio', 'ASC']]
            });

            // Obtener servicios prestados del día (ingresos registrados)
            const serviciosPrestados = await Ingreso.findAll({
                where: {
                    empleado,
                    fecha
                },
                include: [
                    {
                        model: Servicio,
                        as: 'servicioInfo',
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Cita,
                        as: 'citaInfo',
                        required: false,
                        include: [{
                            model: Cliente,
                            as: 'clienteInfo',
                            attributes: ['id', 'nombre', 'apellido']
                        }]
                    }
                ]
            });

            // Calcular resumen del día
            const totalCitas = citas.length;
            const citasPendientes = citas.filter(c => c.estado === 'Pendiente').length;
            const citasConfirmadas = citas.filter(c => c.estado === 'Confirmada').length;
            const citasEnProceso = citas.filter(c => c.estado === 'En Proceso').length;
            const citasCompletadas = citas.filter(c => c.estado === 'Completada').length;
            const totalIngresos = serviciosPrestados.reduce((sum, ing) => sum + parseFloat(ing.valor), 0);

            return ApiResponse.success(res, {
                empleado: empleadoInfo,
                fecha,
                resumen: {
                    total_citas: totalCitas,
                    citas_pendientes: citasPendientes,
                    citas_confirmadas: citasConfirmadas,
                    citas_en_proceso: citasEnProceso,
                    citas_completadas: citasCompletadas,
                    servicios_prestados: serviciosPrestados.length,
                    total_ingresos: parseFloat(totalIngresos.toFixed(2))
                },
                agenda: citas.map(cita => ({
                    id: cita.id,
                    hora_inicio: cita.hora_inicio,
                    hora_fin: cita.hora_fin,
                    duracion: cita.duracion,
                    estado: cita.estado,
                    cliente: cita.clienteInfo ? {
                        id: cita.clienteInfo.id,
                        nombre: `${cita.clienteInfo.nombre} ${cita.clienteInfo.apellido}`,
                        telefono: cita.clienteInfo.telefono
                    } : null,
                    servicio: {
                        id: cita.servicioInfo.id,
                        nombre: cita.servicioInfo.nombre,
                        precio: parseFloat(cita.servicioInfo.precio)
                    },
                    observaciones: cita.observaciones
                })),
                servicios_realizados: serviciosPrestados.map(ing => ({
                    id: ing.id,
                    servicio: ing.servicioInfo.nombre,
                    valor: parseFloat(ing.valor),
                    medio_pago: ing.medio_pago,
                    cliente: ing.citaInfo?.clienteInfo ?
                        `${ing.citaInfo.clienteInfo.nombre} ${ing.citaInfo.clienteInfo.apellido}` :
                        'Cliente no registrado',
                    descripcion: ing.descripcion
                }))
            }, 'Agenda diaria obtenida exitosamente');

        } catch (error) {
            console.error('Error al obtener agenda diaria:', error);
            return ApiResponse.error(res, 'Error al obtener agenda diaria', 500);
        }
    }

    // Historial de servicios prestados con filtros
    async getHistorialServicios(req, res) {
        try {
            const { empleado, servicio, fecha_inicio, fecha_fin, medio_pago, limite, pagina } = req.query;

            const where = {};

            // Aplicar filtros
            if (empleado) where.empleado = empleado;
            if (servicio) where.servicio = servicio;
            if (medio_pago) where.medio_pago = medio_pago;

            if (fecha_inicio && fecha_fin) {
                where.fecha = {
                    [Op.between]: [fecha_inicio, fecha_fin]
                };
            } else if (fecha_inicio) {
                where.fecha = { [Op.gte]: fecha_inicio };
            } else if (fecha_fin) {
                where.fecha = { [Op.lte]: fecha_fin };
            }

            // Configurar paginación
            const limit = parseInt(limite) || 50;
            const page = parseInt(pagina) || 1;
            const offset = (page - 1) * limit;

            // Obtener historial de servicios
            const { count, rows: servicios } = await Ingreso.findAndCountAll({
                where,
                include: [
                    {
                        model: Servicio,
                        as: 'servicioInfo',
                        attributes: ['id', 'nombre', 'precio', 'porcentaje']
                    },
                    {
                        model: Usuario,
                        as: 'empleadoInfo',
                        attributes: ['id', 'nombre', 'apellido']
                    },
                    {
                        model: Cita,
                        as: 'citaInfo',
                        required: false,
                        include: [{
                            model: Cliente,
                            as: 'clienteInfo',
                            attributes: ['id', 'nombre', 'apellido', 'telefono']
                        }]
                    }
                ],
                order: [['fecha', 'DESC'], ['id', 'DESC']],
                limit,
                offset
            });

            // Calcular estadísticas
            const totalIngresos = servicios.reduce((sum, ing) => sum + parseFloat(ing.valor), 0);

            // Agrupar por servicio
            const serviciosMasRealizados = {};
            servicios.forEach(ing => {
                const servicioNombre = ing.servicioInfo.nombre;
                if (!serviciosMasRealizados[servicioNombre]) {
                    serviciosMasRealizados[servicioNombre] = {
                        servicio: servicioNombre,
                        cantidad: 0,
                        total: 0
                    };
                }
                serviciosMasRealizados[servicioNombre].cantidad++;
                serviciosMasRealizados[servicioNombre].total += parseFloat(ing.valor);
            });

            // Ordenar servicios por cantidad
            const topServicios = Object.values(serviciosMasRealizados)
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 10)
                .map(s => ({
                    ...s,
                    total: parseFloat(s.total.toFixed(2)),
                    promedio: parseFloat((s.total / s.cantidad).toFixed(2))
                }));

            return ApiResponse.success(res, {
                filtros_aplicados: {
                    empleado: empleado || 'Todos',
                    servicio: servicio || 'Todos',
                    fecha_inicio: fecha_inicio || 'Sin filtro',
                    fecha_fin: fecha_fin || 'Sin filtro',
                    medio_pago: medio_pago || 'Todos'
                },
                paginacion: {
                    pagina_actual: page,
                    limite_por_pagina: limit,
                    total_registros: count,
                    total_paginas: Math.ceil(count / limit)
                },
                estadisticas: {
                    total_servicios: count,
                    total_ingresos: parseFloat(totalIngresos.toFixed(2)),
                    promedio_por_servicio: count > 0 ? parseFloat((totalIngresos / count).toFixed(2)) : 0
                },
                top_servicios: topServicios,
                historial: servicios.map(ing => {
                    const porcentaje = ing.servicioInfo.porcentaje || 0;
                    const comision = (ing.valor * porcentaje) / 100;

                    return {
                        id: ing.id,
                        fecha: ing.fecha,
                        empleado: {
                            id: ing.empleadoInfo.id,
                            nombre: `${ing.empleadoInfo.nombre} ${ing.empleadoInfo.apellido}`
                        },
                        servicio: {
                            id: ing.servicioInfo.id,
                            nombre: ing.servicioInfo.nombre
                        },
                        cliente: ing.citaInfo?.clienteInfo ? {
                            id: ing.citaInfo.clienteInfo.id,
                            nombre: `${ing.citaInfo.clienteInfo.nombre} ${ing.citaInfo.clienteInfo.apellido}`,
                            telefono: ing.citaInfo.clienteInfo.telefono
                        } : null,
                        valor: parseFloat(ing.valor),
                        porcentaje_comision: parseFloat(porcentaje),
                        comision_empleado: parseFloat(comision.toFixed(2)),
                        medio_pago: ing.medio_pago,
                        extra: parseFloat(ing.extra || 0),
                        descripcion: ing.descripcion
                    };
                })
            }, 'Historial de servicios obtenido exitosamente');

        } catch (error) {
            console.error('Error al obtener historial de servicios:', error);
            return ApiResponse.error(res, 'Error al obtener historial de servicios', 500);
        }
    }

    // Consultar servicios por empleado (resumen)
    async getServiciosPorEmpleado(req, res) {
        try {
            const { fecha_inicio, fecha_fin } = req.query;

            if (!fecha_inicio || !fecha_fin) {
                return ApiResponse.error(res, 'Fecha de inicio y fecha fin son requeridas', 400);
            }

            // Obtener todos los ingresos del período
            const ingresos = await Ingreso.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fecha_inicio, fecha_fin]
                    }
                },
                include: [
                    {
                        model: Usuario,
                        as: 'empleadoInfo',
                        attributes: ['id', 'nombre', 'apellido']
                    },
                    {
                        model: Servicio,
                        as: 'servicioInfo',
                        attributes: ['id', 'nombre', 'porcentaje']
                    }
                ]
            });

            // Agrupar por empleado
            const empleadosResumen = {};
            ingresos.forEach(ing => {
                const empleadoId = ing.empleado;
                if (!empleadosResumen[empleadoId]) {
                    empleadosResumen[empleadoId] = {
                        empleado: {
                            id: ing.empleadoInfo.id,
                            nombre: `${ing.empleadoInfo.nombre} ${ing.empleadoInfo.apellido}`
                        },
                        cantidad_servicios: 0,
                        total_ingresos: 0,
                        total_comisiones: 0
                    };
                }

                const porcentaje = ing.servicioInfo.porcentaje || 0;
                const comision = (ing.valor * porcentaje) / 100;

                empleadosResumen[empleadoId].cantidad_servicios++;
                empleadosResumen[empleadoId].total_ingresos += parseFloat(ing.valor);
                empleadosResumen[empleadoId].total_comisiones += comision;
            });

            // Convertir a array y ordenar por total de ingresos
            const resumenArray = Object.values(empleadosResumen)
                .map(emp => ({
                    ...emp,
                    total_ingresos: parseFloat(emp.total_ingresos.toFixed(2)),
                    total_comisiones: parseFloat(emp.total_comisiones.toFixed(2)),
                    promedio_por_servicio: parseFloat((emp.total_ingresos / emp.cantidad_servicios).toFixed(2))
                }))
                .sort((a, b) => b.total_ingresos - a.total_ingresos);

            return ApiResponse.success(res, {
                periodo: {
                    fecha_inicio,
                    fecha_fin
                },
                resumen_general: {
                    total_empleados: resumenArray.length,
                    total_servicios: ingresos.length,
                    total_ingresos: parseFloat(ingresos.reduce((sum, ing) => sum + parseFloat(ing.valor), 0).toFixed(2))
                },
                empleados: resumenArray
            }, 'Resumen por empleado obtenido exitosamente');

        } catch (error) {
            console.error('Error al obtener servicios por empleado:', error);
            return ApiResponse.error(res, 'Error al obtener servicios por empleado', 500);
        }
    }
}

module.exports = new ConsultaController();
