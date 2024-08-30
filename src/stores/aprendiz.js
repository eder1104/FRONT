import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useUsuarioStore } from "./../stores/usuarios.js";

export const useAprendizStore = defineStore("aprendiz", () => {
  let token = ref("");
  const listarAprendiz = async () => {
    try {
      let r = await axios.get(
        "http://localhost:5001/api/Aprendices/listartodo"
      );
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listarAprendizPorID = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Aprendices/${codigo}`);
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listarid = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Aprendices/${id}`);
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const crearaprendiz = async (
    documento,
    nombre,
    telefono,
    email,
    id_ficha
  ) => {
    // const useUsuario = useUsuarioStore();
    console.log({ documento, nombre, telefono, email, id_ficha }); // Verificar datos
    try {
      let r = await axios.post(
        `http://localhost:5001/api/Aprendices/crearaprendiz`,
        {
          documento,
          nombre,
          telefono,
          email,
          id_ficha,
        }
      ); return r
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const actualizaraprendiz = async () => {
    try {
      let r = await axios.put(
        `http://localhost:5001/api/Aprendices/actualizaraprendiz/${id}`
      );
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const activaraprendiz = async (id) => {
    try {
      let r = await axios.put(
        `http://localhost:5001/api/Aprendices/activaraprendiz/${id}`
      );
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const desactivaraprendiz = async (id) => {
    try {
      let r = await axios.put(
        `http://localhost:5001/api/Aprendices/desactivaraprendiz/${id}`
      );
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return {
    actualizaraprendiz,
    activaraprendiz,
    desactivaraprendiz,
    listarAprendiz,
    listarAprendizPorID,
    listarid,
    crearaprendiz,
    token,
  };
});
