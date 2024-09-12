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

  <q-btn color="secondary" @click="dialogo('crear')" label="Crear Ficha" />

  <q-table
    class="posicion"
    title="Fichas"
    :rows="rows"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:body-cell-opciones="props">
      <q-td :props="props">
        <q-btn color="primary" @click="dialogo('editar', props.row)">📝</q-btn>
        <q-btn @click="activar(props.row._id)" class="activar" v-if="props.row.estado == 0"
          >✅</q-btn
        >
        <q-btn @click="desactivar(props.row._id)" class="desactivar" v-else>❌</q-btn>
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
    inf = await axios.get(`http://localhost:5001/api/Fichas/listarporid/${id}`);
    traer();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

async function activar(id) {
  console.log(id);
  try {
    loading.value = true;
    inf = await axios.put(
      `http://localhost:5001/api/Fichas/activarficha/${id}`
    );
    traer();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function desactivar(id) {
  console.log(id);
  try {
    loading.value = true;
    inf = await axios.put(
      `http://localhost:5001/api/Fichas/desactivarficha/${id}`
    );
    traer();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

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

    if (editando.value) {
      await axios.put(
        `http://localhost:5001/api/Fichas/actualizarficha/${fichaId.value}`,
        {
          codigo: inputCodigoFicha.value,
          nombre: inputNombreFicha.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post(
        "http://localhost:5001/api/Fichas/crearficha",
        {
          codigo: inputCodigoFicha.value,
          nombre: inputNombreFicha.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
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

const dialogo = (accion, ficha = null) => {
  if (accion === "crear") {
    dialogTitle.value = "Crear ficha";
    inputCodigoFicha.value = "";
    inputNombreFicha.value = "";
    editando.value = false;
  } else if (accion === "editar" && ficha) {
    dialogTitle.value = "Editar Ficha";
    inputCodigoFicha.value = ficha.codigo;
    inputNombreFicha.value = ficha.nombre;
    fichaId.value = ficha._id;
    editando.value = true;
  }
  prompt.value = true;
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

const preventNonNumeric = (event) => {
  // Permitir solo números y teclas de control (backspace, delete, arrows)
  if (!/[\d]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(event.key)) {
    event.preventDefault();
  }
};

const formatInputCodigoFicha = (event) => {
  // Eliminar caracteres no numéricos del campo de entrada
  inputCodigoFicha.value = event.target.value.replace(/[^0-9]/g, '');
};

</script>

<style></style>
