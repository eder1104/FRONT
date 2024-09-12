<template>
  <div>
    <!-- Spinner visible cuando loading es true -->
    <div v-if="loading" class="spinner-container" :style="{ zIndex: 2 }">
      <q-spinner color="primary" size="3em" :thickness="2" />
    </div>

    <q-btn
      color="secondary"
      :disable="loading"
      @click="dialogo('crear')"
      label="Crear Bitacora"
      class="crear"
    />

    <q-dialog v-model="prompt" persistent :style="{ zIndex: 1 }">
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
            use-input
            fill-input
            @filter="filterFn"
            option-label="documento"
            option-value="_id"
            label="Seleccionar Aprendiz"
            autofocus
            :disable="loading"
          />
          <q-input label="nombre del aprendiz" type="text" :disable="loading">
          </q-input>
          <q-input v-model="fecha" label="Seleccionar fecha" type="date" :disable="loading">
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary1">
          <q-btn flat label="Cerrar" v-close-popup :disable="loading" />
          <q-btn flat label="Guardar Ficha" @click="validar()" :disable="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-table title="BITÁCORAS" :rows="rows" :columns="columns" row-key="name">
      <div><hr style="border: 1px solid black; width: 50%; margin: auto;">
      </div>
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-form>
            <q-select
              v-model="bitacora.estado"
              :options="estados"
              label="Estado"
              filled
              :disable="loading"
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

<style>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.7); /* Fondo semi-transparente */
  z-index: 2; /* Por encima de todo */
}

.crear{
  margin-bottom: 20px;
  margin-left: 20px;
}

.q-table__container div{
  display: flex;
  justify-content: center;
}

.q-table__container > div:first-child{
  border-bottom: rgb(0, 136, 11) 4px solid;
  padding: 2%;
}

.q-table--horizontal-separator thead th, .q-table--horizontal-separator tbody tr:not(:last-child) > td, .q-table--cell-separator thead th, .q-table--cell-separator tbody tr:not(:last-child) > td{
  border-bottom-width: 3px !important;
}

.q-table__top{
padding: 3px !important;
}
th.text-center{
  font-size: 15px !important;
  font-weight: bold !important;
  color: rgb(1, 87, 0);
}

td{
  padding: 2% !important;
}

</style>


<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useBitacoraStore } from "../stores/bitacora.js";
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from "../stores/Ficha.js";

onBeforeMount(() => {
  traer();
  cargarAprendices();
  cargarFichas();
});

const prompt = ref(false);
const selectedAprendiz = ref(null);
const fecha = ref(false);
const abrirCalendario = ref(false);
const selectedFicha = ref(null);
const aprendices = ref([]);
const fichas = ref([]);
const dialogTitle = ref("");
const bitacora = { estado: "Pendiente" };
const estados = ["Asistió", "No Asistió", "Excusa", "Pendiente"];
const q$ = useQuasar();
const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();
const rows = ref([]);
const columns = ref([
  {
    name: "cedulaAprendiz",
    required: true,
    label: "Cédula del Aprendiz",
    align: "center",
    field: "id_aprendiz",
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

const loading = ref(false);  // Estado para el spinner

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    const filtered = aprendices.value.filter((aprendiz) =>
      aprendiz.documento.toLowerCase().includes(needle)
    );
    aprendices.value = filtered;
  });
};


async function traer() {
  loading.value = true;  // Mostrar spinner
  try {
    const resultado = await useBitacora.listarTodo();

    rows.value = resultado.data.bitacoras.map((bitacora) => {
      const aprendiz = aprendices.value.find(
        (aprendiz) => aprendiz._id === bitacora.id_aprendiz
      );
      return {
        ...bitacora,
        id_aprendiz: aprendiz ? aprendiz.documento : "Desconocido", // Reemplaza el id_aprendiz con el documento
      };
    });

    console.log("Datos de las bitácoras:", rows.value);
  } finally {
    loading.value = false;  // Ocultar spinner
  }
}

async function cargarAprendices() {
  loading.value = true;  // Mostrar spinner
  try {
    const response = await useAprendiz.listarAprendiz();
    aprendices.value = response.data.map((aprendiz) => ({
      _id: aprendiz._id,
      documento: aprendiz.documento,
    }));
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al cargar los aprendices.",
    });
    console.error("Error al cargar los aprendices:", error);
  } finally {
    loading.value = false;  // Ocultar spinner
  }
}

async function cargarFichas() {
  loading.value = true;  // Mostrar spinner
  try {
    const response = await useFicha.listarFichas();
    fichas.value = response.data.map((ficha) => ({
      _id: ficha._id,
      nombre: ficha.nombre,
    }));
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al cargar las fichas.",
    });
    console.error("Error al cargar las fichas:", error);
  } finally {
    loading.value = false;  // Ocultar spinner
  }
}

const dialogo = (accion, bitacora = null) => {
  if (accion === "crear") {
    dialogTitle.value = "Crear Bitácora";
    selectedAprendiz.value = null;
    fecha.value = null;
  } else if (accion === "editar" && bitacora) {
    dialogTitle.value = "Editar Bitácora";
    selectedAprendiz.value =
      aprendices.value.find(
        (aprendiz) => aprendiz._id === bitacora.aprendizId
      ) || null;
    fecha.value = bitacora.fecha || null;
  }

  console.log(
    "Selected Aprendiz ID:",
    selectedAprendiz.value
      ? selectedAprendiz.value._id
      : "No se ha seleccionado ningún aprendiz"
  );
  console.log("Fecha seleccionada:", fecha.value);

  prompt.value = true;
};

const validar = async () => {
  if (!selectedAprendiz.value || !fecha.value) {
    q$.notify({
      type: "negative",
      message: "Rellena todos los campos.",
    });
    return;
  }

  loading.value = true;  // Mostrar spinner durante la validación
  try {
    if (dialogTitle.value === "Editar Bitácora") {
      await useBitacora.actualizar({
        aprendizId: selectedAprendiz.value,
        fecha: fecha.value,
      });
    } else {
      await useBitacora.crearBitacora({
        aprendizId: selectedAprendiz.value,
        fecha: fecha.value,
      });
    }
    await traer();
    prompt.value = false;  // Cerrar el diálogo
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al guardar la ficha.",
    });
    console.error(
      "Error al guardar la bitacora:",
      error.response ? error.response.data : error.message
    );
  } finally {
    loading.value = false;  // Ocultar spinner
  }
};
</script>

