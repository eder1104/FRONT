<template>
  <div>
    <q-btn color="secondary" @click="dialogo('crear')" label="Crear Usuario" />
    <q-table title="Administradores" :rows="rows" :columns="columns" row-key="name">
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-btn color="primary" @click="dialogo('editar', props.row)">📝</q-btn>
          <q-btn @click="activar(props.row._id)" v-if="props.row.estado === 0">✅</q-btn>
          <q-btn @click="desactivar(props.row._id)" v-else>❌</q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-estado1="props">
        <q-td :props="props">
          <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
            {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
          </p>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Nombre del Usuario</p>
          <q-input dense v-model="inputNombreAdministrador" autofocus @keyup.enter="prompt = false" />
          <p>Email</p>
          <q-input dense v-model="inputEmailAdministrador" @keyup.enter="prompt = false" />
          <p v-show="editando == false">Contraseña</p>
          <q-input dense v-model="inputContrasenaAdministrador" v-show="editando == false" type="password" @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cerrar" v-close-popup @click="prompt = false" />
          <q-btn flat label="Guardar Administrador" @click="validar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useUsuarioStore } from '../stores/usuarios.js';

const rows = ref([]);
const prompt = ref(false);
const q$ = useQuasar();
const dialogTitle = ref('');
const editando = ref(false);
const usuarioId = ref(null);
const inputNombreAdministrador = ref('');
const inputEmailAdministrador = ref('');
const inputContrasenaAdministrador = ref('');

const useUsuario = useUsuarioStore();

onBeforeMount(() => {
  traer();
});

const traer = async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/Usuarios/listartodo');
    rows.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

async function activar(id) {
  try {
    await axios.put(`http://localhost:5001/api/Usuarios/activarusuario/${id}`);
    traer();
  } catch (error) {
    console.log(error);
  }
}

async function desactivar(id) {
  try {
    await axios.put(`http://localhost:5001/api/Usuarios/desactivarusuario/${id}`);
    traer();
  } catch (error) {
    console.log(error);
  }
}

const validar = async () => {
  if (!inputNombreAdministrador.value || !inputEmailAdministrador.value) {
    q$.notify({
      type: 'negative',
      message: 'Rellena todos los campos.',
    });
    return;
  }

  try {
    if (editando.value) {
      await axios.put(
        `http://localhost:5001/api/Usuarios/actualizarusuario/${usuarioId.value}`,
        {
          nombre: inputNombreAdministrador.value,
          email: inputEmailAdministrador.value,
        }
      );
    } else {
      await axios.post("http://localhost:5001/api/Usuarios/crearusuario", {
        nombre: inputNombreAdministrador.value,
        email: inputEmailAdministrador.value,
        contrasena: inputContrasenaAdministrador.value,
      });
    }
    await traer();
    prompt.value = false;
  } catch (error) {
    q$.notify({
      type: 'negative',
      message: error.message,
    });
  }
};

const dialogo = (accion, administrador = null) => {
  if (accion === 'crear') {
    dialogTitle.value = 'Crear Administrador';
    inputNombreAdministrador.value = '';
    inputEmailAdministrador.value = '';
    inputContrasenaAdministrador.value = '';
    editando.value = false;
  } else if (accion === 'editar' && administrador) {
    dialogTitle.value = 'Editar Administrador';
    inputNombreAdministrador.value = administrador.nombre;
    inputEmailAdministrador.value = administrador.email;
    usuarioId.value = administrador._id;
    editando.value = true;
  }
  prompt.value = true;
};

const columns = ref([
  {
    name: 'nombre1',
    required: true,
    label: 'Nombre del Usuario',
    align: 'center',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'email1',
    align: 'center',
    label: 'Email del Usuario',
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
</script>

<style>
</style>
