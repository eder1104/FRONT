<template>
  <router-view>
    <q-layout view="lHh Lpr lff">
      <q-page-container>
        <q-btn class="colorCorporativo" @click="abrirDialogo()" label="Crear Aprendiz" />
        <br><br>
        <q-table
          title="APRENDICES"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :loading="isLoading"
          class="tabla"
          pagination.sync="pagination"
          :rows-per-page-options="[20, 50, 100, 0]"
        >
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn
                class="colorCorporativo editar"
                @click="abrirDialogo(props.row)"
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

        <!-- Dialog for creating/editing Aprendiz -->
        <q-dialog v-model="prompt" persistent class="box">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h5 tituloCuadroDeDialogo">
                {{ editando ? "EDITAR APRENDIZ" : "CREAR APRENDIZ" }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">

              <q-input
                filled
                label="Nombre del Aprendiz"
                required
                label-class="custom-label"
                v-model="inputNombreAprendiz"
                :disable="isLoading"
                autofocus
                @keyup.enter="guardar()"
              >
                <template v-slot:prepend>
                  <font-awesome-icon icon="spell-check" />
                </template>              
              </q-input>

              <q-input
                filled
                label="Documento del Aprendiz"
                label-class="custom-label"
                required
                v-model="inputDocumentoAprendiz"
                :disable="isLoading"
                @keyup.enter="guardar()"
                >
                <template v-slot:prepend>
                  <font-awesome-icon icon="address-card" />                
                </template>              
              </q-input>

              <q-input
                filled
                label="Teléfono del Aprendiz"
                label-class="custom-label"
                v-model="inputTelefonoAprendiz"
                required
                :disable="isLoading"
                @keyup.enter="guardar()"
                >
                <template v-slot:prepend>
                  <font-awesome-icon icon="phone" />                
                </template>              
              </q-input>

              <q-input
                filled
                label="Email del Aprendiz"
                label-class="custom-label"
                v-model="inputEmailAprendiz"
                required
                :disable="isLoading"
                @keyup.enter="guardar()"
                >
                <template v-slot:prepend>
                  <font-awesome-icon icon="envelope" />                
                </template>              
              </q-input>

              <q-file
                filled
                label="Firma del Aprendiz"
                v-model="firma"
                name="firma"
                required 
                :disable="isLoading"
                @keyup.enter="guardar()"
                >
                <template v-slot:prepend>
                  <font-awesome-icon icon="file-signature"/>                
                </template>              
              </q-file>
              
              <q-select
                filled
                v-model="selectedFicha"
                :options="fichas"
                :disable="isLoading"
                option-label="codigo"
                option-value="_id"
                label="Seleccionar Ficha"
                label-class="custom-label"
                >
                <template v-slot:prepend>
                  <font-awesome-icon icon="users-line" />                
                </template>              
              </q-select>
            </q-card-section>

            <q-card-actions align="right" class="text-primary1">
              <q-btn
              class="btnCerrar"
                flat
                v-close-popup 
                >
                <font-awesome-icon icon="fa-solid fa-circle-xmark" style="margin-right: 5px;"/>                  
                Cerrar              
                </q-btn>

              <q-btn
                class="btnGuardar"
                flat
                :loading="isLoading"
                @click="guardar()"
                >
                <font-awesome-icon icon="fa-solid fa-floppy-disk" style="margin-right: 5px;" />                
                Guardar Aprendiz
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page-container> </q-layout
  ></router-view>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from "../stores/Ficha.js";

const isLoading = ref(false);
const loadingButtons = ref({});
const prompt = ref(false);
const inputNombreAprendiz = ref("");
const inputDocumentoAprendiz = ref("");
const inputTelefonoAprendiz = ref("");
const inputEmailAprendiz = ref("");
const firma = ref(null);
const fichas = ref([]);
const selectedFicha = ref(null);
const editando = ref(false);
const aprendizId = ref(null);
const rows = ref([]);
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
    label: "Teléfono del Aprendiz",
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

const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();
const $q = useQuasar();

onBeforeMount(() => {
  traer();
  traerFichas();
});

async function traer() {
  isLoading.value = true;
  try {
    const resultado = await useAprendiz.listarAprendiz();
    rows.value = resultado.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

function abrirDialogo(row = null) {
  if (row) {
    editando.value = true;
    aprendizId.value = row._id;
    inputNombreAprendiz.value = row.nombre;
    inputDocumentoAprendiz.value = row.documento;
    inputTelefonoAprendiz.value = row.telefono;
    inputEmailAprendiz.value = row.email;
    firma.value = row.firma;
    selectedFicha.value = row.id_ficha || null;
  } else {
    editando.value = false;
    aprendizId.value = null;
    inputNombreAprendiz.value = "";
    inputDocumentoAprendiz.value = "";
    inputTelefonoAprendiz.value = "";
    inputEmailAprendiz.value = "";
    firma.value = null
    selectedFicha.value = null;
  }
  prompt.value = true;
}

async function traerFichas() {
  isLoading.value = true;
  try {
    const inf = await useFicha.listarFichas();
    fichas.value = inf.data.map((ficha) => ({
      id: ficha._id,
      codigo: `${ficha.codigo} - ${ficha.nombre}`,
    }));
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al cargar las fichas.",
    });
    console.error("Error al cargar las fichas:", error);
  } finally {
    isLoading.value = false;
  }
}

async function guardar() {
  isLoading.value = true;
  const fichaId = selectedFicha.value?.id || selectedFicha.value;

  // Verifica que todos los campos estén llenos
  if (
    !inputNombreAprendiz.value ||
    !inputDocumentoAprendiz.value ||
    !inputTelefonoAprendiz.value ||
    !inputEmailAprendiz.value ||
    !firma.value 
  ) {
    $q.notify({
      type: "negative",
      message: "Rellena todos los campos.",
    });
    isLoading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("documento", inputDocumentoAprendiz.value.trim());
  formData.append("nombre", inputNombreAprendiz.value.trim());
  formData.append("telefono", inputTelefonoAprendiz.value.trim());
  formData.append("email", inputEmailAprendiz.value.trim());
  formData.append("id_ficha", fichaId);
  formData.append("firma", firma.value);

  try {
    if (editando.value) {
      const respuesta = await useAprendiz.actualizarAprendiz(aprendizId.value, formData);
      if (respuesta.success) {
        $q.notify({
          type: "positive",
          message: "Aprendiz actualizado correctamente.",
        });
      } else {
        $q.notify({
          type: "negative",
          message: "Error al actualizar el aprendiz.",
        });
      }
    } else {
      console.log('Firma:', firma.value);
      const respuesta = await useAprendiz.crearAprendiz(formData);
      if (respuesta.success) {
        $q.notify({
          type: "positive",
          message: "Aprendiz creado correctamente.",
        });
        await traer(); // Actualiza la lista después de crear
        prompt.value = false; // Cierra el diálogo
      };
    }
    prompt.value = false; // Cierra el diálogo al final
  } catch (error) {
    console.error(error); // Muestra el error en la consola
    $q.notify({
      type: "warning",
      message: "Ocurrió un error.",
    });
  } finally {
    isLoading.value = false; // Detiene la carga
  }
}



async function activar(id) {
  loadingButtons.value[id] = { ...loadingButtons.value[id], activar: true };
  try {
    await useAprendiz.activarAprendiz(id);
    traer();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al activar el aprendiz.",
    });
    console.error("Error al activar el aprendiz:", error);
  } finally {
    loadingButtons.value[id] = { ...loadingButtons.value[id], activar: false };
  }
}

async function desactivar(id) {
  loadingButtons.value[id] = { ...loadingButtons.value[id], desactivar: true };
  try {
    await useAprendiz.desactivarAprendiz(id);
    traer();
    $q.notify({
      type: "positive",
      message: "Aprendiz desactivado correctamente.",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al desactivar el aprendiz.",
    });
    console.error("Error al desactivar el aprendiz:", error);
  } finally {
    loadingButtons.value[id] = {
      ...loadingButtons.value[id],
      desactivar: false,
    };
  }
}
</script>

<style scooped>
.width {
  width: 3%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.text {
  font-size: 70%;
  font-weight: bolder;
}

.box {
  z-index: 9999;
}
.q-card__section{
  padding: 0px !important;

}

</style>
