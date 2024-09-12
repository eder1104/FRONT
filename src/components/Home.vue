<template>


  <div class="q-gutter-md grid">
    <q-card class="my-card" flat bordered @click="goToRoute('/Ficha')">
      <div class="fondo">
        <q-img src="..\Images\Logo-Fichas.png" />
      </div>
      <q-card-section class="width">
        <div class="text-h6 q-mt-sm q-mb-xs">FICHAS</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card" flat bordered @click="goToRoute('/Usuario')">
      <div class="fondo">
        <q-img src="..\Images\Logo-Administrador.png" />
      </div>
      <q-card-section>
        <div class="text-h6 q-mt-sm q-mb-xs">ADMINISTRADOR</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card" flat bordered @click="goToRoute('/Bitacora')">
      <div class="fondo">
        <q-img src="..\Images\Logo-Bitacoras.png" />
      </div>
      <q-card-section>
        <div class="text-h6 q-mt-sm q-mb-xs">BITACORAS</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card" flat bordered @click="goToRoute('/Aprendiz')">
      <div class="fondo">
        <q-img src="..\Images\Logo-Aprendices.png" />
      </div>
      <q-card-section>
        <div class="text-h6 q-mt-sm q-mb-xs">APRENDICES</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const drawer = ref(false)
const router = useRouter();

function goToRoute(route) {
  router.push(route);
}
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
  background-color: red !important;
  color: white !important;
  font-size: 17px !important;
  width: 90% !important;
  margin-left: 4% !important;
}
</style>