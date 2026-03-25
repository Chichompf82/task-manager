p<template>
    <div>
        <h1>Mis taresa</h1>

        <button @click="logout">Cerrar sesión</button>
        <br>
        <br>

        <!-- Crear tarea -->
        <form @submit.prevent="createTask">
            <input v-model="newTask" placeholder="Nueva tarea..." />
            <button type="submit">Agregar</button>
        </form>
        <br>

        <!-- Listar tareas -->
        <ul>
            <li v-for="task in tasks" :key="task.id">
                {{ task.title }}
                <strong>{{ task.completed ? "✔" : "❌" }}</strong>

                <!-- Completar tarea -->
                <button @click="toggleTask(task)">
                    {{ task.completed ? "Desmarcar" : "Completar" }}
                </button>

                <!-- Eliminar -->
                <button @click="deleteTask(task._id)">
                    Eliminar
                </button>
            </li>
        </ul>

        <p v-if="tasks.lenth === 0">No hay tareas</p>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const tasks = ref([]);
const router = useRouter();
const newTask = ref("");

//Obtener tareas
const fetchTasks = async () => {
    try {

        // Obtener token guardado
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/tasks" , {
            headers: {
                Authorization: token
             
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error("Error al obtener tareas");
        }

        tasks.value = data;

    } catch (error) {
        console.error(error);
    }
};

// Crear tarea
const createTask = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/tasks", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                title: newTask.value
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error();

        //agregar tarea al listado sin recargar
        tasks.value.unshift(data);

        //limpiar imput
        newTask.value = "";

    } catch (error) {
        console.error(error);
    }
};

//Completar / desmarcar
const toggleTask = async (task) => {
    try{
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error();

        task.completed = data.completed;

    }catch (error) {
        console.error(error);
    }
};

//Eliminar tarea
const deleteTask = async (id) => {
    try{
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token
            }
        });

        if (!res.ok) throw new Error();

        tasks.value = tasks.value.filter(task => task._id !== id);

    }catch (error) {
        console.error(error);
    }
};

//Logout
const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
};

// Protección y carga inicial
onMounted(() => {
    const token = localStorage.getItem("token")

    if (!token) {
        router.push("/login");
        return;
    }

    fetchTasks();
});
</script>
