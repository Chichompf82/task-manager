// Importar las funiciones de express-validator
const { body } = require("express-validator");

// Validar para el registro
const registerValidation = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail(), // convierte a minúsculas y limpia espacios

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .isLength({ max: 15 })
    .withMessage("La contraseña debe tener un maximo de 15 caracteres"),
];

// Validaciones para login
const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail(), // convierte a minúsculas y limpia espacios

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

module.exports = { registerValidation, loginValidation };
