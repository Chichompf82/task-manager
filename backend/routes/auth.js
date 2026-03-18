const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// ============================
// REGISTRO DE USUARIO
// ============================

router.post("/register", async (req, res) => {
    try {
        // Obtencion datos del body
        const { email, password } = req.body;

        // Verificacion de usuario existe
        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.status(400).json({ message: "El usuario ya existe"})
        }
        
        // Encriptacion de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creamos el usuario
        const user = new User({
            email,
            password: hashedPassword
        });

        // Guardamos en MongoDB
        await user.save();

        res.status(201).json({
            message: "Usuario registrado correctamente"
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error en el servidor"});
    }

});

// ============================
// LOGIN
// ============================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

         // Buscar usuario
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Credenciales invalidas"});
        }

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales invalidas"});
        }

        // Generar token JWT
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.json({
            message: "Login exitoso",
            token
        });
        
    } catch (error){
        res.status(500).json({error: "Error en el servidor"});
    }
});

module.exports = router;