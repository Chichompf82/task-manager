<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="5" lg="4">
            <v-card rounded="lg" elevation="3" class="pa-4">
              <v-card-title class="text-center pt-6 pb-2">
                <v-icon size="40" color="primary" class="mb-2">mdi-account-plus</v-icon>
                <div class="text-h5 font-weight-bold">Crear cuenta</div>
              </v-card-title>
              <v-card-subtitle class="text-center pb-4">
                Registrate para empezar a usar Trako
              </v-card-subtitle>
              <v-card-text>
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :error-messages="errors.email"
                />

                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  density="comfortable"
                  :error-messages="errors.password"
                  hint="Entre 8 y 15 caracteres"
                  persistent-hint
                />

                <v-alert
                  v-if="errorMessage"
                  type="error"
                  variant="tonal"
                  class="mt-3"
                  density="compact"
                >
                  {{ errorMessage }}
                </v-alert>
              </v-card-text>

              <v-card-actions class="flex-column px-4 pb-6">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  block
                  :loading="loading"
                  @click="handleRegister"
                >
                  Crear cuenta
                </v-btn>

                <div class="text-center mt-4 text-body-2">
                  ¿Ya tenés cuenta?
                  <span class="text-primary font-weight-medium cursor-pointer" @click="goToLogin">
                    Iniciar sesión
                  </span>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({ email: '', password: '' })
/* const url = 'http://localhost:3000/api/auth/' // url local */
const url = 'https://task-manager-lux2.onrender.com/api/auth/' // url web

const router = useRouter()

const handleRegister = async () => {
  errorMessage.value = ''
  errors.value = { email: '', password: '' }
  loading.value = true

  try {
    const res = await fetch(url + 'register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      // errores de validación por campo
      if (data.errors) {
        data.errors.forEach((err) => {
          if (errors.value[err.field] !== undefined) {
            errors.value[err.field] = err.message
          }
        })
        return
      }
      // error general (usuario ya existe, etc)
      errorMessage.value = data.message || 'Error al registrarse'
      return
    }

    localStorage.setItem('token', data.token)
    router.push('/tasks')
  } catch (err) {
    errorMessage.value = 'No se pudo conectar con el servidor'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>
