// Importar las funiciones de express-validator
const { body } = require("express-validator");

// Validar para la tarea
const taskValidation = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres")
    .trim(), //elimina espacios al principio y al final
];

module.exports = { taskValidation };
