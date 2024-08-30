<template>
    <div>
      <q-btn color="secondary" @click = "prompt=true" label="Crear Aprendiz" />
        <q-table title="Aprendices" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn color="primary" @click="prompt = true">📝</q-btn>
              <q-btn @click="activar(props.row._id)" v-if="props.row.estado == 0">✅</q-btn>
              <q-btn @click="desactivar(props.row._id)" v-else>❌</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-estado1="props">
            <q-td :props="props">
              <p style="color: green" v-if="props.row.estado == 1">Activo</p>
              <p style="color: red" v-else>Inactivo</p>
            </q-td>
          </template>
        </q-table>

        <q-dialog v-model="prompt" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Editar Aprendiz</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p>Nombre del Aprendiz</p>
              <q-input dense v-model="inputNombreAprendiz" autofocus @keyup.enter="prompt = false" />
              <p>Documento del Aprendiz</p>
              <q-input dense v-model="inputDocumentoAprendiz" autofocus @keyup.enter="prompt = false" />
              <p>Telefono del Aprendiz</p>
              <q-input dense v-model="inputTelefonoAprendiz" autofocus @keyup.enter="prompt = false" />
              <p>Email del Aprendiz</p>
              <q-input dense v-model="inputEmailAprendiz" autofocus @keyup.enter="prompt = false" />
              
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cerrar" v-close-popup @click="validar()" />

              <q-btn flat label="Guardar Aprendiz" v-close-popup @click="crear()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useAprendizStore } from "../stores/aprendiz.js";
let inf = ref();



const prompt = ref(false);
const inputNombreAprendiz = ref("");
const inputDocumentoAprendiz = ref("");
const inputTelefonoAprendiz = ref("");
const inputEmailAprendiz = ref("");

let useAprendiz = useAprendizStore();
onBeforeMount(() => {
  traer();
});

async function traer () {
  const inf = await useAprendiz.listarAprendiz()
    rows.value = inf.data;
};

async function crear () {
  const inf = await useAprendiz.crearaprendiz(
    inputNombreAprendiz.value.trim(),
    inputDocumentoAprendiz.value.trim(),
    inputTelefonoAprendiz.value.trim(),
    inputEmailAprendiz.value.trim(),
  )
  traer()
};

async function editar () {
  const inf = await useAprendiz.crearaprendiz(
    inputNombreAprendiz.value.trim(),
    inputDocumentoAprendiz.value.trim(),
    inputTelefonoAprendiz.value.trim(),
    inputEmailAprendiz.value.trim(),
  )
  traer()
};

async function activar(id) {
  const inf = await useAprendiz.activaraprendiz(id)
  traer()
}

async function desactivar(id) {
  const inf = await useAprendiz.desactivaraprendiz(id)
  traer()
}

const columns = ref([
  {
    name: "nombre1",
    required: true,
    label: "Nombre del Aprendiz",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "documento1",
    align: "center",
    label: "Documento del Aprendiz",
    field: "documento",
    sortable: true,
  },
  {
    name: "telefono1",
    align: "center",
    label: "Telefono del Aprendiz",
    field: "telefono",
    sortable: true,
  },
  {
    name: "email1",
    align: "center",
    label: "Email del Aprendiz",
    field: "email",
    sortable: true,
  },
  {
    name: "estado1",
    label: "Estado",
    align: "center",
    field: "estado",
    sortable: true,
  },
  {
    name: "opciones",
    label: "Opciones",
    align: "center",
    sortable: true,
  },
]);

const rows = ref([]);

const validar = () => {
  if (!inputNombreAprendiz.value) {
    $q.notify({
      type: "negative",
      message: "Rellena todos los campos.",
    });
  }
};
</script>

<style>

</style>
