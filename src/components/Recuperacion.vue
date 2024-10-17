<template>
<q-layout>
    <div class="q-pa-md" style="max-width: 400px">
      <q-header elevated class="bg-green text-white">
        <q-toolbar>
          <q-toolbar-title>REPFORA</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <br><br>
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
  </q-layout>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { Notify } from "quasar";
  import { useRouter } from "vue-router"
  
  const email = ref(null);
  const router = useRouter()
  
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
  