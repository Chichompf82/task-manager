const AppError = require("../utils/AppError");

module.exports = function (err, req, res, next) {
  //si el error no tiene statusCode, asumimos que es un error inesperado
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  //en desarrillo mostramos el stack trace para sebagger
  //en pruducción no lo mostramos por seguridad
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
};
