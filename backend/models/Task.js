//Importamos mongoose para crar el modelo
const mongoose = require("mongoose");

//Creamos el esquema de la tarea
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pendiente", "en-proceso", "completada"],
      default: "pendiente",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Exportacion modelo Task
module.exports = mongoose.model("Task", taskSchema);
