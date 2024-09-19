import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useQuasar } from 'quasar';

export const useBitacoraStore = defineStore("bitacora", () => {
  const token = ref(localStorage.getItem('token') || null);
  const q = useQuasar();
  
  const axiosInstance = axios.create({
    baseURL: 'https://api-asistencia-sena.onrender.com/api',
    // baseURL: 'http://localhost:5001/api',
  });

  // Interceptor para agregar el token en cada solicitud
  axiosInstance.interceptors.request.use((config) => {
    if (token.value) {
      config.headers['x-token'] = token.value;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const listarTodo = async () => {
    try {
      const r = await axiosInstance.get("/Bitacoras/listartodo");
      return r;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al listar las bitácoras',
      });
      throw error;
    }
  };

  const listarPorFechas = async () => {
    try {
      const r = await axiosInstance.get(`/Bitacoras/listarporfechas`);
      return r;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al listar por fechas',
      });
      throw error;
    }
  };

  const listarPorFicha = async (id_ficha) => {
    try {
      const r = await axiosInstance.get(`/Bitacoras/listarporficha/${id_ficha}`);
      return r;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al listar por ficha',
      });
      throw error;
    }
  };

  const listarBitacoraPorEstado = async () => {
    try{
      const r = await axiosInstance.get("/Bitacoras/listarPorEstado");
      return r
    } catch (error){
      q.notify({
        type: 'negative',
        message: 'Error al listar por estado',
      });
      throw error;
    }
  };

  const listarPorAprendiz = async (id_aprendiz) => {
    try {
      const r = await axiosInstance.get(`/Bitacoras/listarporaprendiz/${id_aprendiz}`);
      return r;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al listar por aprendiz',
      });
      throw error;
    }
  };

  const crearBitacora = async (bitacoraData) => {
    try {
      const r = await axiosInstance.post(`/Bitacoras/crearBitacora`, bitacoraData);
      q.notify({
        type: 'positive',
        message: 'Bitácora creada con éxito',
      });
      return r;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al crear la bitácora',
      });
      throw error;
    }
  };

  const actualizarEstado = async (id, estado) => {
    try {
      const r = await axiosInstance.put(`/Bitacoras/actualizarEstado/${id}`, { estado });
      q.notify({
        type: 'positive',
        message: 'Estado de la bitácora actualizado con éxito',
      });
      return r;
    } catch (error) {
      q.notify({
        type: 'negative',
        message: 'Error al actualizar el estado de la bitácora',
      });
      throw error;
    }
  };
  

  return {
    listarTodo,
    listarPorFechas,
    listarPorFicha,
    listarBitacoraPorEstado,
    listarPorAprendiz,
    crearBitacora,
    actualizarEstado,
  };
});
