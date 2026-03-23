<template>
    <div>
        <h1>Login</h1>
        <hr>
        <br>
        <form @submit.prevent="handleLogin">
            <div>
                <label>Email</label>
                <br>
                <input v-model="email" type="email" required />
            </div>
            <br>
            <div>
                <label>Password</label>
                <br>
                <input v-model="password" type="password" required />
            </div>
            <br>
            <button type="submit">Ingresar</button>
        </form>

        <p v-if="error">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

const handleLogin = async () => {
  try {

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al loguear");
    }

    // Guardar token en localStorage
    localStorage.setItem("token", data.token);

    // Redirigir a tareas
    router.push("/tasks");

  } catch (err) {
    error.value = err.message;
  }
};

</script>