import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import TasksView from "../views/TasksView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView},
  { path: "/tasks", component: TasksView, meta: { requiresAuth: true}},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // si la ruta requiere auth y no hay token
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // si está logueado e intenta ir a login/registrarse
  if ((to.path === "/login" || to.path === "/register") && token) {
    return next("/tasks");
  }

  next();
});

export default router;


