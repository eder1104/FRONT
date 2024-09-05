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
            use-input
            fill-input
            @filter="filterFn"
            option-label="documento"
            option-value="_id"
            label="Seleccionar Aprendiz"
            autofocus
          />
          <q-input v-model="fecha" label="Seleccionar fecha" readonly>
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="abrirCalendario = true"
              />
            </template>
          </q-input>

          <q-popup-proxy
            v-model="abrirCalendario"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="fecha" mask="YYYY-MM-DD" />
          </q-popup-proxy>
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
          <q-form>
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
import { useFichaStore } from "../stores/Ficha.js";

onBeforeMount(() => {
  traer();
  cargarAprendices();
  cargarFichas();
});

const prompt = ref(false);
const selectedAprendiz = ref(null);
const fecha = ref(null);
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
    label: "Cedula del Aprendiz",
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

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    const filtered = aprendices.value.filter((aprendiz) =>
      aprendiz.documento.toLowerCase().includes(needle)
    );
    aprendices.value = filtered;
  });
};

// async function traer() {
//   const resultado = await useBitacora.listarTodo();
//   rows.value = resultado.data.bitacoras;
//   console.log("Datos de las bitácoras:", rows.value);
// }




async function traer() {
  const resultado = await useBitacora.listarTodo();
  
  // Si ya has cargado los aprendices y están en `aprendices.value`
  rows.value = resultado.data.bitacoras.map(bitacora => {
    const aprendiz = aprendices.value.find(aprendiz => aprendiz._id === bitacora.id_aprendiz);
    return {
      ...bitacora,
      id_aprendiz: aprendiz ? aprendiz.documento : 'Desconocido',  // Reemplaza el id_aprendiz con el documento
    };
  });

  console.log("Datos de las bitácoras:", rows.value);
}





async function cargarAprendices() {
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
  }
}

async function cargarFichas() {
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
  }
}

const dialogo = (accion, bitacora = null) => {
  if (accion === "crear") {
    dialogTitle.value = "Crear Bitácora";
    selectedAprendiz.value = null;
    fecha.value = null;
  } else if (accion === "editar" && bitacora) {
    dialogTitle.value = "Editar Bitácora";
    // Asegúrate de que `bitacora.aprendizId` sea el valor correcto
    selectedAprendiz.value = aprendices.value.find(
      (aprendiz) => aprendiz._id === bitacora.aprendizId
    ) || null;
    fecha.value = bitacora.fecha || null;
  }

  console.log(
    "Selected Aprendiz ID:",
    selectedAprendiz.value ? selectedAprendiz.value._id : "No se ha seleccionado ningún aprendiz"
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

  try {
    // const token = localStorage.getItem("token");

    if (dialogTitle.value === "Editar Bitácora") {
      await useBitacora.actualizar(),
        {
          aprendizId: selectedAprendiz.value,
          fecha: fecha.value,
        };
    } else {
      await useBitacora.crearBitacora(),
        {
          aprendizId: selectedAprendiz.value,
          fecha: fecha.value,
        };
    }
    await traer();
    prompt.value = false;
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al guardar la ficha.",
    });
    console.error(
      "Error al guardar la bitacora:",
      error.response ? error.response.data : error.message
    );
  }
};
</script>

<style></style>
