/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import Matter from 'matter-js' // Import the plugin
// Composables
import { createApp } from 'vue'
import mitt from 'mitt'


// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import './styles/tailwind.css'
import './styles/main.scss'

const app = createApp(App)

app.config.globalProperties.$Matter = Matter

registerPlugins(app)

app.mount('#app')