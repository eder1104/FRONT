<template>
  <div class="q-pa-md">
    <div class="login">
      <q-form @submit.prevent="onSubmit" @reset="onReset" class="log">
      <h5 id="tittle"><b>Login</b></h5>

      <!-- <q-select
        outlined
        v-model="selectedUser"
        use-input
        hide-selected
        fill-input
        input-debounce="300"
        :options="options"
        option-value="email"
        option-label="nombre"
        label="Seleccionar Perfil"
        @filter="filterFn"
        @update:model-value="onSelectChange"
        style="width: 330px; padding-bottom: 32px"
      >

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select> -->

      <q-input
        filled
        :type="text"
        v-model="email"
        label="Ingrese su correo"
        lazy-rules
        :rules="[(val) => !!val || 'El correo es requerido']"
      >
      </q-input>

      <q-input
        filled
        :type="showPassword ? 'text' : 'password'"
        v-model="contrasena"
        label="Ingrese su contraseña"
        lazy-rules
        :rules="[(val) => !!val || 'La contraseña es requerida']"
      >
        <template v-slot:append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="togglePasswordVisibility"
          />
        </template>
      </q-input>

      <div class="bottom">
        <q-btn label="Ingresar" type="submit" color="primary" />
      </div>

      <div class="bottom">
        <q-btn label="Restablecer Contraseña" type="submit" to="/Recuperacion" color="primary" />
      </div>
    </q-form>
    </div>
   
  </div>
</template>

<style>
.q-gutter-md{
  display: flex;
  flex-direction: column;

}

.login{
  width: 60%;
  display: flex;
  translate: (40%px, );
}

.log{
  width: 100%;
}

#tittle{
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #2e7d32;
  margin-left: -20px;

}

.bottom{
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const showPassword = ref(false);
const email = ref(null);
const contrasena = ref(null);
const selectedUser = ref(null);
const options = ref([]);
const rows = ref([]);
const router = useRouter();

const filterFn = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = rows.value.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(needle)
    );
  });
};

onBeforeMount(() => {
  traer();
});

const traer = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/Usuarios/listartodo"
    );
    rows.value = response.data;
    options.value = rows.value;
  } catch (error) {
    console.log(error);
  }
};

const onSelectChange = (user) => {
  email.value = user.email;
};

const onSubmit = async () => {
  try {
    const res = await axios.post("http://localhost:5001/api/Usuarios/loginusuario", {
      email: email.value,
      contrasena: contrasena.value,
    });
    console.log(email.value);
    console.log(contrasena.value);

    const { usuario, token } = res.data;

// Aquí se guarda el token en localStorage, en el estado global, etc.
    localStorage.setItem("token", token);

    Notify.create({
      type: "positive",
      message: "Inicio de sesión exitoso",
    });
    router.push("/Home");
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response?.data?.msg || "Error en el inicio de sesión",
    });
  }
};

const onReset = () => {
  email.value = null;
  contrasena.value = null;
  selectedUser.value = null;
  options.value = [];
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
