import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"


export const useBitacoraStore = defineStore("bitacora", () => {
  let token = ref("")
  const listarTodo = async () => {
    try {
      let r = await axios.get("http://localhost:5001/api/Bitacoras/listartodo")
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
    }
  }

  const listarporfechas = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Bitacoras/listarporfechas`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
    }
  }

  const listarficha = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Bitacoras/listarporficha/${id_ficha}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
    }
  }

  const listarporaprendiz = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Bitacoras/listarporaprendiz/${id_aprendiz}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const crearBitacora = async (
    id_aprendiz,
    fecha
  ) => {
    try {
      let r = await axios.post(`http://localhost:5001/api/Bitacoras/crearBitacora`,
        {
          id_aprendiz,
          fecha
        }
      )
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

    const actualizar = async () => {
      try {
        let r = await axios.put(`http://localhost:5001/api/Bitacoras/actualizar/${id}`)
        console.log(r);
        return r
      } catch (error) {
        console.log(error);
        return error
      }
    }
    return {
      crearBitacora, actualizar, listarTodo, listarficha, listarporaprendiz, listarporfechas, token
    }
})