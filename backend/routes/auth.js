const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AppError = require("../utils/AppError");

//importamos validaciones y middleware
// prettier-ignore
const {registerValidation, loginValidation} = require("../validators/authValidators");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

// ============================
// REGISTRO DE USUARIO
// ============================

router.post(
  "/register",
  registerValidation,
  validate,
  async (req, res, next) => {
    try {
      // Obtencion datos del body
      const { email, password } = req.body;

      // Verificacion de usuario existe
      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new AppError("El usuario ya existe", 400);
      }

      // Encriptacion de contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Creamos el usuario
      const user = new User({
        email,
        password: hashedPassword,
      });

      // Guardamos en MongoDB
      await user.save();

      //  Token
      // prettier-ignore
      const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d"}
    );

      //  RESPUESTA FINAL
      res.status(201).json({
        message: "Registro exitoso",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================
// LOGIN
// ============================

router.post("/login", loginValidation, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Credenciales invalidas", 400);
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Credenciales invalidas", 400);
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
