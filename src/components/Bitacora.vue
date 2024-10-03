<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
      <p><b>Fecha Actual:</b> {{ dia }} de {{ mesNombre }} del {{ anio }}</p>
      <div class="botones">
<<<<<<< HEAD
=======
      <p><b>Fecha Actual:</b> {{ dia }} de {{ mesNombre }} del {{ anio }}</p>
      <div class="botones">
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
        <q-btn
          :disable="loading"
          @click="dialogo('crear')"
          label="Crear Bitacora"
          class="crear colorCorporativo"
<<<<<<< HEAD
=======
          class="crear colorCorporativo"
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
        />
        <q-btn :disable="loading" class="crearPDF colorCorporativo" to="/Tabla">
          <font-awesome-icon icon="file-invoice" style="color: #ffffff" />
        </q-btn>
      </div>
      <br />
      <q-dialog v-model="prompt" persistent :style="{ zIndex: 1000 }">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h5 tituloCuadroDeDialogo">{{ dialogTitle }}</div>
          </q-card-section>
<<<<<<< HEAD
=======
        <q-btn :disable="loading" class="crearPDF colorCorporativo" to="/Tabla">
          <font-awesome-icon icon="file-invoice" style="color: #ffffff" />
        </q-btn>
      </div>
      <br />
      <q-dialog v-model="prompt" persistent :style="{ zIndex: 1000 }">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h5 tituloCuadroDeDialogo">{{ dialogTitle }}</div>
          </q-card-section>
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927

          <q-select
            filled
            clearable
            v-model="selectedAprendiz"
            :options="aprendices"
            use-input
            option-label="documento"
            option-value="_id"
            label="Seleccionar Aprendiz"
            autofocus
            :disable="loading"
            
          >
          
            <template v-slot:prepend>
              <font-awesome-icon icon="user-graduate" />
            </template>
          </q-select>

          <q-input
            filled
            v-model="fecha"
            label="Seleccionar fecha"
            type="date"
            :disable="loading"
          >
            <template v-slot:prepend>
              <font-awesome-icon icon="spell-check" />
            </template>
          </q-input>

          <q-card-actions align="right" class="text-primary1">
            <q-btn flat v-close-popup class="btnCerrar" :disable="loading">
              <font-awesome-icon
                icon="fa-solid fa-circle-xmark"
                style="margin-right: 5px"
              />
              Cerrar
            </q-btn>
            <q-btn
              flat
              class="btnGuardar"
              @click="validar"
              :loading="loading"
              :disable="loading"
            >
              <font-awesome-icon
                icon="fa-solid fa-floppy-disk"
                style="margin-right: 5px"
              />
              Guardar Bitacora
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
<<<<<<< HEAD
=======
              Guardar Bitacora
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927

      <q-table
        title="BITÁCORAS"
        :rows="rows"
        :columns="columns"
        row-key="name"
        pagination.sync="pagination"
        :rows-per-page-options="[20, 50, 100, 0]"
        :loading="loading"
      >
        <div>
          <hr style="border: 1px solid black; width: 50%; margin: auto" />
        </div>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-form>
              <q-select
                v-model="props.row.estado"
                :options="estados"
                label="Estado"
                filled
                :disable="loading"
                @update:model-value="
                  (valor) => cambiarEstado(props.row._id, valor)
                "
              />
            </q-form>
          </q-td>
        </template>
      </q-table>
<<<<<<< HEAD
=======
      <q-table
        title="BITÁCORAS"
        :rows="rows"
        :columns="columns"
        row-key="name"
        pagination.sync="pagination"
        :rows-per-page-options="[20, 50, 100, 0]"
        :loading="loading"
      >
        <div>
          <hr style="border: 1px solid black; width: 50%; margin: auto" />
        </div>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-form>
              <q-select
                v-model="props.row.estado"
                :options="estados"
                label="Estado"
                filled
                :disable="loading"
                @update:model-value="
                  (valor) => cambiarEstado(props.row._id, valor)
                "
              />
            </q-form>
          </q-td>
        </template>
      </q-table>
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useBitacoraStore } from "../stores/bitacora.js";
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from "../stores/Ficha.js"

