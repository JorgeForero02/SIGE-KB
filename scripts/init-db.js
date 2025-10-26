const bcrypt = require('bcrypt');
const { sequelize, Rol, Usuario } = require('../models');

async function initDatabase() {
    try {
        console.log('Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✓ Conexión establecida');

        console.log('Sincronizando modelos...');
        await sequelize.sync({ force: false, alter: true });
        console.log('✓ Modelos sincronizados');

        // Crear roles por defecto
        console.log('Creando roles por defecto...');
        const roles = [
            { nombre: 'Administrador', descripcion: 'Acceso completo al sistema', estado: 1 },
            { nombre: 'Gerente', descripcion: 'Gestión del negocio', estado: 1 },
            { nombre: 'Empleado', descripcion: 'Usuario estándar', estado: 1 }
        ];

        for (const rol of roles) {
            const existe = await Rol.findOne({ where: { nombre: rol.nombre } });
            if (!existe) {
                await Rol.create(rol);
                console.log(`✓ Rol "${rol.nombre}" creado`);
            }
        }

        // Crear usuario administrador por defecto
        console.log('Creando usuario administrador...');
        const adminExiste = await Usuario.findOne({ where: { documento: 'admin' } });

        if (!adminExiste) {
            const rolAdmin = await Rol.findOne({ where: { nombre: 'Administrador' } });
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await Usuario.create({
                nombre: 'Administrador',
                apellido: 'Sistema',
                tipo_documento: 'CC',
                documento: 'admin',
                email: 'admin@sige-kb.com',
                telefono: '0000000000',
                rol: rolAdmin.id,
                contrasena: hashedPassword,
                estado: 1,
                fecha_registro: new Date()
            });

            console.log('✓ Usuario administrador creado');
            console.log('  Documento: admin');
            console.log('  Contraseña: admin123');
            console.log('  ⚠️  CAMBIAR LA CONTRASEÑA EN PRODUCCIÓN');
        } else {
            console.log('✓ Usuario administrador ya existe');
        }

        console.log('\n✅ Inicialización completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la inicialización:', error);
        process.exit(1);
    }
}

initDatabase();
