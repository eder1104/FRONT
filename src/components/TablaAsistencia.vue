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

let day = ref("___");
let numberMonth =ref("___")
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

const actaNumber = ref("___")

const rows = ref([]);
const displayedRows = ref([]);

const useBitacora = useBitacoraStore();

onBeforeMount(() => {
  traerBitacorasFiltradas(); 
  fillRemainingRows();
  obtenerFechaActual();
});

function traerBitacorasFiltradas() {
  // Aquí obtenemos las bitácoras filtradas que ya están en el store
  rows.value = useBitacora.bitacorasFiltradas
  .filter(bitacora => bitacora.estado === "Asistió")  // Filtra por el estado "Asistió"
  .map((bitacora) => ({
    nombre: bitacora.id_aprendiz?.nombre || "",
    cedula: bitacora.id_aprendiz?.documento || "",
    planta: "",
    contratista: "",
    otro: "",
    dependencia: "",
    correo: bitacora.id_aprendiz?.email || "",
    telefono: bitacora.id_aprendiz?.telefono || "",
    autorizaGrabacion: "",
    firma: bitacora.id_aprendiz?.firma || "",
  }));

    fillRemainingRows();

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

  day = fecha.getDate();
  numberMonth = fecha.getMonth();
  nameMonth.value = months[fecha.getMonth()];
  year = fecha.getFullYear();

  console.log(fecha);

  return {
    day: day,
    numberMonth: numberMonth,
    nameMonth: nameMonth,
    year: year,
  };
}
</script>

<style scoped>

.table-container {
  overflow-x: auto;
  width: 100%;padding: 1%;
}

.responsive-table {
  border-collapse: collapse;
  table-layout: auto;
  /* white-space: nowrap;   */
  word-wrap: break-word;
}

.responsive-table th, .responsive-table td {
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

#imagenFirma img{
  height: 70px !important;
  padding: 0px !important;
}

/* Ajustes para tablets */
@media screen and (max-width: 1024px) {
  .responsive-table th, .responsive-table td {
    font-size: 13px;
    padding: 9px;
  }
}

/* Ajustes para pantallas medianas */
@media screen and (max-width: 768px) {
  .responsive-table th, .responsive-table td {
    font-size: 12px;
    padding: 8px;
  }
  
  .responsive-table th:nth-child(2), .responsive-table td:nth-child(2),
  .responsive-table th:nth-child(4), .responsive-table td:nth-child(4),
  .responsive-table th:nth-child(5), .responsive-table td:nth-child(5),
  .responsive-table th:nth-child(6), .responsive-table td:nth-child(6),
  .responsive-table th:nth-child(8), .responsive-table td:nth-child(8) {
    display: none; /* Ocultar columnas menos importantes en pantallas medianas */
  }
}

/* Ajustes para pantallas pequeñas (móviles) */
@media screen and (max-width: 480px) {
  .responsive-table th, .responsive-table td {
    font-size: 10px;
    padding: 6px;
  }

  .responsive-table th:nth-child(3), .responsive-table td:nth-child(3),
  .responsive-table th:nth-child(7), .responsive-table td:nth-child(7),
  .responsive-table th:nth-child(9), .responsive-table td:nth-child(9),
  .responsive-table th:nth-child(10), .responsive-table td:nth-child(10) {
    display: none; /* Ocultar más columnas en pantallas pequeñas */
  }
  
  .responsive-table th, .responsive-table td {
    word-wrap: break-word;
  }
}

/* Ajustes para pantallas extra pequeñas (menos de 400px) */
@media screen and (max-width: 400px) {
  .responsive-table th, .responsive-table td {
    font-size: 9px;
    padding: 4px;
  }

  /* Ocultar más columnas para ajustarse a pantallas muy pequeñas */
  .responsive-table th:nth-child(3), .responsive-table td:nth-child(3),
  .responsive-table th:nth-child(7), .responsive-table td:nth-child(7),
  .responsive-table th:nth-child(9), .responsive-table td:nth-child(9),
  .responsive-table th:nth-child(10), .responsive-table td:nth-child(10),
  .responsive-table th:nth-child(11), .responsive-table td:nth-child(11) {
    display: none;
  }
  @media print {

  .table-container {
    overflow: visible;
    width: 100%;
    padding: 0;
  }

  .responsive-table {
    table-layout: fixed;
    width: 100%;
  }

  .responsive-table th,
  .responsive-table td {
    font-size: 12px;
    word-wrap: break-word;
    padding: 5px;
  }

  .responsive-table th:nth-child(4),
  .responsive-table td:nth-child(4),
  .responsive-table th:nth-child(5),
  .responsive-table td:nth-child(5),
  .responsive-table th:nth-child(6),
  .responsive-table td:nth-child(6) {
    display: none;
  }
}
}

</style>
