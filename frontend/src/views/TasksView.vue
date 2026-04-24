<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <!-- NAVBAR -->
      <v-app-bar color="primary" elevation="2">
        <v-app-bar-title>
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Task Manager
        </v-app-bar-title>
        <v-spacer />
        <v-btn variant="text" color="white" prepend-icon="mdi-logout" @click="logout">
          Cerrar sesión
        </v-btn>
      </v-app-bar>

      <v-container fluid class="pa-6">
        <!-- BOTÓN NUEVA TAREA -->
        <v-row class="mb-4">
          <v-col>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
              Nueva tarea
            </v-btn>
          </v-col>
        </v-row>

        <!-- LOADER -->
        <v-row v-if="loading" justify="center" class="mt-10">
          <v-progress-circular indeterminate color="primary" size="50" />
        </v-row>

        <!-- TABLEROS KANBAN -->
        <v-row v-else>
          <v-col v-for="column in columns" :key="column.status" cols="12" md="4">
            <!-- encabezado de columna -->
            <div class="d-flex align-center mb-3">
              <v-icon :color="column.color" class="mr-2">{{ column.icon }}</v-icon>
              <span class="text-subtitle-1 font-weight-bold">{{ column.label }}</span>
              <v-chip :color="column.color" size="small" class="ml-2">
                {{ tasksByStatus(column.status).length }}
              </v-chip>
            </div>

            <!-- zona de drop -->
            <draggable
              :list="tasksByStatus(column.status)"
              group="tasks"
              item-key="_id"
              class="drag-area"
              @change="(evt) => onDragChange(evt, column.status)"
            >
              <template #item="{ element }">
                <v-card class="mb-3 task-card" rounded="lg" elevation="1">
                  <v-card-text class="pb-2">
                    <div class="text-subtitle-2 font-weight-bold mb-1">
                      {{ element.title }}
                    </div>
                    <div v-if="element.description" class="text-body-2 text-medium-emphasis">
                      {{ element.description }}
                    </div>
                  </v-card-text>

                  <v-card-actions class="pt-0 px-3 pb-2">
                    <v-spacer />
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditDialog(element)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      color="error"
                      @click="confirmDelete(element)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>

              <!-- mensaje cuando la columna está vacía -->
              <template #footer>
                <div
                  v-if="tasksByStatus(column.status).length === 0"
                  class="empty-column text-center text-medium-emphasis text-body-2 pa-4"
                >
                  Sin tareas
                </div>
              </template>
            </draggable>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- DIALOG CREAR / EDITAR TAREA -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="lg">
        <v-card-title class="pa-4">
          {{ editingTask ? 'Editar tarea' : 'Nueva tarea' }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="form.title"
            label="Título"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :error-messages="formErrors.title"
          />

          <v-textarea
            v-model="form.description"
            label="Descripción (opcional)"
            variant="outlined"
            density="comfortable"
            rows="3"
            no-resize
          />

          <v-select
            v-model="form.status"
            label="Estado"
            :items="statusOptions"
            variant="outlined"
            density="comfortable"
            class="mt-3"
          />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" :loading="saving" @click="saveTask">
            {{ editingTask ? 'Guardar cambios' : 'Crear tarea' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG CONFIRMAR ELIMINACIÓN -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="pa-4">¿Eliminar tarea?</v-card-title>
        <v-card-text>
          Esta acción no se puede deshacer. ¿Querés eliminar
          <strong>{{ taskToDelete?.title }}</strong
          >?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="deleteTask">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR (toasts) -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom right"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

const router = useRouter()
const tasks = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editingTask = ref(null)
const taskToDelete = ref(null)

const form = ref({ title: '', description: '', status: 'pendiente' })
const formErrors = ref({ title: '' })

const snackbar = ref({ show: false, message: '', color: 'success' })

// configuración de las tres columnas
const columns = [
  { status: 'pendiente', label: 'Pendiente', color: 'warning', icon: 'mdi-clock-outline' },
  { status: 'en-proceso', label: 'En proceso', color: 'info', icon: 'mdi-progress-clock' },
  { status: 'completada', label: 'Completada', color: 'success', icon: 'mdi-check-circle-outline' },
]

const statusOptions = [
  { title: 'Pendiente', value: 'pendiente' },
  { title: 'En proceso', value: 'en-proceso' },
  { title: 'Completada', value: 'completada' },
]

// devuelve las tareas filtradas por estado
const tasksByStatus = (status) => {
  return tasks.value.filter((t) => t.status === status)
}

const showSnackbar = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}

const token = () => localStorage.getItem('token')

// ==============================
// CARGAR TAREAS
// ==============================
const fetchTasks = async () => {
  loading.value = true
  try {
    /* const res = await fetch('http://localhost:3000/api/tasks', { */
    const res = await fetch('https://task-manager-lux2.onrender.com/api/task', {
      headers: { Authorization: `Bearer ${token()}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error()
    tasks.value = data
  } catch {
    showSnackbar('Error al cargar las tareas', 'error')
  } finally {
    loading.value = false
  }
}

// ==============================
// ABRIR DIALOGS
// ==============================
const openCreateDialog = () => {
  editingTask.value = null
  form.value = { title: '', description: '', status: 'pendiente' }
  formErrors.value = { title: '' }
  dialog.value = true
}

const openEditDialog = (task) => {
  editingTask.value = task
  form.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
  }
  formErrors.value = { title: '' }
  dialog.value = true
}

const confirmDelete = (task) => {
  taskToDelete.value = task
  deleteDialog.value = true
}

// ==============================
// GUARDAR TAREA (crear o editar)
// ==============================
const saveTask = async () => {
  formErrors.value = { title: '' }
  saving.value = true

  try {
    const url = editingTask.value
      ? /* ? `http://localhost:3000/api/tasks/${editingTask.value._id}` */
        `https://task-manager-lux2.onrender.com/api/task/${editingTask.value._id}`
      : /* : 'http://localhost:3000/api/tasks' */
        'https://task-manager-lux2.onrender.com/api/task'

    const method = editingTask.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(form.value),
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.errors) {
        data.errors.forEach((err) => {
          if (formErrors.value[err.field] !== undefined) {
            formErrors.value[err.field] = err.message
          }
        })
        return
      }
      throw new Error(data.message)
    }

    if (editingTask.value) {
      // actualizar la tarea en el array local
      const index = tasks.value.findIndex((t) => t._id === data._id)
      if (index !== -1) tasks.value[index] = data
      showSnackbar('Tarea actualizada correctamente')
    } else {
      tasks.value.unshift(data)
      showSnackbar('Tarea creada correctamente')
    }

    dialog.value = false
  } catch (err) {
    showSnackbar(err.message || 'Error al guardar la tarea', 'error')
  } finally {
    saving.value = false
  }
}

// ==============================
// ELIMINAR TAREA
// ==============================
const deleteTask = async () => {
  deleting.value = true
  try {
    /* const res = await fetch(`http://localhost:3000/api/tasks/${taskToDelete.value._id}`, { */
    const res = await fetch(
      `https://task-manager-lux2.onrender.com/api/task/${taskToDelete.value._id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      },
    )

    if (!res.ok) throw new Error()

    tasks.value = tasks.value.filter((t) => t._id !== taskToDelete.value._id)
    deleteDialog.value = false
    showSnackbar('Tarea eliminada correctamente')
  } catch {
    showSnackbar('Error al eliminar la tarea', 'error')
  } finally {
    deleting.value = false
  }
}

// ==============================
// DRAG & DROP
// ==============================
const onDragChange = async (evt, newStatus) => {
  // solo nos interesa cuando se agrega una tarea a una columna
  if (!evt.added) return

  const task = evt.added.element

  // si el estado no cambió no hacemos nada
  if (task.status === newStatus) return

  // actualizamos optimistamente en el frontend antes de esperar al backend
  const index = tasks.value.findIndex((t) => t._id === task._id)
  if (index !== -1) tasks.value[index].status = newStatus

  try {
    /* const res = await fetch(`http://localhost:3000/api/tasks/${task._id}`, { */
    const res = await fetch(`https://task-manager-lux2.onrender.com/api/task/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify({ ...task, status: newStatus }),
    })

    if (!res.ok) throw new Error()

    showSnackbar('Estado actualizado')
  } catch {
    // si falla, revertimos el cambio recargando desde el backend
    showSnackbar('Error al actualizar el estado', 'error')
    fetchTasks()
  }
}

// ==============================
// LOGOUT
// ==============================
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  const t = localStorage.getItem('token')
  if (!t) {
    router.push('/login')
    return
  }
  fetchTasks()
})
</script>

<style scoped>
.drag-area {
  min-height: 200px;
  border-radius: 8px;
  padding: 4px;
  transition: background 0.2s;
}

.drag-area:empty {
  background: rgba(0, 0, 0, 0.03);
}

.task-card {
  cursor: grab;
}

.task-card:active {
  cursor: grabbing;
}

.empty-column {
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
