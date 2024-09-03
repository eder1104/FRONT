<template>
  <div>
    <q-btn color="secondary" @click="dialogo('crear')" label="Crear Bitacora" />

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>ID de aprendiz</p>
          <q-select
            dense
            v-model="selectedAprendiz"
            :options="aprendices"
            option-label="cedula"
            option-value="_id"
            label="Seleccionar Aprendiz"
            autofocus
          />

          <p>Ficha del aprendiz</p>
          <q-select
            dense
            v-model="selectedFicha"
            :options="fichas"
            option-label="nombre"
            option-value="_id"
            label="Seleccionar Ficha"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cerrar" v-close-popup />
          <q-btn flat label="Guardar Ficha" @click="validar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-table title="Bitacoras" :rows="rows" :columns="columns" row-key="name">
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-form @submit.prevent="submitForm">
            <q-select
              v-model="bitacora.estado"
              :options="estados"
              label="Estado"
              filled
            />
          </q-form>
        </q-td>
      </template>
      <template v-slot:body-cell-estado1="props">
        <q-td :props="props">
          <p style="color: green" v-if="props.row.estado == 1">Activo</p>
          <p style="color: red" v-else>Inactivo</p>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useBitacoraStore } from "../stores/bitacora.js";
import { useAprendizStore } from "../stores/aprendiz.js";

const prompt = ref(false);
const selectedAprendiz = ref(null);
const selectedFicha = ref(null);
const aprendices = ref([]);
const fichas = ref([]);
const dialogTitle = ref("");

const bitacora = { estado: "Pendiente" };
const estados = ["Asistió", "No Asistió", "Excusa", "Pendiente"];

const q$ = useQuasar();
const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();

const columns = ref([
  {
    name: "cedulaAprendiz",
    required: true,
    label: "Cedula del Aprendiz",
    align: "center",
    field: "documento",
    sortable: true,
  },
  {
    name: "fecha1",
    align: "center",
    label: "Fecha",
    field: "fecha",
    sortable: true,
  },
  {
    name: "opciones",
    label: "Opciones",
    align: "center",
    sortable: true,
  },
]);

const rows = ref([]);

onBeforeMount(() => {
  traer()
  cargarAprendices();
  cargarFichas();
});

async function traer() {
  const resultado = await useBitacora.listarTodo();
  rows.value = resultado.data;
}

async function cargarAprendices() {
  try {
    const response = await axios.get("http://localhost:5001/api/Aprendices/listartodo");
    aprendices.value = response.data.map(aprendiz => ({
      _id: aprendiz._id,
      cedula: aprendiz.documento,
    }));
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al cargar los aprendices.",
    });
    console.error("Error al cargar los aprendices:", error);
  }
}

async function cargarFichas() {
  try {
    const response = await axios.get("http://localhost:5001/api/Fichas/listartodo");
    fichas.value = response.data.map(ficha => ({
      _id: ficha._id,
      nombre: ficha.nombre,
    }));
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al cargar las fichas.",
    });
    console.error("Error al cargar las fichas:", error);
  }
}

const dialogo = (accion, ficha = null) => {
  if (accion === "crear") {
    dialogTitle.value = "Crear Bitácora";
    selectedAprendiz.value = null;
    selectedFicha.value = null;
  } else if (accion === "editar" && ficha) {
    dialogTitle.value = "Editar Bitácora";
    selectedAprendiz.value = ficha.aprendizId;
    selectedFicha.value = ficha.fichaId;
  }
  prompt.value = true;
};

const validar = async () => {
  if (!selectedAprendiz.value || !selectedFicha.value) {
    q$.notify({
      type: "negative",
      message: "Rellena todos los campos.",
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (dialogTitle.value === "Editar Bitácora") {
      await axios.put(
        `http://localhost:5001/api/Fichas/actualizarficha/${selectedFicha.value}`,
        {
          aprendizId: selectedAprendiz.value,
          fichaId: selectedFicha.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post(
        "http://localhost:5001/api/Fichas/crearficha",
        {
          aprendizId: selectedAprendiz.value,
          fichaId: selectedFicha.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    await traer();
    prompt.value = false;
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al guardar la ficha.",
    });
    console.error("Error al guardar la bitacora:", error.response ? error.response.data : error.message);
  }
};
</script>

<style></style>
