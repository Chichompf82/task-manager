<template>
  <div class="container">
    <div class="card">
      <h1>🔐 Iniciar sesión</h1>

      <form @submit.prevent="handleLogin" class="form">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Contraseña" class="input" required />
        <button type="submit" class="btn">Ingresar</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="link">
        ¿No tenés cuenta?
        <span @click="goToRegister">Registrarse</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      /* const res = await fetch('https://task-manager-lux2.onrender.com/api/auth/login', { */
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error al loguear')
    }

    // Guardar token en localStorage
    localStorage.setItem('token', data.token)

    // Redirigir a tareas
    router.push('/tasks')
  } catch (err) {
    error.value = err.message
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>
