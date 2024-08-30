<template>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <h5 id="tittle"><b>Olvidé mi Contraseña</b></h5>
  
        <q-input
          filled
          v-model="email"
          label="Ingrese su correo electrónico"
          lazy-rules
          :rules="[(val) => !!val || 'Email es requerido']"
        />
  
        <div>
          <q-btn label="Enviar Solicitud" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { Notify } from "quasar";
  
  const email = ref(null);
  
  const onSubmit = async () => {
    try {
      await axios.post("http://localhost:5001/api/Usuarios/recuperarcontrasena", {
        email: email.value,
      });
  
      Notify.create({
        type: "positive",
        message: "Se ha enviado un correo para restablecer tu contraseña.",
      });
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response?.data?.msg || "Error al enviar la solicitud",
      });
    }
  };
  </script>
  