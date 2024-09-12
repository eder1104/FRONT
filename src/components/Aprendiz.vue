<template>
  <div>
    <q-btn color="secondary" @click="abrirDialogo()" label="Crear Aprendiz" />
    <q-table title="Aprendices" :rows="rows" :columns="columns" row-key="name">
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-btn color="primary" @click="abrirDialogo(props.row)">📝</q-btn>
          <q-btn @click="activar(props.row._id)" class="activar" v-if="props.row.estado == 0">✅</q-btn>
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
          <div class="text-h6">{{ editando ? 'Editar Aprendiz' : 'Crear Aprendiz' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Nombre del Aprendiz</p>
          <q-input dense v-model="inputNombreAprendiz" autofocus @keyup.enter="guardar()" />
          <p>Documento del Aprendiz</p>
          <q-input dense v-model="inputDocumentoAprendiz" @keyup.enter="guardar()" />
          <p>Teléfono del Aprendiz</p>
          <q-input dense v-model="inputTelefonoAprendiz" @keyup.enter="guardar()" />
          <p>Email del Aprendiz</p>
          <q-input dense v-model="inputEmailAprendiz" @keyup.enter="guardar()" />
          <p>Ficha del aprendiz</p>
          <q-select
            dense
            v-model="selectedFicha"
            :options="fichas"
            option-label="codigo"
            option-value="_id"
            label="Seleccionar Ficha"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary1">
          <q-btn flat label="Cerrar" v-close-popup />
          <q-btn flat label="Guardar" @click="guardar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
</style>

<script setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useAprendizStore } from '../stores/aprendiz.js';
import { useFichaStore } from '../stores/Ficha.js';

const prompt = ref(false);
const inputNombreAprendiz = ref('');
const inputDocumentoAprendiz = ref('');
const inputTelefonoAprendiz = ref('');
const inputEmailAprendiz = ref('');
const fichas = ref([]);
const selectedFicha = ref(null);
const editando = ref(false);
const aprendizId = ref(null);
const rows = ref([]);
const columns = ref([
  {
    name: 'nombre1',
    required: true,
    label: 'Nombre del Aprendiz',
    align: 'center',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'documento1',
    align: 'center',
    label: 'Documento del Aprendiz',
    field: 'documento',
    sortable: true,
  },
  {
    name: 'telefono1',
    align: 'center',
    label: 'Teléfono del Aprendiz',
    field: 'telefono',
    sortable: true,
  },
  {
    name: 'email1',
    align: 'center',
    label: 'Email del Aprendiz',
    field: 'email',
    sortable: true,
  },
  {
    name: 'estado1',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true,
  },
  {
    name: 'opciones',
    label: 'Opciones',
    align: 'center',
    sortable: true,
  },
]);

const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();
const $q = useQuasar();

onBeforeMount(() => {
  traer();
  traerFichas();
});

async function traer() {
  const resultado = await useAprendiz.listarAprendiz();
  rows.value = resultado.data;
}

function abrirDialogo(row = null) {
  if (row) {
    editando.value = true;
    aprendizId.value = row._id;
    inputNombreAprendiz.value = row.nombre;
    inputDocumentoAprendiz.value = row.documento;
    inputTelefonoAprendiz.value = row.telefono;
    inputEmailAprendiz.value = row.email;
    selectedFicha.value = row.id_ficha || null;
  } else {
    editando.value = false;
    aprendizId.value = null;
    inputNombreAprendiz.value = '';
    inputDocumentoAprendiz.value = '';
    inputTelefonoAprendiz.value = '';
    inputEmailAprendiz.value = '';
    selectedFicha.value = null;
  }
  prompt.value = true;
}

async function traerFichas() {
  try {
    const inf = await useFicha.listarFichas();
    fichas.value = inf.data.map(ficha => ({
      id: ficha._id,
      codigo: ficha.codigo,
    }));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las fichas.',
    });
    console.error('Error al cargar las fichas:', error);
  }
}

async function guardar() {
  const fichaId = selectedFicha.value.id || selectedFicha.value;

  if (!inputNombreAprendiz.value || !inputDocumentoAprendiz.value || !inputTelefonoAprendiz.value || !inputEmailAprendiz.value) {
    $q.notify({
      type: 'negative',
      message: 'Rellena todos los campos.',
    });
    return;
  }

  try {
    if (editando.value) {
      const respuesta = await useAprendiz.actualizaraprendiz(
        aprendizId.value,
        inputNombreAprendiz.value.trim(),
        inputDocumentoAprendiz.value.trim(),
        inputTelefonoAprendiz.value.trim(),
        inputEmailAprendiz.value.trim(),
        fichaId
      );
      if (respuesta.success) {
        $q.notify({
          type: 'positive',
          message: 'Aprendiz actualizado correctamente.',
        });
      } else {
        $q.notify({
          type: 'negative',
          message: 'Error al actualizar el aprendiz.',
        });
      }
    } else {
      const respuesta = await useAprendiz.crearaprendiz(
        inputDocumentoAprendiz.value.trim(),
        inputNombreAprendiz.value.trim(),
        inputTelefonoAprendiz.value.trim(),
        inputEmailAprendiz.value.trim(),
        fichaId
      );
      if (respuesta.success) {
        $q.notify({
          type: 'positive',
          message: 'Aprendiz creado correctamente.',
        });
      } else {
        $q.notify({
          type: 'negative',
          message: 'Error al crear el aprendiz.',
        });
      }
    }
    traer();
    prompt.value = false;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al procesar la solicitud.',
    });
    console.error('Error en guardar:', error);
  }
}

async function activar(id) {
  try {
    await useAprendiz.activaraprendiz(id);
    traer();
    $q.notify({
      type: 'positive',
      message: 'Aprendiz activado correctamente.',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al activar el aprendiz.',
    });
    console.error('Error al activar el aprendiz:', error);
  }
}

async function desactivar(id) {
  try {
    await useAprendiz.desactivaraprendiz(id);
    traer();
    $q.notify({
      type: 'positive',
      message: 'Aprendiz desactivado correctamente.',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al desactivar el aprendiz.',
    });
    console.error('Error al desactivar el aprendiz:', error);
  }
}
</script>
