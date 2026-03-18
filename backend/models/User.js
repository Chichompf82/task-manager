// Importamos mongoose para crear el modelo
const mongoose = require("mongoose");

// Creamos el esquema del usuario
// Esto define cómo se verá el documento en MongoDB
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Creamos el modelo User basado en el schema
const User = mongoose.model("User", UserSchema);

// Exportamos el modelo para usarlo en otros archivos
module.exports = User;