//Import css
import './assets/css/all.min.css'
import './assets/css/banner.css'
import './assets/css/custom.css'
import './assets/css/home.css'
import './assets/css/menu.css'
import './assets/css/setup.css'

//Mount dell'App.vue all'interno della div con id app
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
