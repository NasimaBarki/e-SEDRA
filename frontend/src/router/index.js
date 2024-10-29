import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Setup from '../views/Setup.vue'
import Ambiti from '../views/Ambiti.vue'

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
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router