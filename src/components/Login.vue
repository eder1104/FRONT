<template>
  <div class="q-pa-md">
    <div class="login">
      <q-form @submit.prevent="onSubmit" @reset="onReset" class="log">
        <h5 id="tittle"><b>LOGIN</b></h5>
<img src="src\Images\logoSena.png" alt="Logo Del SENA" id="logoSENA">
        <q-select
          v-if="!selectedRole"
          filled
          v-model="role"
          label="Seleccione el rol"
          :options="roles"
        />

        <div v-if="role === 'Administrador'" class="inputs">
          <q-input
            filled
            type="text"
            v-model="email"
            label="Ingrese su correo"
            lazy-rules
            :rules="[(val) => !!val || 'El correo es requerido']"
          />
          <q-input
            filled
            :type="showPassword ? 'text' : 'password'"
            v-model="contrasena"
            label="Ingrese su contraseña"
            lazy-rules
            @paste.prevent
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

        <div v-if="role === 'Aprendiz'" class="inputs">
          <q-input
            filled
            type="text"
            v-model="documento"
            label="Ingrese su documento"
            lazy-rules
            :rules="[(val) => !!val || 'El documento es requerido']"
          />
        </div>

        <div v-if="role" class="bottom">
          <q-btn label="Ingresar" type="submit" class="register" />
        </div>

        <!-- Restablecer contraseña (Solo visible para el Administrador) -->
        <div v-if="role === 'Administrador'" class="bottom">
          <q-btn label="Restablecer Contraseña" to="/Recuperacion" />
        </div>
      </q-form>
    </div>
  </div>
  <div>
    <div class="todr">REPFORA - Sena 2024 © Todos los derechos reservados</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const showPassword = ref(false);
const email = ref(null);
const contrasena = ref(null);
const documento = ref(null);
const role = ref(null); // Guardará el rol seleccionado (Administrador o Aprendiz)
const roles = ref(['Administrador', 'Aprendiz']); // Opciones del select
const router = useRouter();

const onSubmit = async () => {
  try {
    if (role.value === 'Administrador') {
      const res = await axios.post(
        "http://localhost:5001/api/Usuarios/loginusuario",
        {
          email: email.value,
          contrasena: contrasena.value,
        }
      );
      const { token } = res.data;
      localStorage.setItem("token", token);
      Notify.create({ type: "positive", message: "Inicio de sesión exitoso" });
      router.push("/Home");
    } else if (role.value === 'Aprendiz') {
      // Lógica de inicio de sesión para Aprendiz usando el documento
      Notify.create({ type: "positive", message: "Inicio como Aprendiz" });
    }
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
  documento.value = null;
  role.value = null;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.q-pa-md {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  border: rgb(230, 203, 203) 1px solid;
  width: 20%;
  align-items: center;
  text-align: center;
}

#tittle {
  width: 100%;
  font-size: 50px;
  background-color: #2e7d32;
  text-align: center;
  color: white;
  margin: 0px;
  padding: 5%;
}

#logoSENA{
  width: 40%;
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
</style>
