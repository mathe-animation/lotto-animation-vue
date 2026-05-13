<template>
  <v-card style="margin: auto" width="600">
    <h1
      class="relative top-0 w-fit py-4 justify-center flex bg-gradient-to-r items-center from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-6xl font-extrabold text-transparent text-center select-auto"
    >
      LOTTO: 6 aus 49
    </h1>
    <v-card-text>
      <v-slider
        v-model="k_slider"
        :min="1"
        :max="30"
        :step="1"
        class="ma-4"
        label="k: Anzahl der gezogenen Kugeln"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="k_slider"
            density="compact"
            style="width: 120px"
            type="number"
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>
      </v-slider>

      <v-slider
        v-model="n_slider"
        :min="1"
        :max="100"
        :step="1"
        class="ma-4"
        label="n: Anzahl der Kugeln insgesamt"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="n_slider"
            density="compact"
            style="width: 120px"
            type="number"
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>
      </v-slider>

      <v-slider
        v-model="count_trials"
        :min="1000"
        :max="500000000"
        :step="1000"
        class="ma-4"
        label="Anzahl der gekauften LOTTO-Scheine"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="count_trials"
            density="compact"
            style="width: 120px"
            type="number"
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
  <!---<v-btn rounded="0">
        <svg-icon type="mdi" :path="pathRestart"></svg-icon>
        Simulation stoppen und neustarten
    </v-btn>-->
  <v-btn @click="start_simulation" rounded="0" :class="{ hidden: playIsHidden }">
    <svg-icon
      type="mdi"
      :path="pathStart"
    ></svg-icon>
    {{ start_text }}
  </v-btn>
    <v-btn @click="stop_simulation" rounded="0">
    <svg-icon
      type="mdi"
      :path="pathStop"
      class=""
    ></svg-icon>
    {{ stop_text }}
  </v-btn>
  <v-card class="card-simulation-status">{{ status_text }}</v-card>
  <v-card class="card-simulation-status">Anzahl der Versuche</v-card>
  <v-card class="card-simulation-status">{{ trial_counter_value }}</v-card>
</template>

<script lang="ts">
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiRestart } from "@mdi/js"
import { mdiPlayCircleOutline } from "@mdi/js"
import { mdiStopCircleOutline } from "@mdi/js"

export default {
  name: "my-cool-component",

  components: {
    SvgIcon,
  },
  data() {
    return {
      pathRestart: mdiRestart,
      pathStart: mdiPlayCircleOutline,
      pathStop: mdiStopCircleOutline,
    }
  },
}
// `setup` is a special hook dedicated for the Composition API.
</script>

<script setup lang="ts">
import { ref } from "vue"
import random from 'random'

let k_slider = ref(6)
let n_slider = ref(49)
let count_trials = ref(10000)

const trial_counter_value = ref(0)

const status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")
const start_text = "Simulation starten"
const stop_text = "Simulation stoppen"

const stopIsHidden = ref(true)
const playIsHidden = ref(false)

let simulation_running = false

async function start_simulation() {
  if (simulation_running == false) {
    console.log(simulation_running)
    simulation_running = true
    status_text.value = "Status: Simulation läuft..."
    playIsHidden.value = true
    stopIsHidden.value = false
    const count_wins = await LottoExperiment(
      n_slider.value,
      k_slider.value, 
      count_trials.value)
    simulation_running = false
    status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
    playIsHidden.value = false
    stopIsHidden.value = true
  }
}      
async function stop_simulation() {
  console.log(simulation_running)
  simulation_running = false
  status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
  playIsHidden.value = false
  stopIsHidden.value = true
}

function factorial(n) {
  // n!
  var fac = 1
  for (let i = 1; i <= n; i++) {
    fac = fac * i
  }
  return fac
}

function binomial(n, k) {
  // Binomialkoeffizient von n über k
  var bin = factorial(n) / (factorial(k) * factorial(n - k))
  return bin
}

function Prob(n, k) {
  // Wahrscheinlichkeit für genau r Richtige bei einem Lottofeld
  var N = binomial(n, k)
  var y = 1 / N
  return y
}

function LottoExperiment(n, k, number_trials) {
  const prob = Prob(n, k)
  console.log("prob is " + String(prob))
  let count_wins = 0
  trial_counter_value.value = 0
  console.log("n ist " + String(n))
  console.log("k ist " + String(k))
  console.log("number_trials ist " + String(number_trials))
  for (let i = 0; i < number_trials; i++) {
    //console.log(i)
    let random_number = Math.random()
    if (random_number <= prob) {
      count_wins = count_wins + 1
      console.log("win")
      if (i % 1000 == 0) {
        console.log("another 1000 done")
      }
    trial_counter_value.value = i + 1
    }
  }
  trial_counter_value.value = 0
  console.log("Juhu fertig, Gewinn-Zähler: " + String(count_wins))
  return count_wins
}
</script>

<style scoped>
@reference "../styles/tailwind.css"

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
