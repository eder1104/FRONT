<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
      <div class="filtros">
        <q-input v-model="fechaBusqueda" label="Seleccionar fecha" type="date" :disable="loading" />
        <q-input v-model="fichaBusqueda" label="ID Ficha" type="text" :disable="loading" />
        <q-btn color="green-8" :disable="loading" @click="buscarBitacoras">Buscar</q-btn>
      </div>

      <q-table
        title="INFORMES"
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
      </q-table>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useBitacoraStore } from "../stores/bitacora.js";

const rows = ref([]);
const columns = ref([
  {
    name: "cedulaAprendiz",
    required: true,
    label: "Cédula del Aprendiz",
    align: "center",
    field: "cedulaAprendiz",
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre del Aprendiz",
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
]);

const loading = ref(false);
const fichaBusqueda = ref('');
const fechaBusqueda = ref('');
const useBitacora = useBitacoraStore();
const q$ = useQuasar();

async function buscarBitacoras() {
  loading.value = true;
  try {
    if (!fechaBusqueda.value || !fichaBusqueda.value) {
      q$.notify({
        type: "warning",
        message: "Por favor ingrese tanto la fecha como el ID de la ficha.",
      });
      return;
    }

    const response = await useBitacora.listarPorFechaYFicha(fichaBusqueda.value, fechaBusqueda.value);
    
    rows.value = response.data.bitacoras.map((bitacora) => ({
      ...bitacora,
      fecha: formatFecha(bitacora.fecha),
    }));
  } catch (error) {
    q$.notify({
      type: "negative",
      message: "Error al buscar las bitácoras.",
    });
  } finally {
    loading.value = false;
  }
}

function formatFecha(fecha) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(fecha).toLocaleDateString("es-ES", options);
}
</script>

<style>
.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

#btnBuscar{
  position: relative;
  
}
</style>
