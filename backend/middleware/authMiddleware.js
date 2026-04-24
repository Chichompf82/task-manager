// Importamos la librería jsonwebtoken
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// Exportamos una función middleware
module.exports = function (req, res, next) {
  // leemos el header Authorization completo
  const authHeader = req.header("Authorization");

  // si no hay header bloqueamos la request
  if (!authHeader) {
    return next(new AppError("Acceso denegado, no hay token", 401));
  }

  // separamos "Bearer" del token real
  // "Bearer eyJhbG...".split(" ") → ["Bearer", "eyJhbG..."]
  // con [1] tomamos solo la segunda parte
  const token = authHeader.split(" ")[1];

  // si después de separar no hay token (vino solo "Bearer" sin nada)
  if (!token) {
    return next(new AppError("Formato de token inválido", 401));
  }

  try {
    // verifica el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // guardamos los datos del usuario en la request
    // para que las rutas puedan acceder a req.user.id y req.user.role
    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Token inválido", 401));
  }
};
