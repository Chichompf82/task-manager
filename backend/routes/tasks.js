//Importamos express
const express = require("express");

//Importamos el modelo Task
const Task = require("../models/Task");

//Importamos el meddleware de autenticcacion
const authMiddlewere = require("../middleware/authMiddleware");

// Creamos el router de Express
const router = express.Router();

// ==============================
// OBTENER TODAS LAS TAREAS
// ==============================

// Devuelve todas las tareas del usuario logueado
router.get("/", authMiddlewere, async (req, res) => {
  try {
    //Buscamos tareas de usuario logueado
    const tasks = await Task.find({ user: req.user.id });

    //Devolvemos tareas en JSON
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener tareas",
    });
  }
});

// ==============================
// CREAR TAREA
// ==============================

router.post("/", authMiddlewere, async (req, res) => {
  try {
    //Obtenemos el titulo desde el body
    const { title } = req.body;

    //Creamos una nueva tarea
    const task = new Task({
      //Titulo enviado por el usuario
      title,

      //Asociamo la tarea al usuario logueado
      user: req.user.id,
    });

    //Guardamos la tarea en MongoDB
    await task.save();

    //Devolvemos la tarea creada
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear tarea",
    });
  }
});

// ==============================
// ACTUALIZAR TAREA
// ==============================

router.put("/:id", authMiddlewere, async (req, res) => {
  try {
    // Buscaos la tarea por ID
    const task = await Task.findById(req.params.id);

    //Si no existe
    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    // Verificamos que la tarea pertenesca al usuario
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // Actualizar el estado de completado
    task.completed = req.body.completed ?? task.completed;

    // Actualizar el título
    task.title = req.body.title ?? task.title;

    //Guardar cambios
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar tarea",
    });
  }
});

// ==============================
// ELIMINAR TAREA
// ==============================

router.delete("/:id", authMiddlewere, async (req, res) => {
  try {
    // Buscamos la tarea
    const task = await Task.findById(req.params.id);

    //Si no existe
    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    // Eliminamos la tarea
    await task.deleteOne();

    res.json({
      message: "Tarea eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar tarea",
    });
  }
});

// ==============================
// OBTENER TAREAS (con filtros)
// ==============================

router.get("/", authMiddlewere, async (req, res) => {
  try {
    // Página actual (default = 1)
    const page = parseInt(req.quiry.page) || 1;

    // Cantidad por página (default = 5)
    const limit = parseInt(req.query.limit) || 5;

    // Texto de búsqueda
    const search = req.query.search || "";

    // Campo de ordenamiento
    const sort = req.query.sort || "createdAt";

    // Saltar documentos para paginación
    const skip = (page - 1) * limit;

    // Crear filtro de búsqueda
    const filtar = {
      user: req.user.id,
      title: { $regex: search, $options: "i" },
    };

    // Buscar tareas
    const tasks = await Task.find(filter)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(limit);

    res.json(tasks);
  } catch (erro) {
    res._construct.status(500).json({
      error: "Error al obtener tarea",
    });
  }
});

//Exportamos el router
module.exports = router;
