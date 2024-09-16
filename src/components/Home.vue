<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
      <q-header elevated class="bg-green text-white">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>REPFORA</q-toolbar-title>
          <img
            src="../assets/Images/Logo-Back-Home.png"
            @click="goToRoute('/Home')"
            class="width"
          />
        </q-toolbar>
      </q-header>

      <div v-if="isLoading" class="fullscreen-spinner">
        <q-spinner color="primary" size="3em" :thickness="2" />
      </div>

      <div v-else>
        <q-drawer v-model="drawer" show-if-above :width="220" :mini-to-overlay="false" :breakpoint="400">
          <q-scroll-area
            style="
              height: calc(100% - 150px);
              margin-top: 150px;
              border-right: 1px solid #ddd;
            "
          >
            <q-list padding>
              <q-btn class="menuButton" to="/Home/Ficha" label="FICHAS" />
              <br /><br />
              <q-btn class="menuButton" to="/Home/Usuario" label="ADMINISTRADORES" />
              <br /><br />
              <q-btn class="menuButton" to="/Home/Bitacora" label="BITACORAS" />
              <br /><br />
              <q-btn class="menuButton" to="/Home/Aprendiz" label="APRENDICES" />
              <br /><br />
              <q-btn class="menuButton" to="/Home" label="HOME" />
            </q-list>
          </q-scroll-area>

          <q-img
            class="absolute-top"
            src="../assets/Images/fondo_q-drawer.avif"
            style="height: 150px"
          >
            <div class="absolute-bottom bg-transparent">
              <q-avatar size="56px" class="q-mb-sm">
                <img src="../assets/Images/logo-blanco.png" />
              </q-avatar>
              <div class="text-weight-bold">{{ nombreUsuario }}</div>
              <div class="text-weight-bold">{{ emailUsuario }}</div>
            </div>
          </q-img>
        </q-drawer>

        <!-- Ajustamos la clase q-layout-padding para que el contenido se mueva -->
        <q-page-container>
          <router-view></router-view>

          <div class="q-gutter-md grid" v-if="$route.path === '/Home'">
            <q-card class="my-card" flat bordered @click="goToRoute('/Home/Ficha')">
              <div class="fondo">
                <q-img src="../assets/Images/Logo-Fichas.png" />
              </div>
              <q-card-section class="width">
                <div class="text-h6 q-mt-sm q-mb-xs">FICHAS</div>
              </q-card-section>
            </q-card>

            <q-card class="my-card" flat bordered @click="goToRoute('/Home/Usuario')">
              <div class="fondo">
                <q-img src="../assets/Images/Logo-Administrador.png" />
              </div>
              <q-card-section>
                <div class="text-h6 q-mt-sm q-mb-xs">ADMINISTRADOR</div>
              </q-card-section>
            </q-card>

            <q-card class="my-card" flat bordered @click="goToRoute('/Home/Bitacora')">
              <div class="fondo">
                <q-img src="../assets/Images/Logo-Bitacoras.png" />
              </div>
              <q-card-section>
                <div class="text-h6 q-mt-sm q-mb-xs">BITACORAS</div>
              </q-card-section>
            </q-card>

            <q-card class="my-card" flat bordered @click="goToRoute('/Home/Aprendiz')">
              <div class="fondo">
                <q-img src="../assets/Images/Logo-Aprendices.png" />
              </div>
              <q-card-section>
                <div class="text-h6 q-mt-sm q-mb-xs">APRENDICES</div>
              </q-card-section>
            </q-card>
          </div>
        </q-page-container>
      </div>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const drawer = ref(false);
const router = useRouter();
const isLoading = ref(false)
const nombreUsuario = ref('')
const emailUsuario = ref('')

function goToRoute(route) {
  router.push(route);
}

onMounted(() => {
    nombreUsuario.value = sessionStorage.getItem('nombre') || ''
    emailUsuario.value = sessionStorage.getItem('email') || ''
  });
</script>

<style>
.grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
}

.q-gutter-md {
  padding-inline-start: 10% !important;
}

.fondo {
  background-color: #2e7d32;
}

.absolute-top{
  text-align: center;
}

.my-card {
  width: 65%;
  cursor: pointer;
  border-radius: 0px !important;
  border: 5px #2e7d32 solid !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.my-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.width {
  width: 50%;
}

.text-h5 {
  text-align: center;
}

.menuButton {
  background-color: #2e7d32 !important;
  color: white !important;
  font-size: 17px !important;
  width: 90% !important;
  margin-left: 4% !important;
}

.q-table__title{
  font-size: 30px !important;
  font-weight: bold !important;
}
</style>
