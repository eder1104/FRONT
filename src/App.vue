<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-green text-white">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>REPFORA</q-toolbar-title>
          <img src="./Images/Logo-Back-Home.png" @click="goToRoute('/Home')" class="width" />
        </q-toolbar>
      </q-header>

      <div v-if="isLoading" class="fullscreen-spinner">
        <q-spinner color="primary" size="3em" :thickness="2" />
      </div>

      <div v-else>
        <q-drawer v-model="drawer" show-if-above :width="220" :breakpoint="400">
          <q-scroll-area
            style="
              height: calc(100% - 150px);
              margin-top: 150px;
              border-right: 1px solid #ddd;
            "
          >
            <q-list padding>
              <q-btn class="menuButton" to="/Ficha" label="FICHAS" />
              <br /><br />
              <q-btn class="menuButton" to="/Usuario" label="ADMINISTRADORES" />
              <br /><br />
              <q-btn class="menuButton" to="/Bitacora" label="BITACORAS" />
              <br /><br />
              <q-btn class="menuButton" to="/Aprendiz" label="APRENDICES" />
              <br /><br />
              <q-btn class="menuButton" to="/Home" label="HOME" />
            </q-list>
          </q-scroll-area>

          <q-img
            class="absolute-top"
            src="https://cdn.quasar.dev/img/material.png"
            style="height: 150px"
          >
            <div class="absolute-bottom bg-transparent">
              <q-avatar size="56px" class="q-mb-sm">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              <div class="text-weight-bold">Julian Duran</div>
              <div>@Ingeniero</div>
            </div>
          </q-img>
        </q-drawer>

        <q-page-container>
          <router-view></router-view>
        </q-page-container>

        <q-footer id="footer_inf">
          <q-toolbar>
            <q-toolbar-title>
              <q-avatar></q-avatar>
              <div class="text">REPFORA - Sena 2024 © todos los derechos reservados</div>
            </q-toolbar-title>
          </q-toolbar>
        </q-footer>
      </div>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const drawer = ref(false);
const isLoading = ref(true);

function goToRoute(route) {
  router.push(route);
}

// Simulación de carga de datos
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});
</script>

<style>
.width {
  width: 3%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.width:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

#footer_inf {
  background-color: rgb(158, 158, 158) !important;
  color: black;
  bottom: -50px;
}

#footer_inf div {
  display: flex;
  text-align: center;
  font-family: Georgia, 'Times New Roman', Times, serif;
  justify-content: center;
  place-items: center;
  background-color: rgb(227, 227, 227);
  position: fixed;
}

.q-layout {
  width: 101% !important;
}

.text {
  font-size: 70%;
  font-weight: bolder;
}

.fullscreen-spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}
</style>
