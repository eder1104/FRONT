import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUsuarioStore = defineStore("usuario", () => {
  let loading = ref(false);
  const inicio = async (email, password) => {
    try {
      loading.value = true;
      let datos = await axios.post(
        `http://localhost:5001/api/administrador/token`,
        {
          email: email,
          password: password,
        }
      );

      return datos;
    } catch (error) {
      loading.value = true;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const crearUsuario = async (userData) => {
    try {
      loading.value = true;
      const response = await axios.post('http://localhost:5001/api/Usuarios/crearusuario', user);
      q.notify({
        type: 'positive',
        message: 'Usuario creado correctamente'
      });
      return response.data;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al crear el usuario: ' + error.message
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };


  return {
    inicio,
    loading,
    crearUsuario
  };
});
