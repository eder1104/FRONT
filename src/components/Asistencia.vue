<template>
    
    <div class="q-pa-md">
    <q-layout view="lHh Lpr lff">
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
      </div>
    </q-layout>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
const drawer = ref(false);
const isLoading = ref(false);
</script>
<style>

</style>