onBeforeMount(() => {
  traer();
  cargarAprendices();
  obtenerFechaActual();
<<<<<<< HEAD
=======
  obtenerFechaActual();
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
});

let dia = ref(null);
let mesNumero = ref(null);
let mesNombre = ref(null);
let anio = ref(null);

const meses = ref([
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre,",
  "Noviembre",
  "Diciembre",
]);
<<<<<<< HEAD
const prompt = ref(false);
const loading = ref(false);
const selectedAprendiz = ref(null);
const fecha = ref(null);
=======
let dia = ref(null);
let mesNumero = ref(null);
let mesNombre = ref(null);
let anio = ref(null);

const meses = ref([
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre,",
  "Noviembre",
  "Diciembre",
]);
const prompt = ref(false);
const loading = ref(false);
const loading = ref(false);
const selectedAprendiz = ref(null);
const fecha = ref(null);
const fecha = ref(null);
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
const aprendices = ref([]);
const dialogTitle = ref("");
const q$ = useQuasar();
const estados = ref(["Asistió", "No Asistió", "Pendiente", "Excusa"]);
<<<<<<< HEAD
=======
const estados = ref(["Asistió", "No Asistió", "Pendiente", "Excusa"]);
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();
const rows = ref([]);
const columns = ref([
  {
    name: "cedulaAprendiz",
    required: true,
    label: "Cédula del Aprendiz",
    align: "center",
    field: "cedulaAprendiz",
<<<<<<< HEAD
=======
    field: "cedulaAprendiz",
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre del Aprendiz",
<<<<<<< HEAD
=======
    label: "Nombre del Aprendiz",
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
    align: "center",
    field: "nombre",
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
    label: "Estado",
<<<<<<< HEAD
=======
    label: "Estado",
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
    align: "center",
    sortable: true,
  },
]);

