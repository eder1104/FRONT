<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">

      <div v-if="isLoading" class="fullscreen-spinner">
        <q-spinner color="primary" size="3em" :thickness="2" />
      </div>

      <div v-else>

        <div>
          <q-select
            v-model="selectedAdmin"
            :options="filteredAdmins"
            option-value="_id"
            option-label="nombre"
            emit-value
            map-options
            use-input
            fill-input
            label="Buscar Administrador"
            filled
            @filter="filterAdmins"
            @input="handleInput"
            @blur="resetSelectInput"
          />
          <br />
          <q-btn
            color="green-8"
            @click="dialogo('crear')"
            label="Crear Administrador"
          />
          <br /><br />

          <!-- Tabla de administradores -->
          <q-table
            title="ADMINISTRADORES"
            :rows="rows"
            :columns="columns"
            row-key="_id"
            ref="adminTable"
            pagination.sync="pagination"
            :rows-per-page-options="[20, 50, 100, 0]"
          >
            <!-- Opciones de la fila (editar y activar/desactivar) -->
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn color="green-8" @click="dialogo('editar', props.row)">
                  <font-awesome-icon icon="pen-to-square" />
                </q-btn>
                <q-btn
                  @click="activar(props.row._id)"
                  class="activar"
                  v-if="props.row.estado === 0"
                  >
                  <font-awesome-icon icon="fa-solid fa-check" style="color: #ffffff;" />
                  </q-btn
                >
                <q-btn
                  @click="desactivar(props.row._id)"
                  class="desactivar"
                  v-else
                >
                  <font-awesome-icon icon="ban" style="color: #ffffff;"/>
                </q-btn>
              </q-td>
            </template>

            <!-- Estado del usuario en la tabla -->
            <template v-slot:body-cell-estado1="props">
              <q-td :props="props">
                <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
                  {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
                </p>
              </q-td>
            </template>
          </q-table>

          <!-- Diálogo para crear/editar administrador -->
          <q-dialog v-model="prompt" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">{{ dialogTitle }}</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <!-- Campos del formulario -->
                <p>Nombre del Usuario</p>
                <q-input dense v-model="inputNombreAdministrador" autofocus />

                <p>Email</p>
                <q-input dense v-model="inputEmailAdministrador" />

                <!-- Contraseña solo visible al crear un usuario -->
                <p v-show="!editando">Contraseña</p>
                <q-input
                  dense
                  v-model="inputContrasenaAdministrador"
                  v-show="!editando"
                  type="password"
                />
              </q-card-section>

              <!-- Botones de acción en el diálogo -->
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cerrar" @click="prompt = false" />
                <q-btn flat label="Guardar Administrador" @click="validar()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useUsuarioStore } from "../stores/usuarios.js";

const rows = ref([]);
const prompt = ref(false);
const q$ = useQuasar();
const dialogTitle = ref("");
const editando = ref(false);
const usuarioId = ref(null); // Esto es donde almacenamos el id del usuario que se está editando
const inputNombreAdministrador = ref("");
const inputEmailAdministrador = ref("");
const inputContrasenaAdministrador = ref("");
const selectedAdmin = ref(null); // Valor del administrador seleccionado
const filteredAdmins = ref([]); // Opciones filtradas
const useUsuario = useUsuarioStore();
const drawer = ref(false);
const isLoading = ref(false);

// Traer los datos de los administradores
onBeforeMount(() => {
  traer();
});

async function traer() {
  const response = await useUsuario.traer();
  rows.value = response.data;
  filteredAdmins.value = response.data; // Inicializar opciones del select con todos los administradores
}

// Función para filtrar administradores por nombre (máximo 5 resultados y mejor coincidencia)
const filterAdmins = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredAdmins.value = rows.value
      .filter((admin) => admin.nombre.toLowerCase().includes(needle))
      .sort((a, b) => {
        // Prioriza los nombres que empiezan con la cadena buscada
        return (
          a.nombre.toLowerCase().indexOf(needle) -
          b.nombre.toLowerCase().indexOf(needle)
        );
      })
      .slice(0, 5); // Limitar a 5 resultados
  });
};

const scrollToAdmin = (adminId) => {
  const adminTable = $refs.adminTable; // Referencia a la tabla
  const index = rows.value.findIndex((row) => row._id === adminId);

  if (index !== -1) {
    // Calcula la página correcta
    const rowsPerPage = adminTable.pagination.rowsPerPage;
    const page = Math.floor(index / rowsPerPage) + 1;

    // Establece la paginación y espera que la tabla actualice
    adminTable.setPagination({ page });

    // Asegura que la fila esté visible después de la actualización
    setTimeout(() => {
      const rowsEl = adminTable.$el.querySelectorAll(".q-table__rows tr");
      const rowEl = rowsEl[index % rowsPerPage]; // Index dentro de la página actual

      if (rowEl) {
        rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 500); // Ajusta el tiempo si es necesario
  }
};

const handleInput = (adminId) => {
  const admin = rows.value.find((row) => row._id === adminId);
  if (admin) {
    selectedAdmin.value = admin._id; // Almacena solo el ID para evitar duplicaciones
    scrollToAdmin(adminId); // Llama a la función para desplazar la tabla
  }
};

const resetSelectInput = () => {
  const admin = rows.value.find((row) => row._id === selectedAdmin.value);
  if (admin) {
    // Restablece solo el nombre del usuario en el campo después de la selección
    selectedAdmin.value = admin._id;
  }
};

// Validar la entrada del usuario (crear o editar)
const validar = async () => {
  if (!inputNombreAdministrador.value || !inputEmailAdministrador.value) {
    q$.notify({
      type: "negative",
      message: "Rellena todos los campos.",
    });
    return;
  }

  try {
    if (editando.value && usuarioId.value) {
      await useUsuario.actualizarUsuario(usuarioId.value, {
        nombre: inputNombreAdministrador.value.trim(),
        email: inputEmailAdministrador.value.trim(),
      });
    } else {
      await useUsuario.crearUsuario({
        nombre: inputNombreAdministrador.value.trim(),
        email: inputEmailAdministrador.value.trim(),
        contrasena: inputContrasenaAdministrador.value.trim(),
      });
    }
    await traer(); // Actualizar la tabla después de crear/editar
    prompt.value = false; // Cerrar el diálogo
  } catch (error) {
    console.log(error);
  }
};

async function activar(id) {
  await useUsuario.activar(id);
  traer();
}

async function desactivar(id) {
  await useUsuario.desactivar(id);
  traer();
}

const dialogo = (accion, administrador = null) => {
  if (accion === "crear") {
    dialogTitle.value = "Crear Administrador";
    inputNombreAdministrador.value = "";
    inputEmailAdministrador.value = "";
    inputContrasenaAdministrador.value = "";
    usuarioId.value = null;
    editando.value = false;
  } else if (accion === "editar" && administrador) {
    dialogTitle.value = "Editar Administrador";
    inputNombreAdministrador.value = administrador.nombre;
    inputEmailAdministrador.value = administrador.email;
    usuarioId.value = administrador._id; // Asignar el id del usuario a editar
    editando.value = true;
  }
  prompt.value = true;
};

const columns = ref([
  {
    name: "nombre1",
    required: true,
    label: "Nombre del Usuario",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "email1",
    align: "center",
    label: "Email del Usuario",
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
  { name: "opciones", label: "Opciones", align: "center", sortable: true },
]);
</script>

<style>
.desactivar {
  background-color: red !important;
}

.activar{
  background-color: rgb(10, 190, 10) !important;
}
</style>