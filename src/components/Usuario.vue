<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
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
            :loading="isLoading"
            :rows-per-page-options="[20, 50, 100, 0]"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn color="green-8" @click="dialogo('editar', props.row)"
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
                  <font-awesome-icon icon="fa-solid fa-check" style="color: #ffffff;" />
                  </q-btn
                >
                <q-btn
                  @click="desactivar(props.row._id)"
                  :loading="loadingButtons[props.row._id]?.desactivar || false"
                  class="desactivar"
                  v-else
                >
                  <font-awesome-icon icon="ban" style="color: #ffffff;"/>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:body-cell-estado1="props">
              <q-td :props="props">
                <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
                  {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
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
                <!-- Campos del formulario -->
                <p>Nombre del Usuario</p>
                <q-input 
                dense 
                v-model="inputNombreAdministrador"
                :disable="isLoading"
                autofocus 
                />

                <p>Email</p>
                <q-input 
                dense 
                v-model="inputEmailAdministrador"
                :disable="isLoading" 
                />

                <p v-show="!editando">Contraseña</p>
                <q-input
                  dense
                  v-model="inputContrasenaAdministrador"
                  v-show="!editando"
                  :disable="isLoading"
                  type="password"
                />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn 
                flat 
                label="Cerrar" 
                :loading="isLoading"
                @click="prompt = false" 
                />
                <q-btn 
                flat 
                label="Guardar Administrador" 
                :loading="isLoading"
                @click="validar()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onBeforeMount} from "vue";
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
const isLoading = ref(false);
const loadingButtons = ref({});
onBeforeMount(() => {
  traer();
});

async function traer() {
    isLoading.value = true;
    try {
      const response = await useUsuario.traer();
      rows.value = response.data;
      filteredAdmins.value = response.data;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
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
  isLoading.value = true;

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
  } finally {
      isLoading.value = false;
    }
};

async function activar(id) {
    loadingButtons.value[id] = { ...loadingButtons.value[id], activar: true };
    try {
      await useUsuario.activar(id);
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
      await useUsuario.desactivar(id);
      traer();
    } catch (error) {
      console.log(error);
    } finally {
      loadingButtons.value[id] = { ...loadingButtons.value[id], desactivar: false };
    }
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