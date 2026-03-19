import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'terminal.css/dist/terminal.min.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
