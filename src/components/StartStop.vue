<template>
    <!---<v-btn rounded="0">
        <svg-icon type="mdi" :path="pathRestart"></svg-icon>
        Simulation stoppen und neustarten
    </v-btn>-->
    <v-btn
    @click="start_stop_animation"
    :class="{ 'not-running': isNotRunning, 'running': isRunning, 'error-text' : hasError}"
    rounded="0">
        <svg-icon type="mdi" :path="pathStart" :class="{ hidden: playIsHidden }"></svg-icon>
        <svg-icon type="mdi" :path="pathStop" class="" :class="{ hidden: stopIsHidden }"></svg-icon>
        {{ start_stop_text }}
    </v-btn>
    <v-card class="card-simulation-status">{{ status_text }}</v-card>
</template>

<script>
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiRestart } from '@mdi/js'
    import { mdiPlayCircleOutline } from '@mdi/js';
    import { mdiStopCircleOutline } from '@mdi/js';

    export default {
        name: "my-cool-component",

        components: {
            SvgIcon
        },

        data() {
            return {
                pathRestart: mdiRestart,
                pathStart: mdiPlayCircleOutline,
                pathStop: mdiStopCircleOutline,
            }
        },
        // `setup` is a special hook dedicated for the Composition API.
        setup() {

            // expose the ref to the template
            return {
                status_text
            }
        }
    }
</script>
<script setup>
    import { ref } from 'vue'

    let simulation_running = false
    let currently_simulating = false

    const name = ref('Vue.js')

    function start_stop_animation(event) {
    //alert(`Hello ${name.value}!`)
    // `event` is the native DOM event
    if (event) {
        alert(event.target.tagName)
    }
    if (simulation_running == false) {
        console.log(simulation_running)
        simulation_running = true
        start_stop_text.value = "Simulation stoppen"
        status_text.value = "Status: Simulation läuft..."
        playIsHidden.value = true
        stopIsHidden.value = false
    } else if (simulation_running == true) {
        console.log(simulation_running)
        simulation_running = false
        start_stop_text.value = "Simulation starten"
        status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
        playIsHidden.value = false
        stopIsHidden.value = true
    } else {
        alert("Etwas ist schiefgelaufen. Die Webseite wird nun automatisch neu geladen...")
        location.reload();
    }


    }

    const isNotRunning = ref(true)
    const isRunning = ref(false)
    const hasError = ref(false)

    const status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")
    const start_stop_text = ref("Simulation starten")

    const stopIsHidden = ref(true)
    const playIsHidden = ref(false)


</script>

<style lang="css" scoped>

.hidden {
    display: none;
}

</style>