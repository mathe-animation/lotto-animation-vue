<template>

  <v-card style="margin: auto" width="600">
    <h1
      class="relative top-0 w-fit py-4 justify-center flex bg-gradient-to-r items-center from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-6xl font-extrabold text-transparent text-center select-auto">
      LOTTO: 6 aus 49
    </h1>
    <v-card-text>
      <v-slider v-model="k_slider" :min="1" :max="30" :step="1" class="ma-4"
        label="k: Anzahl der gezogenen Kugeln" hide-details>
        <template v-slot:append>
          <v-text-field v-model="k_slider" density="compact" style="width: 120px" type="number" variant="outlined"
            hide-details></v-text-field>
        </template>
      </v-slider>

      <v-slider v-model="n_slider" :min="1" :max="100" :step="1" class="ma-4"
        label="n: Anzahl der Kugeln insgesamt" hide-details>
        <template v-slot:append>
          <v-text-field v-model="n_slider" density="compact" style="width: 120px" type="number" variant="outlined"
            hide-details></v-text-field>
        </template>
      </v-slider>

      <v-slider v-model="count_trials" :min="1000" :max="500000000" :step="1000"
        class="ma-4" label="Anzahl der gekauften LOTTO-Scheine" hide-details>
        <template v-slot:append>
          <v-text-field v-model="count_trials" density="compact" style="width: 120px" type="number" variant="outlined"
            hide-details></v-text-field>
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
  <!---<v-btn rounded="0">
        <svg-icon type="mdi" :path="pathRestart"></svg-icon>
        Simulation stoppen und neustarten
    </v-btn>-->
  <v-btn @click="start_stop_animation" rounded="0">
    <svg-icon type="mdi" :path="pathStart" :class="{ hidden: playIsHidden }"></svg-icon>
    <svg-icon type="mdi" :path="pathStop" class="" :class="{ hidden: stopIsHidden }"></svg-icon>
    {{ start_stop_text }}
  </v-btn>
  <v-card class="card-simulation-status">{{ status_text }}</v-card>
</template>

<script lang="ts" >
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
  }
}
  // `setup` is a special hook dedicated for the Composition API.
</script>

<script setup lang="ts">
import { ref } from 'vue'

let k_slider = ref(6)
let n_slider = ref(49)
let count_trials = ref(10000)

const status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")
const start_stop_text = ref("Simulation starten")

const stopIsHidden = ref(true)
const playIsHidden = ref(false)

//let start_stop_text = ref("Simulation stoppen")
//let status_text = ref("Status: Simulation läuft...")

defineExpose({
  k_slider,
  n_slider,
  count_trials,
})

let simulation_running = false
let currently_simulating = false

const name = ref('Vue.js')

function start_stop_animation(event) {
  //alert(`Hello ${name.value}!`)
  // `event` is the native DOM event
  //if (event) {
  //    alert(event.target.tagName)
  //}
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

</script>



<style scoped>
@reference "../styles/tailwind.css";

/*
  1. mixing helper classes and @apply for demonstration purposes only
  2. the classes below are NOT wrapped in any CSS layer, so they "win" over everything else
*/
.hero-card {
  @apply py-3 md:pr-[120px] w-full transition-none;
}

:deep(.v-card) {
  @apply bg-gray-200;
  @apply dark:bg-black dark:bg-linear-to-r dark:from-primary/50 dark:to-primary/30 dark:text-white/80;
}

.hidden {
  display: none;
}
</style>
