const { Auditoria } = require('../models');

class AuditoriaService {
    static async registrar(tipo, accion, mensaje, usuarioId = null) {
        try {
            const fecha = new Date().toISOString().split('T')[0];
            const hora = new Date().toTimeString().split(' ')[0];

            await Auditoria.create({
                fecha,
                hora,
                mensaje: usuarioId ? `Usuario ${usuarioId}: ${mensaje}` : mensaje,
                tipo,
                accion
            });
        } catch (error) {
            console.error('Error al registrar auditoría:', error);
        }
    }
}

module.exports = AuditoriaService;
