import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Usuario from "../components/Usuario.vue"
import Bitacora from "../components/Bitacora.vue"
import Ficha from "../components/Ficha.vue"
import Aprendiz from "../components/Aprendiz.vue"
import Recuperacion from "../components/Recuperacion.vue"
import ListaAprendiz from "../components/ListaAprendiz.vue"
import Informes from "../components/Informes.vue"
import TablaAsistencia from "../components/TablaAsistencia.vue"

import {createRouter, createWebHashHistory} from "vue-router"


const routes = [
  {path: "/", component: Login},
  {path: "/Recuperacion", component: Recuperacion},
  {path: "/Tabla", component: TablaAsistencia},
{
  path: "/Home", component: Home, children:[
    {path: "Usuario", component: Usuario},
    {path: "Bitacora", component: Bitacora},
    {path: "Ficha", component: Ficha},
    {path: "Aprendiz", component: Aprendiz},
    {path: "Listado", component: ListaAprendiz},
    {path: "Informes", component: Informes},
  ]
}

]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        next({ path: '/' });
      } else {
        next();
      }
    } else {
      next();
    }
  });
  