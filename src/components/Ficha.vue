<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
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
        pagination.sync="pagination"
        :rows-per-page-options="[20, 50, 100, 0]"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-btn color="green-8" @click="dialogo('crear')" label="Crear Ficha" />

      <q-table
        class="posicion"
        title="FICHAS"
        :rows="rows"
        :loading="loadingGeneral"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn
              color="green-8"
              @click="dialogo('editar', props.row)"
              :loading="loadingButtons[props.row._id]?.editar || false"
              >
              <font-awesome-icon icon="pen-to-square" />
            </q-btn>
            <q-btn
              @click="activar(props.row._id)"
              :loading="loadingButtons[props.row._id]?.activar || false"
              class="activar"
              v-if="props.row.estado === 0"
            >
              <font-awesome-icon
                icon="fa-solid fa-check"
                style="color: #ffffff"
              />
            </q-btn>
            <q-btn
              @click="desactivar(props.row._id)"
              :loading="loadingButtons[props.row._id]?.desactivar || false"
              class="desactivar"
              v-else
            >
              <font-awesome-icon icon="ban" style="color: #ffffff" />
            </q-btn>
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
              :disable="loading"
              autofocus
              @keydown="preventNonNumeric"
              @input="formatInputCodigoFicha"
              @keyup.enter="prompt = false"
            />

            <p>Nombre de Ficha</p>
            <q-input
              dense
              :disable="loadingGeneral"
              v-model="inputNombreFicha"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn 
            flat label="Cerrar" 
            v-close-popup 
            :loading="loadingButtons"
            @click="validar()" />

            <q-btn 
            flat 
            label="Guardar Ficha" 
            :loading="loadingButtons"
            @click="validar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useFichaStore } from "../stores/Ficha.js";
let inf = {};

const prompt = ref(false);
const inputCodigoFicha = ref("");
const inputNombreFicha = ref("");
const rows = ref([]);
const loadingGeneral = ref(false); 
const loadingButtons = ref({}); 

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
  loadingGeneral.value = true;
  try {
    inf = await useFicha.listarFichas();
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
    loadingGeneral.value = false;
  }
};

const buscarFicha = async (id) => {
  try {
    loadingGeneral.value = true;
    inf = await useFicha.listarporids(id);
    traer();
  } catch (error) {
    console.log(error);
  } finally {
    loadingGeneral.value = false;
  }
};

async function activar(id) {
  loadingButtons.value[id] = { ...loadingButtons.value[id], activar: true };
  try {
    inf = await useFicha.activar(id);
    traer();
  } catch (error) {
    console.log(error);
  } finally {
    loadingButtons.value[id] = { ...loadingButtons.value[id], activar: false };
  }
}

async function desactivar(id) {
  loadingButtons.value[id] = { ...loadingButtons.value[id], desactivar: true };
  try {
    inf = await useFicha.desactivar(id);
    traer();
  } catch (error) {
    console.log(error);
  } finally {
    loadingButtons.value[id] = { ...loadingButtons.value[id], desactivar: false };
  }
}

const validar = async () => {
  loadingGeneral.value = true;
  if (!inputCodigoFicha.value || !inputNombreFicha.value) {
    q$.notify({
      type: "negative",
      message: "Rellena todos los campos.",
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (editando.value) {
      await useFicha.actualizar(
        fichaId.value,
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
      await useFicha.crearFichas(
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
    loadingGeneral.value = false;
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
    loadingButtons.value[ficha._id] = { ...loadingButtons.value[ficha._id], editar: false };
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
  if (
    !/[\d]/.test(event.key) &&
    !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(
      event.key
    )
  ) {
    event.preventDefault();
  }
};

const formatInputCodigoFicha = (event) => {
  // Eliminar caracteres no numéricos del campo de entrada
  inputCodigoFicha.value = event.target.value.replace(/[^0-9]/g, "");
};
</script>

<style>
.activar, .desactivar{
  color: white;
}


</style>
