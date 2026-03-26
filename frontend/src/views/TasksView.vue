p
<template>
  <div class="container">
    <div class="card">
      <div>
        <h1>📝 Mis tareasa</h1>

        <button class="logout" @click="logout">Cerrar sesión</button>

        <!-- Crear tarea -->
        <form @submit.prevent="createTask" class="form">
          <input v-model="newTask" placeholder="Nueva tarea..." class="input" />
          <button type="submit" class="btn">Agregar</button>
        </form>
        <br />

        <!-- Listar tareas -->
        <ul class="list">
          <li v-for="task in tasks" :key="task.id" class="task">
            <span :class="{ done: task.completed }">
              {{ task.title }}
            </span>

            <div class="actions">
              <!-- Completar tarea -->
              <button class="btn small" @click="toggleTask(task)">
                {{ task.completed ? 'Desmarcar' : 'Completar' }}
              </button>

              <!-- Eliminar -->
              <button class="btn danger small" @click="deleteTask(task._id)">Eliminar</button>
            </div>
          </li>
        </ul>

        <p v-if="tasks.length === 0" class="empty">No hay tareas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const tasks = ref([])
const router = useRouter()
const newTask = ref('')

//Obtener tareas
const fetchTasks = async () => {
  try {
    // Obtener token guardado
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:3000/api/tasks', {
      headers: {
        Authorization: token,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error('Error al obtener tareas')
    }

    tasks.value = data
  } catch (error) {
    console.error(error)
  }
}

// Crear tarea
const createTask = async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        title: newTask.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error()

    //agregar tarea al listado sin recargar
    tasks.value.unshift(data)

    //limpiar imput
    newTask.value = ''
  } catch (error) {
    console.error(error)
  }
}

//Completar / desmarcar
const toggleTask = async (task) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error()

    task.completed = data.completed
  } catch (error) {
    console.error(error)
  }
}

//Eliminar tarea
const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })

    if (!res.ok) throw new Error()

    tasks.value = tasks.value.filter((task) => task._id !== id)
  } catch (error) {
    console.error(error)
  }
}

//Logout
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// Protección y carga inicial
onMounted(() => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  fetchTasks()
})
</script>

<style>
body {
  justify-content: center;
  margin-top: 50px;
}

.container {
  margin-top: 50px;
}

.card {
  padding: 20px;
  width: 400px;
}

.form {
  margin-bottom: 20px;
}

.input {
  flex: 1;
}
</style>
