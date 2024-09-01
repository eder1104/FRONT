import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"


export const useBitacoraStore = defineStore("bitacora", () => {
  let token = ref("")
  const listarTodo = async () => {
    try {
      let r = await axios.get("http://localhost:5001/api/Bitacoras/listarTodo")
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const listarficha = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Bitacora/ListarPorFicha/${id_ficha}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const listarporaprendiz = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Bitacora/ListarPorAprendiz/${id_aprendiz}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const insertar = async () => {
    try {
      let r = await axios.post(`http://localhost:5001/api/Bitacora/insertar`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

    const actualizar = async () => {
      try {
        let r = await axios.put(`http://localhost:5001/api/Bitacora/Actualizar/${id}`)
        console.log(r);
        return r
      } catch (error) {
        console.log(error);
        return error
      }
    }
    return {
      insertar, actualizar, listarTodo, listarficha, listarporaprendiz, token
    }
})