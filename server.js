const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');
const helmet = require('helmet');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// Permitir todos los orígenes
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Habilita preflight

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

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
  .then(async () => {
    console.log('Conexión a la base de datos establecida correctamente');
    await db.sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
