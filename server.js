const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');
const helmet = require('helmet');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'API del SIGE-KB funcionando correctamente',
    version: '1.0.0'
  });
});

// Rutas de la API
app.use('/api', routes);

// Middleware de manejo de errores
app.use(errorHandler);

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
  .then(async () => {
    console.log('Conexión a la base de datos establecida correctamente');

    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
    } else {
      await db.sequelize.sync();
      console.log('Modelos sincronizados');
    }

  })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('? Error al conectar con la base de datos:', err);
  });
