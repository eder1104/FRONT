import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Usuario from "../components/Usuario.vue"
import Bitacora from "../components/Bitacora.vue"
import Ficha from "../components/Ficha.vue"
import Aprendiz from "../components/Aprendiz.vue"

import {createRouter, createWebHashHistory} from "vue-router"
import Recuperacion from "../components/Recuperacion.vue"

const routes = [
    {path: "/", component: Login},
    {path: "/Home", component: Home},
    {path: "/Usuario", component: Usuario},
    {path: "/Bitacora", component: Bitacora},
    {path: "/Ficha", component: Ficha},
    {path: "/Aprendiz", component: Aprendiz},
    {path: "/Recuperacion", component: Recuperacion},
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})