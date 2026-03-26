<template>
  <div class="container">
    <div class="card">
      <h1>📝 Registro</h1>

      <form @submit.prevent="handleRegister" class="form">
        <input v-model="email" type="email" placeholder="Email" class="input" required />

        <input v-model="password" type="password" placeholder="Contraseña" class="input" required />

        <button type="submit" class="btn">Registrarse</button>
      </form>

      <p class="link">
        ¿Ya tenés cuenta?
        <span @click="goToLogin">Iniciar sesión</span>
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

const handleRegister = async () => {
  try {
    /* const res = await fetch('http://localhost:3000/api/auth/register', { */
    const res = await fetch('https://task-manager-lux2.onrender.com/api/auth/register', {
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
      throw new Error(data.message || 'Error en el registro')
    }

    //guardar token
    localStorage.setItem('token', data.token)

    //redirigir
    router.push('/tasks')
  } catch (err) {
    error.value = err.message
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>
