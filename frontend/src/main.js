import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/js/webcmp'

const app = createApp(App)
// TODO: nel file functions.js non posso accedere a questa variabile
// app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('my-rating')
app.config.globalProperties.apiBaseUrl = 'http://localhost:3000'

app.use(router).mount('#app')