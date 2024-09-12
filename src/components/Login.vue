<template>
  <div class="q-pa-md">
    <div class="login">
      <q-form @submit.prevent="onSubmit" @reset="onReset" class="log">
        <h5 id="tittle"><b>LOGIN</b></h5>
        <div class="inputs">
          <q-input
            filled
            type="text"
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
        </div>
        <div class="bottom">
          <q-btn label="Ingresar" type="submit" class="register" />
        </div>

        <div class="bottom">
          <q-btn
            label="Restablecer Contraseña"
            type="submit"
            to="/Recuperacion"
          />
        </div>
      </q-form>
    </div>
  </div>
  <div>
    <div class="todr">REPFORA - Sena 2024 © Todos los derechos reservados</div>
  </div>
</template>

<style>
.q-pa-md {
  display: flex;
  justify-content: center;
}

.q-gutter-md {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login {
  width: 40%;
  display: flex;
  border: black 2px solid;
  border-radius: 20px;
}

.log {
  width: 100%;
}

#tittle {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: center;
  background-color: #2e7d32;
  text-align: center;
  align-items: center;
}
#tittle b {
  font-size: 30px;
  font-family: Lucida Sans, Lucida Sans Regular, Lucida Grande,
    Lucida Sans Unicode, Geneva, Verdana, sans-serif;
  color: white;
  font-weight: 700;
}

.bottom {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.todr {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 10vh;
  align-items: center;
  background-color: rgb(212, 212, 212);
}

.register {
  background-color: #2e7d32;
}

.q-btn:before {
  background-color: #2e7d32;
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
    const res = await axios.post(
      "http://localhost:5001/api/Usuarios/loginusuario",
      {
        email: email.value,
        contrasena: contrasena.value,
      }
    );

    // Asegúrate de que el token está en la respuesta
    const { usuario, token } = res.data;

    if (!token) {
      throw new Error("No se recibió un token en la respuesta");
    }

    // Guardar el token en localStorage
    localStorage.setItem("token", token);

    console.log("Token guardado:", token);

    Notify.create({
      type: "positive",
      message: "Inicio de sesión exitoso",
    });

    // Redirigir al Home
    router.push("/Home");
  } catch (error) {
    console.log("Error en login:", error);

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
