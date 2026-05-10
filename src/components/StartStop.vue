<template>
    <!---<v-btn rounded="0">
        <svg-icon type="mdi" :path="pathRestart"></svg-icon>
        Simulation stoppen und neustarten
    </v-btn>-->
    <v-btn
    @click="greet"
    :class="{ 'not-running': isNotRunning, 'running': isRunning, 'error-text' : hasError}"
    rounded="0">
        <svg-icon type="mdi" :path="pathStart"></svg-icon>
        Simulation starten
    </v-btn>
    <v-card class="card-simulation-status" text="Status: Die Simulation wurde noch nicht gestartet..."></v-card>
</template>

<script>

    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiRestart } from '@mdi/js'
    import { mdiPlayCircleOutline } from '@mdi/js';

    export default {
        name: "my-cool-component",

        components: {
            SvgIcon
        },

        data() {
            return {
                pathRestart: mdiRestart,
                pathStart: mdiPlayCircleOutline,
            }
        }
    }
</script>
<script setup>
    import { ref } from 'vue'
    const name = ref('Vue.js')

    function greet(event) {
    alert(`Hello ${name.value}!`)
    // `event` is the native DOM event
    if (event) {
        alert(event.target.tagName)
    }
    }

    const isNotRunning = ref(true)
    const isRunning = ref(false)
    const hasError = ref(false)
</script>