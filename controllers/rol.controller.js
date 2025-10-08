const db = require('../models');
const ApiResponse = require('../utils/response');
const Rol = db.Rol;

const RolController = {
  // Obtener todos
  getAll: async (req, res, next) => {
    try {
      const items = await Rol.findAll();
      return ApiResponse.success(res, items, 'Lista obtenida correctamente');
    } catch (error) {
      next(error);
    }
  },

  // Obtener por ID
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await Rol.findByPk(id);
      
      if (!item) {
        return ApiResponse.notFound(res, 'Registro no encontrado');
      }
      
      return ApiResponse.success(res, item, 'Registro obtenido correctamente');
    } catch (error) {
      next(error);
    }
  },

  // Crear
  create: async (req, res, next) => {
    try {
      const newItem = await Rol.create(req.body);
      return ApiResponse.success(res, newItem, 'Registro creado correctamente', 201);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await Rol.findByPk(id);
      
      if (!item) {
        return ApiResponse.notFound(res, 'Registro no encontrado');
      }
      
      await item.update(req.body);
      return ApiResponse.success(res, item, 'Registro actualizado correctamente');
    } catch (error) {
      next(error);
    }
  },

  // Eliminar
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await Rol.findByPk(id);
      
      if (!item) {
        return ApiResponse.notFound(res, 'Registro no encontrado');
      }
      
      await item.destroy();
      return ApiResponse.success(res, null, 'Registro eliminado correctamente');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = RolController;
