// Importa el framework Express
const express = require("express");

// Importa la librería dotenv
const dotenv = require("dotenv");

// Habilitar CORS
const cors = require("cors");

// Importa la función que creamos para conectarnos a MongoDB
const connectDB = require("./config/database");
//Importa rutas
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
//Importar middleware de errores
const errorMiddleware = require("./middleware/errorMiddleware");

// Carga las variables del archivo .env en process.env
dotenv.config();

// Ejecuta la función que conecta con la base de datos MongoDB
connectDB();

// Crea la aplicación de Express
const app = express();

// Middleware que permite recibir datos en formato JSON en las peticiones
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://trakotask.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
  })
);

//rutas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorMiddleware);

// Define el puerto donde se ejecutará el servidor
// Primero intenta leer el puerto desde el archivo .env
// Si no existe usa el puerto 3000
const PORT = process.env.PORT || 3000;

// Define una ruta GET para la raíz "/"
// Cuando alguien entra a http://localhost:3000
// el servidor responde con este mensaje
app.get("/", (req, res) => {
  res.send("API Task Manager funcionando 🚀");
});

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
