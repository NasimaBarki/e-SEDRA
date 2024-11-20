import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Setup from '../views/Setup.vue'
import Ambiti from '../views/Ambiti.vue'
import Profilo from '../views/Profilo.vue'
import Utenti from '../views/Utenti.vue'
import Logfile from '../views/Logfile.vue'
import Generale from '../views/Generale.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/setup',
        name: 'Setup',
        component: Setup
    },
    {
        path: '/ambiti',
        name: 'Ambiti',
        component: Ambiti
    },
    {
        path: '/profilo',
        name: 'Profilo',
        component: Profilo
    },
    {
        path: '/utenti',
        name: 'Utenti',
        component: Utenti
    },
    {
        path: '/logfile',
        name: 'LogFile',
        component: Logfile
    },
    {
        path: '/generale',
        name: 'generale',
        component: Generale
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router