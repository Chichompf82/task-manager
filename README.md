# 📝 Task Manager Full Stack

Aplicación full-stack de gestión de tareas desarrollada con Vue 3, Node.js, Express y MongoDB.
El objetivo del proyecto es construir una API REST completa con autenticación de usuarios, roles, validaciones profesionales y un tablero Kanban interactivo con drag & drop.
Este proyecto forma parte de mi portfolio como desarrollador Full Stack.
🌐 Demo en vivo: https://taskmanagerproyect.netlify.app

---

## 📌 Estado del proyecto

- ✅ Backend completo con validaciones y manejo de errores
- ✅ Roles de usuario (user / admin)
- ✅ Tablero Kanban con drag & drop
- ✅ UI con Vuetify 3
- ✅ Deploy full-stack funcionando

---

## 📸 Preview

(agregar screenshots)

---

## 🚀 Tecnologías utilizadas

**Backend**

- Node.js
- Express
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- express-validator
- CORS

**Frontend**

- Vue 3
- Vue Router
- Pinia
- Vuetify 3 (Material Design)
- vuedraggable (drag & drop)

**Deploy**

- Backend: Render
- Frontend: Netlify
- Base de datos: MongoDB (Atlas)

**Herramientas**

- Git / GitHub
- Postman
- VS Code

---

## 📌 Funcionalidades

⭐ Features destacadas

- Autenticación segura con JWT
- Encriptación de contraseñas con bcrypt
- API REST estructurada
- Middleware de autorización
- Filtros, búsqueda y paginación en tareas

**Autenticación de usuarios**

- Registro de usuario con email y contraseña
- Login con generación de token JWT
- Protección de rutas privadas con middleware
- Cierre de sesión

**Roles de usuario**

- user: accede y gestiona sus propias tareas
- admin: accede a todas las tareas de todos los usuarios

**Gestión de tareas (tablero Kanban)**

- Crear tareas con título y descripción
- Tres estados: Pendiente / En proceso / Completada
- Drag & drop entre columnas para cambiar el estado
- Editar tareas
- Eliminar tareas con confirmación
- Loader mientras cargan los datos
- Toasts de notificación en cada acción

**Validaciones profesionales**

- Validaciones en backend con express-validator
- Errores mostrados por campo en el frontend
- Manejo global de errores con clase AppError

**Cada tarea contiene:**

- título
- descripción
- estado (pendiente / en progreso / completada)
- fecha de creación

---

## 🗂 Estructura del proyecto

task-manager/
│
├── backend/
│ ├── config/
│ │ └── database.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── adminMiddleware.js
│ │ ├── validateMiddleware.js
│ │ └── errorMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ └── Task.js
│ ├── routes/
│ │ ├── auth.js
│ │ └── tasks.js
│ ├── utils/
│ │ └── AppError.js
│ ├── validators/
│ │ ├── authValidators.js
│ │ └── taskValidators.js
│ ├── .env
│ ├── server.js
│ └── package.json
│
└── frontend/
└── src/
├── assets/
│ └── styles.css
├── router/
│ └── index.js
├── views/
│ ├── LoginView.vue
│ ├── RegisterView.vue
│ └── TasksView.vue
├── App.vue
└── main.js

---

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para manejar sesiones de usuario.

**Flujo:**

1. El usuario se registra o inicia sesión
2. El servidor valida los datos con `express-validator`
3. El servidor genera un token JWT con el ID y rol del usuario
4. El frontend guarda el token en `localStorage`
5. Las rutas protegidas envían el token en el header `Authorization: Bearer TOKEN`
6. El middleware verifica el token antes de ejecutar cada ruta

---

## 📡 API Endpoints

**Auth**

```
POST /api/auth/register
POST /api/auth/login
```

**Tasks** _(requieren autenticación)_

```
GET    /api/tasks
GET    /api/tasks?search=texto&page=1&limit=5
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

**Admin** _(requieren rol admin)_

```
GET /api/tasks/admin/all
```

---

## ⭐ Aspectos técnicos destacados

- API REST con arquitectura por capas (routes / middleware / models / validators / utils)
- Autenticación stateless con JWT incluyendo rol de usuario
- Encriptación de contraseñas con bcrypt
- Validaciones profesionales con `express-validator` y errores por campo
- Manejo global de errores con clase `AppError` y middleware centralizado
- Tablero Kanban con drag & drop usando `vuedraggable`
- Actualización optimista del estado al arrastrar tarjetas
- UI construida con Vuetify 3 (Material Design)
- Protección de rutas en frontend con Vue Router guards
- CORS configurado correctamente para producción
- Deploy full-stack en servicios gratuitos (Render + Netlify + MongoDB Atlas)

---

## 🛠 Instalación local

**Requisitos previos**

- Node.js v18 o superior
- npm v9 o superior
- MongoDB (local) o una cuenta en MongoDB Atlas

**Clonar el repositorio**

```bash
git clone https://github.com/Chichompf82/task-manager.git
cd task-manager
```

**Backend**

```bash
cd backend
npm install       # instala Express, Mongoose, JWT, bcrypt, express-validator y demás
npm run dev
```

**Frontend**

```bash
cd frontend
npm install       # instala Vue 3, Vuetify, Vue Router, Pinia, vuedraggable y demás
npm run dev
```

**Variables de entorno**

Crear archivo `backend/.env`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=supersecretkey
NODE_ENV=development
```

# 👨‍💻 Autor

## 👨‍💻 Autor

**Mario Ferrario**
Analista de Sistemas (en curso)
GitHub: [https://github.com/Chichompf82](https://github.com/Chichompf82)
