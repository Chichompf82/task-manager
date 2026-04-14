const { validationResult } = require("express-validator");

// Este middleware lee los errores que dejó express-validator
// y los devuelve como respuesta antes de que llegue al controlador
module.exports = function (req, res, next) {
  const errors = validationResult(req);

  // si hay errores, los devolvemos formateados
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.path, // qué campo falló
        message: err.msg, // mensaje de error
      })),
    });
  }

  // si no hay errores, continúa hacia la ruta
  next();
};
