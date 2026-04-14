// Importamos la librería jsonwebtoken
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// Exportamos una función middleware
module.exports = function (req, res, next) {
  //Leer token que envia el cliente
  const token = req.header("Authorization");

  if (!token) {
    //Si no hay token bloquea la request
    throw new AppError("Acceso denegado, no hay token", 401);
  }

  try {
    //Verifica que el token sea valido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Guardar usuario en request
    req.user = decoded;

    //Seguir ejecutando la ruta
    next();
  } catch (error) {
    throw new AppError("Token invalido", 401);
  }
};
