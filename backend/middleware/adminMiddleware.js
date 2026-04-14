const AppError = require("../utils/AppError");
// Exportamos una función middleware
module.exports = function (req, res, next) {
  // req.user viene del authMiddleware que se ejecutó antes
  if (req.user.role !== "admin") {
    throw new AppError("Acceso denegado: se requiere rol admin", 403);
  }

  //si es admin, continúa
  next();
};
