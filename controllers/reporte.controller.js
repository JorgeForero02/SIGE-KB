const { Ingreso, Egreso, Servicio, Usuario, CategoriaEgreso } = require('../models');
const ApiResponse = require('../utils/response');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class ReporteController {
    // Reporte mensual de ingresos, egresos y balance
    async getReporteMensual(req, res) {
        try {
            const { mes, anio } = req.query;

            if (!mes || !anio) {
                return ApiResponse.error(res, 'Mes y año son requeridos', 400);
            }

            // Validar mes (1-12)
            if (mes < 1 || mes > 12) {
                return ApiResponse.error(res, 'Mes debe estar entre 1 y 12', 400);
            }

            // Calcular fechas del mes
            const fecha_inicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
            const ultimoDia = new Date(anio, mes, 0).getDate();
            const fecha_fin = `${anio}-${String(mes).padStart(2, '0')}-${ultimoDia}`;

            // Obtener ingresos del mes
            const ingresos = await Ingreso.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fecha_inicio, fecha_fin]
                    }
                },
                include: [
                    {
                        model: Servicio,
                        as: 'servicioInfo',
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Usuario,
                        as: 'empleadoInfo',
                        attributes: ['id', 'nombre', 'apellido']
                    }
                ],
                order: [['fecha', 'ASC']]
            });

            // Obtener egresos del mes
            const egresos = await Egreso.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fecha_inicio, fecha_fin]
                    },
                    estado: 1
                },
                include: [{
                    model: CategoriaEgreso,
                    as: 'categoriaInfo',
                    attributes: ['id', 'nombre']
                }],
                order: [['fecha', 'ASC']]
            });

            // Calcular totales
            const totalIngresos = ingresos.reduce((sum, ing) => sum + parseFloat(ing.valor), 0);
            const totalEgresos = egresos.reduce((sum, eg) => sum + parseFloat(eg.valor), 0);
            const balance = totalIngresos - totalEgresos;

            // Agrupar ingresos por servicio
            const ingresosPorServicio = {};
            ingresos.forEach(ing => {
                const servicioNombre = ing.servicioInfo.nombre;
                if (!ingresosPorServicio[servicioNombre]) {
                    ingresosPorServicio[servicioNombre] = {
                        nombre: servicioNombre,
                        cantidad: 0,
                        total: 0
                    };
                }
                ingresosPorServicio[servicioNombre].cantidad++;
                ingresosPorServicio[servicioNombre].total += parseFloat(ing.valor);
            });

            // Agrupar egresos por categoría
            const egresosPorCategoria = {};
            egresos.forEach(eg => {
                const categoriaNombre = eg.categoriaInfo.nombre;
                if (!egresosPorCategoria[categoriaNombre]) {
                    egresosPorCategoria[categoriaNombre] = {
                        nombre: categoriaNombre,
                        cantidad: 0,
                        total: 0
                    };
                }
                egresosPorCategoria[categoriaNombre].cantidad++;
                egresosPorCategoria[categoriaNombre].total += parseFloat(eg.valor);
            });

            // Agrupar ingresos por medio de pago
            const ingresosPorMedioPago = {};
            ingresos.forEach(ing => {
                const medio = ing.medio_pago;
                if (!ingresosPorMedioPago[medio]) {
                    ingresosPorMedioPago[medio] = {
                        medio_pago: medio,
                        cantidad: 0,
                        total: 0
                    };
                }
                ingresosPorMedioPago[medio].cantidad++;
                ingresosPorMedioPago[medio].total += parseFloat(ing.valor);
            });

            return ApiResponse.success(res, {
                periodo: {
                    mes: parseInt(mes),
                    anio: parseInt(anio),
                    fecha_inicio,
                    fecha_fin
                },
                resumen: {
                    total_ingresos: parseFloat(totalIngresos.toFixed(2)),
                    total_egresos: parseFloat(totalEgresos.toFixed(2)),
                    balance: parseFloat(balance.toFixed(2)),
                    cantidad_ingresos: ingresos.length,
                    cantidad_egresos: egresos.length
                },
                ingresos_por_servicio: Object.values(ingresosPorServicio).map(s => ({
                    ...s,
                    total: parseFloat(s.total.toFixed(2))
                })),
                egresos_por_categoria: Object.values(egresosPorCategoria).map(c => ({
                    ...c,
                    total: parseFloat(c.total.toFixed(2))
                })),
                ingresos_por_medio_pago: Object.values(ingresosPorMedioPago).map(m => ({
                    ...m,
                    total: parseFloat(m.total.toFixed(2))
                })),
                detalle_ingresos: ingresos.map(ing => ({
                    id: ing.id,
                    fecha: ing.fecha,
                    servicio: ing.servicioInfo.nombre,
                    empleado: `${ing.empleadoInfo.nombre} ${ing.empleadoInfo.apellido}`,
                    valor: parseFloat(ing.valor),
                    medio_pago: ing.medio_pago,
                    descripcion: ing.descripcion
                })),
                detalle_egresos: egresos.map(eg => ({
                    id: eg.id,
                    fecha: eg.fecha,
                    categoria: eg.categoriaInfo.nombre,
                    valor: parseFloat(eg.valor),
                    proveedor: eg.proveedor,
                    medio_pago: eg.medio_pago,
                    descripcion: eg.descripcion
                }))
            }, 'Reporte mensual obtenido exitosamente');

        } catch (error) {
            console.error('Error al obtener reporte mensual:', error);
            return ApiResponse.error(res, 'Error al obtener reporte mensual', 500);
        }
    }

    // Reporte personalizado con rango de fechas
    async getReportePersonalizado(req, res) {
        try {
            const { fecha_inicio, fecha_fin, incluir_ingresos, incluir_egresos } = req.query;

            if (!fecha_inicio || !fecha_fin) {
                return ApiResponse.error(res, 'Fecha de inicio y fecha fin son requeridas', 400);
            }

            const incluirIngresos = incluir_ingresos !== 'false';
            const incluirEgresos = incluir_egresos !== 'false';

            let ingresos = [];
            let egresos = [];
            let totalIngresos = 0;
            let totalEgresos = 0;

            // Obtener ingresos si se solicita
            if (incluirIngresos) {
                ingresos = await Ingreso.findAll({
                    where: {
                        fecha: {
                            [Op.between]: [fecha_inicio, fecha_fin]
                        }
                    },
                    include: [
                        {
                            model: Servicio,
                            as: 'servicioInfo',
                            attributes: ['id', 'nombre', 'precio']
                        },
                        {
                            model: Usuario,
                            as: 'empleadoInfo',
                            attributes: ['id', 'nombre', 'apellido']
                        }
                    ],
                    order: [['fecha', 'ASC']]
                });

                totalIngresos = ingresos.reduce((sum, ing) => sum + parseFloat(ing.valor), 0);
            }

            // Obtener egresos si se solicita
            if (incluirEgresos) {
                egresos = await Egreso.findAll({
                    where: {
                        fecha: {
                            [Op.between]: [fecha_inicio, fecha_fin]
                        },
                        estado: 1
                    },
                    include: [{
                        model: CategoriaEgreso,
                        as: 'categoriaInfo',
                        attributes: ['id', 'nombre']
                    }],
                    order: [['fecha', 'ASC']]
                });

                totalEgresos = egresos.reduce((sum, eg) => sum + parseFloat(eg.valor), 0);
            }

            const balance = totalIngresos - totalEgresos;

            // Agrupar ingresos por día
            const ingresosPorDia = {};
            ingresos.forEach(ing => {
                const fecha = ing.fecha;
                if (!ingresosPorDia[fecha]) {
                    ingresosPorDia[fecha] = {
                        fecha,
                        cantidad: 0,
                        total: 0
                    };
                }
                ingresosPorDia[fecha].cantidad++;
                ingresosPorDia[fecha].total += parseFloat(ing.valor);
            });

            // Agrupar egresos por día
            const egresosPorDia = {};
            egresos.forEach(eg => {
                const fecha = eg.fecha;
                if (!egresosPorDia[fecha]) {
                    egresosPorDia[fecha] = {
                        fecha,
                        cantidad: 0,
                        total: 0
                    };
                }
                egresosPorDia[fecha].cantidad++;
                egresosPorDia[fecha].total += parseFloat(eg.valor);
            });

            return ApiResponse.success(res, {
                periodo: {
                    fecha_inicio,
                    fecha_fin
                },
                resumen: {
                    total_ingresos: parseFloat(totalIngresos.toFixed(2)),
                    total_egresos: parseFloat(totalEgresos.toFixed(2)),
                    balance: parseFloat(balance.toFixed(2)),
                    cantidad_ingresos: ingresos.length,
                    cantidad_egresos: egresos.length
                },
                ingresos_por_dia: Object.values(ingresosPorDia)
                    .map(d => ({ ...d, total: parseFloat(d.total.toFixed(2)) }))
                    .sort((a, b) => a.fecha.localeCompare(b.fecha)),
                egresos_por_dia: Object.values(egresosPorDia)
                    .map(d => ({ ...d, total: parseFloat(d.total.toFixed(2)) }))
                    .sort((a, b) => a.fecha.localeCompare(b.fecha)),
                detalle_ingresos: incluirIngresos ? ingresos.map(ing => ({
                    id: ing.id,
                    fecha: ing.fecha,
                    servicio: ing.servicioInfo.nombre,
                    empleado: `${ing.empleadoInfo.nombre} ${ing.empleadoInfo.apellido}`,
                    valor: parseFloat(ing.valor),
                    medio_pago: ing.medio_pago,
                    descripcion: ing.descripcion
                })) : [],
                detalle_egresos: incluirEgresos ? egresos.map(eg => ({
                    id: eg.id,
                    fecha: eg.fecha,
                    categoria: eg.categoriaInfo.nombre,
                    valor: parseFloat(eg.valor),
                    proveedor: eg.proveedor,
                    medio_pago: eg.medio_pago,
                    descripcion: eg.descripcion
                })) : []
            }, 'Reporte personalizado obtenido exitosamente');

        } catch (error) {
            console.error('Error al obtener reporte personalizado:', error);
            return ApiResponse.error(res, 'Error al obtener reporte personalizado', 500);
        }
    }
}

module.exports = new ReporteController();
