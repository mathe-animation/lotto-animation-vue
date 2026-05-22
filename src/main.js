/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import Matter from 'matter-js' // Import the plugin
// Composables
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'

// Plugins
import { registerPlugins } from '@/plugins'
// Translations provided by Vuetify
import { pl, zhHans } from 'vuetify/locale'

// Components
import App from './App.vue'
import { ref } from "vue"

// Styles
//import 'unfonts.css'
import './styles/tailwind.css'
import './styles/main.scss'

const app = createApp(App)

export default createVuetify({
  theme: {
    defaultTheme: 'dark', // 'system' | 'light' | 'dark'
  },
})

registerPlugins(app)

app.mount('#app')   