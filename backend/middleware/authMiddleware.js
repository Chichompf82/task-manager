// Importamos la librería jsonwebtoken
const jwt = require("jsonwebtoken");

// Exportamos una función middleware
module.exports = function(req, res, next) {

    //Leer token que envia el cliente
    const token = req.header("Authorization");

    if (!token) {

        //Si no hay token bloquea la request
        return res.status(401).json({
            message: "Acceso denegado, no hay token"
        });
    }

    try {

        //Verifica que el token sea valido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Guardar usuario en request
        req.user = decoded;

        //Seguir ejecutando la ruta
        next();

    } catch (error) {
        res.status(401).json({
            message: "Token invalido"
        })
    }
}