# 📝 Task Manager Full Stack

Aplicación full-stack de gestión de tareas desarrollada con JavaScript utilizando Node.js, Express y MongoDB.
El objetivo del proyecto es construir una API REST completa con autenticación de usuarios y operaciones CRUD para tareas, simulando una aplicación real utilizada en entornos profesionales.
Este proyecto forma parte de mi portfolio como desarrollador Full Stack.
🌐 Demo en vivo: https://taskmanagerproyect.netlify.app

---

# 📌 Estado del proyecto

✅ Backend completo y deployado
✅ Frontend funcional y deployado
✅ Autenticación JWT end-to-end
✅ CRUD de tareas con filtros
🔄 Mejoras futuras: drag & drop estilo Trello, notificaciones, UI con framework de componentes

---

# 📸 Preview

(agregar screenshots)

---

# 🚀 Tecnologías utilizadas

Backend

- Node.js
- Express
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- CORS

Frontend

- Vue 3
- Vue Router
- Pinia
- CSS global

Deploy

- Backend: Render
- Frontend: Netlify
- Base de datos: MongoDB (Atlas)

Herramientas

- Git / GitHub
- Postman
- VS Code

---

# 📌 Funcionalidades

⭐ Features destacadas

- Autenticación segura con JWT
- Encriptación de contraseñas con bcrypt
- API REST estructurada
- Middleware de autorización
- Filtros, búsqueda y paginación en tareas

Autenticación de usuarios

- Registro de usuario con email y contraseña
- Login con generación de token JWT
- Protección de rutas privadas con middleware
- Cierre de sesión

Gestión de tareas

- Crear tareas
- Ver tareas del usuario autenticado
- Marcar tareas como completadas
- Editar tareas
- Eliminar tareas

Cada tarea contiene:

- título
- descripción
- estado (pendiente / en progreso / completada)
- fecha de creación

---

# 🗂 Estructura del proyecto

task-manager/
│
├── backend/
│ ├── config/
│ │ └── database.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ └── Task.js
│ ├── routes/
│ │ ├── auth.js
│ │ └── tasks.js
│ ├── .env
│ ├── server.js
│ └── package.json
│
└── frontend/
│ └── src/
│ ├── assets/
│ │ └── styles.css
│ ├── router/
│ │ └── index.js
│ ├── views/
│ │ ├── LoginView.vue
│ │ ├── RegisterView.vue
│ │ └── TasksView.vue
│ ├── App.vue
│ └── main.js

---

# 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para manejar sesiones de usuario.

Flujo:

1. El usuario se registra o inicia sesión.
2. El servidor genera un token JWT.
3. El frontend guarda el token en localStorage.
4. Las peticiones protegidas envían el token en el header Authorization.
5. El middleware verifica el token antes de ejecutar la ruta

---

# 📡 API Endpoints

- Auth
  POST /api/auth/register
  POST /api/auth/login

- Tasks
  GET /api/tasks
  POST /api/tasks
  PUT /api/tasks/:id
  DELETE /api/tasks/:id

---

# 🛠 Instalación

- Clonar el repositorio

  git clone https://github.com/Chichompf82/task-manager.git

- Backend

  cd task-manager/backend
  npm install
  npm run dev

- Frontend
  cd task-manager/frontend
  npm install
  npm run dev

---

# 🔑 Variables de entorno

Crear archivo backend/.env:

PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=supersecretkey

---

# 📷 Futuras mejoras

- interfaz con framework moderno (Vue o React)
- drag & drop estilo Trello
- deploy en la nube
- notificaciones

---

# ⭐ Aspectos técnicos destacados

- API REST con arquitectura por capas (routes / middleware / models)
- Autenticación stateless con JWT
- Encriptación de contraseñas con bcrypt
- Protección de rutas en frontend con Vue Router guards
- CORS configurado correctamente para producción
- Deploy full-stack en servicios gratuitos (Render + Netlify + MongoDB Atlas)

# 👨‍💻 Autor

Mario Ferrario
Analista de Sistemas (en curso)
GitHub: https://github.com/Chichompf82
