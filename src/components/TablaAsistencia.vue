<template>
    <div>
      <h2>Registro de Asistencia</h2>
      <table border="1" cellpadding="10" cellspacing="0">
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

            <!-- <th>No.</th>
            <th>Nombres y Apellidos</th>
            <th>No. Documento</th>
            <th>Dependencia/Empresa</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Firma</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td>{{ index + 1 }}</td>
          <td> <p>{{ row.nombre }}</p> </td>
          <td> <p>{{ row.cedula }}</p> </td>
          <td> <p>{{ row.planta }}</p> </td>
          <td> <p>{{ row.contratista }}</p> </td>
          <td> <p>{{ row.otro }}</p> </td>
          <td> <p>{{ row.dependencia }}</p> </td>
          <td> <p>{{ row.correo }}</p> </td>
          <td> <p>{{ row.telefono }}</p> </td>
          <td> <p>{{ row.autorizaGrabacion }}</p> </td>
          <td> <p>{{ row.firma }}</p> </td>
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
  table {
    width: 100%;
    text-align: center;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid black;
  }
  </style>
  