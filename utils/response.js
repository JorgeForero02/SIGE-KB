class ApiResponse {
  static success(res, data, message = 'Operacion exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Error en la operacion', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Error de validaci�n',
      errors
    });
  }

  static notFound(res, message = 'Recurso no encontrado') {
    return res.status(404).json({
      success: false,
      message
    });
  }
}

module.exports = ApiResponse;
