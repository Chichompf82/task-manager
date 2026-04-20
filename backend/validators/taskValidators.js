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

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres")
    .trim(),

  body("status")
    .optional()
    .isIn(["pendiente", "en-proceso", "completada"])
    .withMessage("El estado debe ser pendiente, en-proceso o competada"),
];

module.exports = { taskValidation };
