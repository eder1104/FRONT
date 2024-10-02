<template>
  <div>
    <div class="table-container">
      <table class="responsive-table">
        <thead>
          <tr>
            <th colspan="11">REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No- {{ actaNumber }}  DEL DÍA {{ day }} DEL MES DE {{ nameMonth }} DEL AÑO {{ year }}</th>
          </tr>
          <tr>
            <th colspan="2">OBJETIVO (S)</th>
            <th colspan="9"></th>
          </tr>
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
          <tr v-for="(row, index) in displayedRows" :key="index">
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
            <td id="imagenFirma"><img :src="row.firma" alt="Firma" class="firma-imagen" /></td>
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

let day = ref("___");
let numberMonth = ref("___");
let nameMonth = ref("___");
let year = ref("___");

const months = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const actaNumber = ref("___");

const rows = ref([]);
const displayedRows = ref([]);

const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();

onBeforeMount(async () => {
  await traer();
  fillRemainingRows();
  obtenerFechaActual();
});

async function traer() {
  try {
    const responseBitacoras = await useBitacora.listarBitacoraPorEstado("Asistió");
    const responseAprendices = await useAprendiz.listarAprendiz();

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
        firma: aprendiz.firma || '',
      };
    });

    fillRemainingRows();
  } catch (error) {
    console.error(error);
  }
}

function fillRemainingRows() {
  displayedRows.value = rows.value.length >= 27 ? rows.value : rows.value.concat(
    Array(27 - rows.value.length).fill({
      nombre: '',
      cedula: '',
      planta: '',
      contratista: '',
      otro: '',
      dependencia: '',
      correo: '',
      telefono: '',
      autorizaGrabacion: '',
      firma: '',
    })
  );
}

function obtenerFechaActual() {
  const fecha = new Date();

  day.value = fecha.getDate();
  numberMonth.value = fecha.getMonth();
  nameMonth.value = months[fecha.getMonth()];
  year.value = fecha.getFullYear();

  console.log(fecha);

  return {
    day: day.value,
    numberMonth: numberMonth.value,
    nameMonth: nameMonth.value,
    year: year.value,
  };
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  width: 100%;
  padding: 1%;
}

.responsive-table {
  border-collapse: collapse;
  table-layout: auto;
  word-wrap: break-word;
}

.responsive-table th,
.responsive-table td {
  border: 1px solid #000000;
  text-align: center;
  font-size: 14px;
  padding: 10px;
}

.responsive-table td {
  padding: 7px !important;
}

.responsive-table th {
  font-weight: bold;
  padding: 10px;
}

.responsive-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

#imagenFirma {
  padding: 0px !important;
}

#imagenFirma img {
  height: 70px !important;
  padding: 0px !important;
}

/* Ajustes para tablets */
@media screen and (max-width: 1024px) {
  .responsive-table th,
  .responsive-table td {
    font-size: 13px;
    padding: 9px;
  }
}

/* Ajustes para pantallas medianas */
@media screen and (max-width: 768px) {
  .responsive-table th,
  .responsive-table td {
    font-size: 12px;
    padding: 8px;
  }

  .responsive-table th:nth-child(2),
  .responsive-table td:nth-child(2),
  .responsive-table th:nth-child(4),
  .responsive-table td:nth-child(4),
  .responsive-table th:nth-child(5),
  .responsive-table td:nth-child(5),
  .responsive-table th:nth-child(6),
  .responsive-table td:nth-child(6),
  .responsive-table th:nth-child(8),
  .responsive-table td:nth-child(8) {
    display: none; /* Ocultar columnas menos importantes en pantallas medianas */
  }
}

/* Ajustes para pantallas pequeñas (móviles) */
@media screen and (max-width: 480px) {
  .responsive-table th,
  .responsive-table td {
    font-size: 10px;
    padding: 6px;
  }

  .responsive-table th:nth-child(3),
  .responsive-table td:nth-child(3),
  .responsive-table th:nth-child(7),
  .responsive-table td:nth-child(7),
  .responsive-table th:nth-child(9),
  .responsive-table td:nth-child(9),
  .responsive-table th:nth-child(10),
  .responsive-table td:nth-child(10) {
    display: none; /* Ocultar más columnas en pantallas pequeñas */
  }

  .responsive-table th,
  .responsive-table td {
    word-wrap: break-word;
  }
}

/* Ajustes para pantallas extra pequeñas (menos de 400px) */
@media screen and (max-width: 400px) {
  .responsive-table th,
  .responsive-table td {
    font-size: 9px;
    padding: 4px;
  }

  /* Ocultar más columnas para ajustarse a pantallas muy pequeñas */
  .responsive-table th:nth-child(3),
  .responsive-table td:nth-child(3),
  .responsive-table th:nth-child(7),
  .responsive-table td:nth-child(7),
  .responsive-table th:nth-child(9),
  .responsive-table td:nth-child(9),
  .responsive-table th:nth-child(10),
  .responsive-table td:nth-child(10),
  .responsive-table th:nth-child(11),
  .responsive-table td:nth-child(11) {
    display: none;
  }
}

/* Estilos para impresión */
@media print {
  @page {
    size: letter; /* Tamaño carta */
    margin: 10mm; /* Márgenes de 10mm */
  }

  body {
    width: 100%; /* Asegura que el cuerpo se ajuste al ancho */
  }

  .table-container {
    width: 100%;
    overflow: visible;
    margin: 0;
  }

  .responsive-table {
    width: 100%; /* Asegura que la tabla ocupe el 100% del ancho */
    border-collapse: collapse;
    font-size: 8px; /* Tamaño de fuente más pequeño */
  }

  .responsive-table th,
  .responsive-table td {
    padding: 4px; /* Reduce el padding de las celdas */
    border: 1px solid black; /* Bordes de la tabla */
    word-wrap: break-word; /* Permite que el texto se ajuste */
  }

  #imagenFirma img {
    max-height: 20px; /* Reduce el tamaño de la firma */
    width: auto;
  }

  /* Ajustes adicionales para impresión */
  th:nth-child(2),
  td:nth-child(2),
  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(5),
  td:nth-child(5),
  th:nth-child(6),
  td:nth-child(6),
  th:nth-child(8),
  td:nth-child(8) {
    display: table-cell; /* Asegura que las columnas ocultas en pantallas se muestren al imprimir */
  }

  /* Ajustes para ocultar elementos innecesarios al imprimir */
  /* Agregar más reglas aquí si es necesario */
}
</style>
