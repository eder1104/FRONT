<template>
  <div>
    <div class="b_registro">
      <img src="https://diseodesoftwareblog.wordpress.com/wp-content/uploads/2016/03/5e090-logo_sena.png?w=356&h=330" alt="" class="LOG_sena">
      <h2 class="registro">Registro de Asistencia</h2>
    </div>
    <div class="table-container">
      <table class="responsive-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombres y Apellidos</th>
            <th>No. Documento</th>
            <th>Planta</th>
            <th>Contratista</th>
            <th>Otro ¿Cuál?</th>
            <th>Dependencia/Empresa</th>
            <th>Correo Electrónico</th>
            <th>Teléfono/Ext. SENA</th>
            <th>Autoriza Grabación</th>
            <th>Firma o Participación Virtual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ row.nombre }}</td>
            <td>{{ row.cedula }}</td>
            <td>{{ row.planta }}</td>
            <td>{{ row.contratista }}</td>
            <td>{{ row.otro }}</td>
            <td>{{ row.dependencia }}</td>
            <td>{{ row.correo }}</td>
            <td>{{ row.telefono }}</td>
            <td>{{ row.autorizaGrabacion }}</td>
            <td>{{ row.firma }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useBitacoraStore } from "../stores/bitacora";
import { useAprendizStore } from "../stores/aprendiz";

const rows = ref([]);

const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();

onBeforeMount(async () => {
  await traer();
});

async function traer() {
  try {
    const responseBitacoras = await useBitacora.listarBitacoraPorEstado("Asistió");
    const responseAprendices = await useAprendiz.listarAprendiz();

    console.log('aprendices', responseAprendices);
    console.log('Bitacorás "Asistió"', responseBitacoras);

    rows.value = responseBitacoras.data.bitacora.map(bitacora => {
      const aprendiz = responseAprendices.data.find(
        aprendiz => aprendiz._id === bitacora.id_aprendiz
      );
      return {
        nombre: aprendiz.nombre || '',
        cedula: aprendiz.documento || '',
        planta: '',
        contratista: '',
        otro: '',
        dependencia: '',
        correo: aprendiz.email || '',
        telefono: aprendiz.telefono || '',
        autorizaGrabacion: '',
        firma: '',
      };
    });
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  padding: 3%;

}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  word-wrap: break-word;
}

.responsive-table th, .responsive-table td {
  border: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

.responsive-table td {
  padding: 7px !important;

}

.responsive-table th {
  background-color: #f4f4f4;
  font-weight: bold;
    padding: 10px;

}

.responsive-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

@media screen and (max-width: 768px) {
  .responsive-table th, .responsive-table td {
    font-size: 12px;
    padding: 8px;
  }
  
  .responsive-table th:nth-child(2), .responsive-table td:nth-child(2),
  .responsive-table th:nth-child(4), .responsive-table td:nth-child(4),
  .responsive-table th:nth-child(5), .responsive-table td:nth-child(5),
  .responsive-table th:nth-child(6), .responsive-table td:nth-child(6) {
    display: none; /* Oculta columnas menos importantes en pantallas pequeñas */
  }
}

@media screen and (max-width: 480px) {
  .responsive-table th, .responsive-table td {
    font-size: 10px;
    padding: 6px;
  }
  
  .responsive-table th, .responsive-table td {
    word-wrap: break-word;
  }
}

.b_registro {
  display: flex;
  align-items: center;
  padding-inline: 3%;
}

.LOG_sena {
  width: 100px;
}

.registro {
  font-size: 30px;
  margin-left: 20px;
}
</style>
