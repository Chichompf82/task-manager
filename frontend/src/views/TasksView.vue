p<template>
    <div>
        <h1>Mis taresa</h1>

        <button @click="logout">Cerrar sesión</button>

        <ul>
            <li v-for="task in tasks" :key="task.id">
                {{ task.title }} - 
                <strong>{{ task.completed ? "✔" : "❌" }}</strong>
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

const logout = () => {
    localStorage.removeItem("tpken");
    router.push("/login");
};

// Se ejecuta cuando carga la vista
onMounted(() => {
    fetchTasks();
});
</script>
