const { Cita, Cliente, Usuario, Servicio } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class CitaController {
    async getAll(req, res) {
        try {
            const { fecha_inicio, fecha_fin, encargado, cliente, estado } = req.query;

            const where = {};

            if (fecha_inicio && fecha_fin) {
                where.fecha = {
                    [Op.between]: [fecha_inicio, fecha_fin]
                };
            } else if (fecha_inicio) {
                where.fecha = { [Op.gte]: fecha_inicio };
            } else if (fecha_fin) {
                where.fecha = { [Op.lte]: fecha_fin };
            }

            if (encargado) where.encargado = encargado;
            if (cliente) where.cliente = cliente;
            if (estado) where.estado = estado;

            const citas = await Cita.findAll({
                where,
                include: [
                    {
                        model: Cliente,
                        as: 'clienteInfo',
                        attributes: ['id', 'nombre', 'apellido', 'telefono']
                    },
                    {
                        model: Usuario,
                        as: 'encargadoInfo',
                        attributes: ['id', 'nombre', 'apellido']
                    }
                ],
                order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
            });

            return ApiResponse.success(res, citas, 'Citas obtenidas exitosamente');
        } catch (error) {
            console.error('Error al obtener citas:', error);
            return ApiResponse.error(res, 'Error al obtener citas', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const cita = await Cita.findByPk(id, {
                include: [
                    {
                        model: Cliente,
                        as: 'clienteInfo'
                    },
                    {
                        model: Usuario,
                        as: 'encargadoInfo',
                        attributes: ['id', 'nombre', 'apellido']
                    }
                ]
            });

            if (!cita) {
                return ApiResponse.notFound(res, 'Cita no encontrada');
            }

            return ApiResponse.success(res, cita, 'Cita obtenida exitosamente');
        } catch (error) {
            console.error('Error al obtener cita:', error);
            return ApiResponse.error(res, 'Error al obtener cita', 500);
        }
    }

    async getByEmpleado(req, res) {
        try {
            const { empleadoId } = req.params;
            const { fecha } = req.query;

            const where = { encargado: empleadoId };

            if (fecha) {
                where.fecha = fecha;
            } else {
                // Por defecto, mostrar citas futuras
                where.fecha = { [Op.gte]: new Date().toISOString().split('T')[0] };
            }

            const citas = await Cita.findAll({
                where,
                include: [
                    {
                        model: Cliente,
                        as: 'clienteInfo',
                        attributes: ['id', 'nombre', 'apellido', 'telefono']
                    }
                ],
                order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
            });

            return ApiResponse.success(res, citas, 'Agenda obtenida exitosamente');
        } catch (error) {
            console.error('Error al obtener agenda:', error);
            return ApiResponse.error(res, 'Error al obtener agenda', 500);
        }
    }

    async create(req, res) {
        try {
            const {
                fecha,
                hora_inicio,
                duracion,
                encargado,
                cliente
            } = req.body;

            // Validar que el empleado existe y está activo
            const empleado = await Usuario.findOne({
                where: { id: encargado, estado: 1 }
            });
            if (!empleado) {
                return ApiResponse.error(res, 'El empleado especificado no existe o está inactivo', 400);
            }

            // Validar que el cliente existe
            const clienteExiste = await Cliente.findByPk(cliente);
            if (!clienteExiste) {
                return ApiResponse.error(res, 'El cliente especificado no existe', 400);
            }

            // Calcular hora_fin
            const [horas, minutos] = hora_inicio.split(':');
            const inicioDate = new Date();
            inicioDate.setHours(parseInt(horas), parseInt(minutos), 0);
            inicioDate.setMinutes(inicioDate.getMinutes() + duracion);

            const hora_fin = inicioDate.toTimeString().split(' ')[0].substring(0, 5);

            // Verificar solapamiento de horarios
            const solapamiento = await Cita.findOne({
                where: {
                    fecha,
                    encargado,
                    estado: { [Op.in]: ['pendiente', 'confirmada'] },
                    [Op.or]: [
                        {
                            // La nueva cita comienza durante una existente
                            hora_inicio: { [Op.lte]: hora_inicio },
                            hora_fin: { [Op.gt]: hora_inicio }
                        },
                        {
                            // La nueva cita termina durante una existente
                            hora_inicio: { [Op.lt]: hora_fin },
                            hora_fin: { [Op.gte]: hora_fin }
                        },
                        {
                            // La nueva cita envuelve una existente
                            hora_inicio: { [Op.gte]: hora_inicio },
                            hora_fin: { [Op.lte]: hora_fin }
                        }
                    ]
                }
            });

            if (solapamiento) {
                return ApiResponse.error(
                    res,
                    'Ya existe una cita en ese horario para el empleado seleccionado',
                    409
                );
            }

            const cita = await Cita.create({
                fecha,
                hora_inicio,
                hora_fin,
                duracion,
                encargado,
                cliente,
                estado: 'pendiente'
            });

            await AuditoriaService.registrar(
                'Cita',
                'Crear',
                `Cita creada: ${fecha} ${hora_inicio} - Cliente: ${clienteExiste.nombre} ${clienteExiste.apellido} - Empleado: ${empleado.nombre} ${empleado.apellido}`,
                req.user.id
            );

            const citaCompleta = await Cita.findByPk(cita.id, {
                include: [
                    { model: Cliente, as: 'clienteInfo' },
                    { model: Usuario, as: 'encargadoInfo', attributes: ['id', 'nombre', 'apellido'] }
                ]
            });

            return ApiResponse.success(res, citaCompleta, 'Cita creada exitosamente', 201);
        } catch (error) {
            console.error('Error al crear cita:', error);
            return ApiResponse.error(res, 'Error al crear cita', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                fecha,
                hora_inicio,
                duracion,
                encargado,
                cliente
            } = req.body;

            const cita = await Cita.findByPk(id);
            if (!cita) {
                return ApiResponse.notFound(res, 'Cita no encontrada');
            }

            // No permitir editar citas completadas o canceladas
            if (cita.estado === 'completada' || cita.estado === 'cancelada') {
                return ApiResponse.error(
                    res,
                    'No se pueden editar citas completadas o canceladas',
                    400
                );
            }

            // Calcular nueva hora_fin si cambió duración u hora_inicio
            let hora_fin = cita.hora_fin;
            if (hora_inicio || duracion) {
                const horaInicio = hora_inicio || cita.hora_inicio;
                const duracionNueva = duracion || cita.duracion;

                const [horas, minutos] = horaInicio.split(':');
                const inicioDate = new Date();
                inicioDate.setHours(parseInt(horas), parseInt(minutos), 0);
                inicioDate.setMinutes(inicioDate.getMinutes() + duracionNueva);

                hora_fin = inicioDate.toTimeString().split(' ')[0].substring(0, 5);
            }

            // Verificar solapamiento si cambió fecha, hora o empleado
            if (fecha || hora_inicio || encargado) {
                const fechaVerificar = fecha || cita.fecha;
                const horaInicioVerificar = hora_inicio || cita.hora_inicio;
                const encargadoVerificar = encargado || cita.encargado;

                const solapamiento = await Cita.findOne({
                    where: {
                        id: { [Op.ne]: id },
                        fecha: fechaVerificar,
                        encargado: encargadoVerificar,
                        estado: { [Op.in]: ['pendiente', 'confirmada'] },
                        [Op.or]: [
                            {
                                hora_inicio: { [Op.lte]: horaInicioVerificar },
                                hora_fin: { [Op.gt]: horaInicioVerificar }
                            },
                            {
                                hora_inicio: { [Op.lt]: hora_fin },
                                hora_fin: { [Op.gte]: hora_fin }
                            },
                            {
                                hora_inicio: { [Op.gte]: horaInicioVerificar },
                                hora_fin: { [Op.lte]: hora_fin }
                            }
                        ]
                    }
                });

                if (solapamiento) {
                    return ApiResponse.error(
                        res,
                        'Ya existe una cita en ese horario para el empleado seleccionado',
                        409
                    );
                }
            }

            await cita.update({
                fecha: fecha || cita.fecha,
                hora_inicio: hora_inicio || cita.hora_inicio,
                hora_fin,
                duracion: duracion || cita.duracion,
                encargado: encargado || cita.encargado,
                cliente: cliente || cita.cliente
            });

            await AuditoriaService.registrar(
                'Cita',
                'Actualizar',
                `Cita actualizada: ${cita.fecha} ${cita.hora_inicio}`,
                req.user.id
            );

            const citaActualizada = await Cita.findByPk(id, {
                include: [
                    { model: Cliente, as: 'clienteInfo' },
                    { model: Usuario, as: 'encargadoInfo', attributes: ['id', 'nombre', 'apellido'] }
                ]
            });

            return ApiResponse.success(res, citaActualizada, 'Cita actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar cita:', error);
            return ApiResponse.error(res, 'Error al actualizar cita', 500);
        }
    }

    async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
            if (!estadosValidos.includes(estado)) {
                return ApiResponse.error(res, 'Estado inválido', 400);
            }

            const cita = await Cita.findByPk(id);
            if (!cita) {
                return ApiResponse.notFound(res, 'Cita no encontrada');
            }

            await cita.update({ estado });

            await AuditoriaService.registrar(
                'Cita',
                'Cambio de estado',
                `Cita ${estado}: ${cita.fecha} ${cita.hora_inicio}`,
                req.user.id
            );

            return ApiResponse.success(
                res,
                { id: cita.id, estado: cita.estado },
                `Cita ${estado} exitosamente`
            );
        } catch (error) {
            console.error('Error al cambiar estado de cita:', error);
            return ApiResponse.error(res, 'Error al cambiar estado de cita', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const cita = await Cita.findByPk(id);
            if (!cita) {
                return ApiResponse.notFound(res, 'Cita no encontrada');
            }

            // Cambiar estado a cancelada en lugar de eliminar
            await cita.update({ estado: 'cancelada' });

            await AuditoriaService.registrar(
                'Cita',
                'Cancelar',
                `Cita cancelada: ${cita.fecha} ${cita.hora_inicio}`,
                req.user.id
            );

            return ApiResponse.success(res, null, 'Cita cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            return ApiResponse.error(res, 'Error al cancelar cita', 500);
        }
    }
}

module.exports = new CitaController();
