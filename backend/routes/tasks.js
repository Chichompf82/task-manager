//Importamos express
const express = require("express");

//Importamos el modelo Task
const Task = require("../models/Task");
const AppError = require("../utils/AppError");

//Importamos validasiones y meddleware
const { taskValidation } = require("../validators/taskValidators");
const validate = require("../middleware/validateMiddleware");

//Importamos el meddleware de autenticcacion
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Creamos el router de Express
const router = express.Router();

// =================================================================
// RUTA SOLO PARA ADMIN: VER TAREAS DE TODOS LOS USUARIOS
// =================================================================
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      // un admin puede ver las tareas de todos
      const tasks = await Task.find().populate("user", "email role");
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

// ==============================
// OBTENER TAREAS DEL USUARIO
// ==============================

// Devuelve todas las tareas del usuario logueado
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const filter = {
      user: req.user.id,
      title: { $regex: search, $options: "i" },
    };

    //Buscamos tareas de usuario logueado
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //Devolvemos tareas en JSON
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// ==============================
// CREAR TAREA
// ==============================

router.post(
  "/",
  authMiddleware,
  taskValidation,
  validate,
  async (req, res, next) => {
    try {
      //Obtenemos el titulo, descripción y estado desde el body
      const { title, description, status } = req.body;

      //Creamos una nueva tarea
      const task = new Task({
        title,
        description,
        status: status || "pendiente",
        //Asociamo la tarea al usuario logueado
        user: req.user.id,
      });

      //Guardamos la tarea en MongoDB
      await task.save();

      //Devolvemos la tarea creada
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// ==============================
// ACTUALIZAR TAREA
// ==============================

// prettier-ignore
router.put("/:id", authMiddleware, taskValidation, validate, async (req, res, next) => {
  try {
    // Buscaos la tarea por ID
    const task = await Task.findById(req.params.id);

    //Si no existe
    if (!task) {
      throw new AppError("Tarea no encontrada", 404);
    }

    // Verificamos que la tarea pertenesca al usuario
    if (task.user.toString() !== req.user.id) {
      throw new AppError("No autorizado", 403);
    }

    // Actualizar el título
    task.title = req.body.title ?? task.title;
    // Actualizar la descripción
    task.description = req.body.description ?? task.description;
    // Actualizamos el estado
    task.status = req.body.status ?? task.status;

    //Guardar cambios
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// ==============================
// ELIMINAR TAREA
// ==============================

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    // Buscamos la tarea
    const task = await Task.findById(req.params.id);

    //Si no existe
    if (!task) {
      throw new AppError("Tarea no encontrada", 404);
    }

    if (task.user.toString() !== req.user.id) {
      throw new AppError("No autorizado", 403);
    }

    // Eliminamos la tarea
    await task.deleteOne();

    res.json({
      message: "Tarea eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
});

//Exportamos el router
module.exports = router;
