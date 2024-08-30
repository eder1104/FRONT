import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"


export const useFichaStore = defineStore("ficha", () => {
  let token = ref("")
  const listarFichas = async () => {
    try {
      let r = await axios.get('http://localhost:5001/api/Fichas/listartodo')
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const crearFichas = async () => {
    try {
      let r = await axios.post('http://localhost:5001/api/Fichas/crearficha')
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const listarporids = async () => {
    try {
      let r = await axios.get(`http://localhost:5001/api/Fichas/listarporid/${id}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const actualizar = async () => {
    try {
      let r = await axios.put(`http://localhost:5001/api/Fichas/actualizarficha/${id}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const activar = async () => {
    try {
      let r = await axios.put(`http://localhost:5001/api/Fichas/activarficha/${id}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  const desactivar = async () => {
    try {
      let r = await axios.put(`http://localhost:5001/api/Fichas/desactivarficha/${id}`)
      console.log(r);
      return r
    } catch (error) {
      console.log(error);
      return error
    }
  }

  return {
    listarFichas, crearFichas, listarporids, actualizar, activar, desactivar, token
  }


})