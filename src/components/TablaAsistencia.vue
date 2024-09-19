<template>
    <div>
      <h2>Registro de Asistencia</h2>
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombres y Apellidos</th>
            <th>No. Documento</th>
            <th>Dependencia/Empresa</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Firma</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ row.nombre }}</td>
            <td>{{ row.cedula }}</td>
            <td>{{ row.dependencia }}</td>
            <td>{{ row.correo }}</td>
            <td>{{ row.telefono }}</td>
            <td>{{ row.firma }}</td>
          </tr>
        </tbody>
      </table>
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
      // Solicitar bitácoras y aprendices
      const responseBitacoras = await useBitacora.listarBitacoraPorEstado("Asistió");
      const responseAprendices = await useAprendiz.listarAprendiz();
  
      // Validar que ambas respuestas existan y contengan datos
      if (responseBitacoras?.data?.bitacoras && responseAprendices?.data) {
        // Mapear los datos solo si están presentes
        rows.value = responseBitacoras.data.bitacoras.map(bitacora => {
          const aprendiz = responseAprendices.data.find(
            aprendiz => aprendiz._id === bitacora.id_aprendiz
          );
          return {
            nombre: aprendiz?.nombre || 'Desconocido',
            cedula: aprendiz?.documento || 'No disponible',
            dependencia: bitacora.dependencia || 'No disponible',
            correo: aprendiz?.email || 'No disponible',
            telefono: aprendiz?.telefono || 'No disponible',
            firma: bitacora.firma || 'No registrada',
          };
        });
      } else {
        console.error("Datos no disponibles");
      }
    } catch (error) {
      console.error("Error al traer los datos", error);
    }
  }
  </script>
  
  <style scoped>
  table {
    width: 100%;
    text-align: center;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid black;
  }
  </style>
  