<template>
    <q-select
      outlined
      v-model="fichaId"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      option-value="_id"
      option-label="nombre"
      label="Buscar Ficha"
      @filter="filterFn"
      style="width: 250px; padding-bottom: 32px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No hay resultados </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-table
      class="posicion"
      title="ASISTENCIA"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
    <template v-slot:body-cell-pdf="props">
    <a :href="`#/asistencia/${props.row.id}`" class="icon-pdf">
        📜
    </a>
</template>

    </q-table>
  
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>
  
        <q-card-section class="q-pt-none">
          <p>Codigo de ficha</p>
          <q-input
            dense
            v-model="inputCodigoFicha"
            autofocus
            @keydown="preventNonNumeric"
            @input="formatInputCodigoFicha"
            @keyup.enter="prompt = false"
          />
  
          <p>Nombre de Ficha</p>
          <q-input
            dense
            v-model="inputNombreFicha"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>
  
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cerrar" v-close-popup @click="validar()" />
  
          <q-btn flat label="Guardar Ficha" @click="validar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

  <style>
.icon-pdf{
    margin-left: 35%;
    cursor: pointer;
}
</style>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { onBeforeMount } from "vue";
  import { useQuasar } from "quasar";
  import { useFichaStore } from "../stores/Ficha.js";
  let inf = {};
  
  const prompt = ref(false);
  const inputCodigoFicha = ref("");
  const inputNombreFicha = ref("");
  const rows = ref([]);
  const loading = ref(false);
  
  let dialogTitle = ref("");
  let editando = ref(false);
  let fichaId = ref(null);
  let q$ = useQuasar();
  const options = ref([]);
  let useFicha = useFichaStore();
  
  const filterFn = (val, update, abort) => {
    update(() => {
      const needle = val.toLowerCase();
      options.value = rows.value.filter((ficha) =>
        ficha.nombre.toLowerCase().includes(needle)
      );
    });
  };
  
  onBeforeMount(() => {
    traer();
  });
  
  const traer = async () => {
    try {
      loading.value = true;
      inf = await axios.get(`http://localhost:5001/api/Fichas/listartodo`);
      console.log(inf);
      if (Array.isArray(inf.data)) {
        rows.value = inf.data;
        options.value = inf.data;
      } else {
        console.error("La respuesta no es un array:", inf.data);
        q$.notify({
          type: "negative",
          message: "Error al cargar las fichas.",
        });
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      q$.notify({
        type: "negative",
        message: "Error al conectar con el servidor.",
      });
    } finally {
      loading.value = false;
    }
  };
  
  const buscarFicha = async (id) => {
    try {
      loading.value = true;
      await useFicha.listarporids();
      traer();
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  
  const validar = async () => {
    if (!inputCodigoFicha.value || !inputNombreFicha.value) {
      q$.notify({
        type: "negative",
        message: "Rellena todos los campos.",
      });
      return;
    }
  
    try {
      loading.value = true;
      const token = localStorage.getItem("token");
      traer();
      prompt.value = false;
    } catch (error) {
      q$.notify({
        type: "negative",
        message: "Error al guardar la ficha.",
      });
    } finally {
      loading.value = false;
    }
  };
  
  const columns = ref([
    {
      name: "nombre1",
      required: true,
      label: "Nombre del programa",
      align: "center",
      field: "nombre",
      sortable: true,
    },
    {
      name: "codigo1",
      align: "center",
      label: "Numero de Ficha",
      field: "codigo",
      sortable: true,
    },
    {
    name: "pdf",
    align: "center",
    label: "PDF",
    field: "pdf",
    format: () => '📜', 
    sortable: false,
  }
  ]);
  </script>
  
  <style></style>
  