async function traer() {
  loading.value = true;
<<<<<<< HEAD
  try {
    let response = await useBitacora.listarTodo();
    let response2 = await useAprendiz.listarAprendiz();
=======
  loading.value = true;
  try {
    let response = await useBitacora.listarTodo();
    let response2 = await useAprendiz.listarAprendiz();
    let response = await useBitacora.listarTodo();
    let response2 = await useAprendiz.listarAprendiz();
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927

    rows.value = response.data.bitacoras.map((bitacora) => {
      let aprendiz = response2.data.find(
        (aprendiz) => aprendiz?._id === bitacora?.id_aprendiz
<<<<<<< HEAD
=======
    rows.value = response.data.bitacoras.map((bitacora) => {
      let aprendiz = response2.data.find(
        (aprendiz) => aprendiz?._id === bitacora?.id_aprendiz
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
      );
      return {
        ...bitacora,
        cedulaAprendiz: aprendiz?.documento || "No disponible",
        nombre: aprendiz?.nombre || "Desconocido",
        fecha: formatFecha(bitacora?.fecha || new Date()),
<<<<<<< HEAD
=======
        cedulaAprendiz: aprendiz?.documento || "No disponible",
        nombre: aprendiz?.nombre || "Desconocido",
        fecha: formatFecha(bitacora?.fecha || new Date()),
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
      };
    });
  } finally {
    loading.value = false;
  }
}

function obtenerFechaActual() {
  const fecha = new Date();

  dia = fecha.getDate();
  mesNumero = fecha.getMonth();
  mesNombre.value = meses.value[fecha.getMonth()];
  anio = fecha.getFullYear();

  console.log(fecha);

  return {
    día: dia,
    mesNumero: mesNumero,
    mesNombre: mesNombre,
    año: anio,
  };
<<<<<<< HEAD
=======
    loading.value = false;
  }
}

function obtenerFechaActual() {
  const fecha = new Date();

  dia = fecha.getDate();
  mesNumero = fecha.getMonth();
  mesNombre.value = meses.value[fecha.getMonth()];
  anio = fecha.getFullYear();

  console.log(fecha);

  return {
    día: dia,
    mesNumero: mesNumero,
    mesNombre: mesNombre,
    año: anio,
  };
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
}

async function cargarAprendices() {
  loading.value = true;
<<<<<<< HEAD
=======
  loading.value = true;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
  try {
    const response = await useAprendiz.listarAprendiz();
    
    aprendices.value = response.data.map((aprendiz) => ({
      _id: aprendiz._id,
      documento: `${aprendiz.documento} - ${aprendiz.nombre}`,
    }));
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al cargar los aprendices.",
    });
    console.error("Error al cargar los aprendices:", error);
  } finally {
    loading.value = false;
<<<<<<< HEAD
=======
    loading.value = false;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
  }
}

const cambiarEstado = async (id, estado) => {
  try {
    loading.value = true;
    await useBitacora.actualizarEstado(id, estado);
    await traer();
<<<<<<< HEAD
  } catch (error) {
    console.error("Error al cambiar estado:", error);
  } finally {
    loading.value = false;
=======
const cambiarEstado = async (id, estado) => {
  try {
    loading.value = true;
    await useBitacora.actualizarEstado(id, estado);
    await traer();
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    console.error("Error al cambiar estado:", error);
  } finally {
    loading.value = false;
    loading.value = false;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
  }
};

function formatFecha(fecha) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(fecha).toLocaleDateString("es-ES", options);
<<<<<<< HEAD
=======
};

function formatFecha(fecha) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(fecha).toLocaleDateString("es-ES", options);
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
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

  loading.value = true;
<<<<<<< HEAD
=======
  loading.value = true;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
  try {
    const bitacoraData = {
      id_aprendiz: selectedAprendiz.value,
      fecha: fecha.value,
    };

<<<<<<< HEAD
    if (dialogTitle.value === "Editar Bitácora") {
      await useBitacora.actualizar(bitacoraData);
    } else {
      await useBitacora.crearBitacora(bitacoraData);
    }

    await traer();
    prompt.value = false;
=======
    const bitacoraData = {
      id_aprendiz: selectedAprendiz.value,
      fecha: fecha.value,
    };

    if (dialogTitle.value === "Editar Bitácora") {
      await useBitacora.actualizar(bitacoraData);
      await useBitacora.actualizar(bitacoraData);
    } else {
      await useBitacora.crearBitacora(bitacoraData);
      await useBitacora.crearBitacora(bitacoraData);
    }


    await traer();
    prompt.value = false;
    prompt.value = false;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al guardar la bitácora.",
<<<<<<< HEAD
=======
      message: "Error al guardar la bitácora.",
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
    });
    console.error(
      "Error al guardar la bitacora:",
      error.response ? error.response.data : error.message
    );
  } finally {
    loading.value = false;
<<<<<<< HEAD
=======
    loading.value = false;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
  }
};
</script>

<style>
.botones {
  display: flex !important;
  justify-content: space-between !important;
  align-items: end !important;
<<<<<<< HEAD
=======
.botones {
  display: flex !important;
  justify-content: space-between !important;
  align-items: end !important;
>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
}

.q-table__container div {
  display: flex;
  justify-content: center;
}

.q-table__container > div:first-child {
  border-bottom: rgb(0, 136, 11) 4px solid;
  padding: 2%;
}

.q-table--horizontal-separator thead th,
.q-table--horizontal-separator tbody tr:not(:last-child) > td,
.q-table--cell-separator thead th,
.q-table--cell-separator tbody tr:not(:last-child) > td {
  border-bottom-width: 3px !important;
}

.q-table__top {
  padding: 3px !important;
}

<<<<<<< HEAD
=======

>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
th.text-center {
  font-size: 15px !important;
  font-weight: bold !important;
  color: rgb(1, 87, 0);
}

td {
  padding: 2% !important;
}
</style>
<<<<<<< HEAD
=======

>>>>>>> 2ef81a3edd1843fa3de05ddb684fbc906b39d927
