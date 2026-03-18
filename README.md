# Task Manager Full Stack

Aplicación **full-stack de gestión de tareas** desarrollada con JavaScript utilizando Node.js, Express y MongoDB.

El objetivo del proyecto es construir una API REST completa con autenticación de usuarios y operaciones CRUD para tareas, simulando una aplicación real utilizada en entornos profesionales.

Este proyecto forma parte de mi portfolio como desarrollador Full Stack.

---

# 🚀 Tecnologías utilizadas

Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* bcrypt

Frontend

* HTML
* CSS
* JavaScript

Herramientas

* Git
* GitHub
* Postman

---

# 📌 Funcionalidades

Autenticación de usuarios

* Registro de usuario
* Login con email y contraseña
* Generación de token JWT
* Protección de rutas privadas

Gestión de tareas

* Crear tareas
* Ver tareas del usuario
* Editar tareas
* Eliminar tareas

Cada tarea contiene:

* título
* descripción
* estado (pendiente / en progreso / completada)
* fecha de creación

---

# 🗂 Estructura del proyecto

task-manager

backend
│
├── config
│   └── database.js
├── models
│   ├── User.js
│   └── Task.js
├── routes
│   ├── auth.js
│   └── tasks.js
├── middleware
│   └── authMiddleware.js
|
├── .env
├── server.js
└── package.json

frontend
│
├── index.html
├── login.html
├── app.js
└── styles.css

---

# 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para manejar sesiones de usuario.

Flujo:

1. El usuario se registra o inicia sesión.
2. El servidor genera un token JWT.
3. El frontend guarda el token.
4. Las peticiones protegidas envían el token en el header.

---

# 📡 API Endpoints

Auth

POST /api/auth/register
POST /api/auth/login

Tasks

GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

---

# 🛠 Instalación

Clonar el repositorio

git clone https://github.com/Chichompf82/task-manager.git

Entrar en la carpeta

cd task-manager

Instalar dependencias

npm install

Ejecutar servidor

npm run dev

---

🔑 Variables de entorno

Crear archivo .env:

PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=supersecretkey

---

# 📷 Futuras mejoras

* interfaz con framework moderno (Vue o React)
* drag & drop estilo Trello
* deploy en la nube
* notificaciones

---

# 👨‍💻 Autor

Mario Ferrario

Analista de Sistemas (en curso)

GitHub: https://github.com/Chichompf82
