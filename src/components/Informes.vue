<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
      <div class="filtros">
        <q-input 
          filled
          v-model="fechaBusqueda" 
          label="Seleccionar fecha" 
          type="date" 
          :disable="loading" 
        />

        <q-input 
          filled
          v-model="fichaBusqueda" 
          label="ID Ficha" 
          type="text" 
          :disable="loading" 
        />

      
<div id="divBtnBuscar">
        <q-btn 
        class="colorCorporativo" 
        :disable="loading" 
        @click="buscarBitacoras()">Buscar
        </q-btn>

</div></div>
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

    // Formatear la fecha correctamente
    const fechaFormatted = new Date(fechaBusqueda.value).toISOString().split('T')[0]; // Solo la fecha sin hora

    console.log("Parámetros:", {
      id_ficha: fichaBusqueda.value,
      fecha: fechaFormatted
    });
    {fichaBusqueda.value, fechaFormatted}
    const response = await useBitacora.listarPorFechaYFicha();

    if (response.errors) {
      throw new Error(response.errors[0].msg);
    }

    rows.value = response.data.bitacoras.map((bitacora) => ({
      ...bitacora,
      fecha: formatFecha(bitacora.fecha),
    }));
  } catch (error) {
    console.error('Detalles del error:', error.response);
    q$.notify({
      type: "negative",
      message: error.message || "Error al buscar las bitácoras.",
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
  gap: 5%;
  justify-content: center;
}

.filtro{
padding-inline: 10% !important;
}

#divBtnBuscar{
  align-content: center !important;
  justify-content: center !important;
  align-items: center !important;
  
}
</style>
