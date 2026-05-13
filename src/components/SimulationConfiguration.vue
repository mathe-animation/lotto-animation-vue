<template>
  <div className='grid grid-cols-2 gap-x-2 gap-y-3 grid-flow-row-dense'>
    <div className='bg-green-500 rounded-lg shadow-xl min-h-[50px] row-span-1'>
      <Timer />
    </div>
    <div className='rounded-lg shadow-xl min-h-[50px] row-span-2'>

        <h1
          class="relative top-0 w-fit py-4 justify-center text-yellow-300 flex items-center bg-clip-text text-7xl font-extrabold text-center select-auto">
          {{ "LOTTO: " + k_slider + " aus " + n_slider }}
        </h1>
        <v-card-text>
          <v-slider v-model="k_slider" :min="1" :max="30" :step="1" class="ma-4" label="k: Anzahl der gezogenen Kugeln"
            hide-details>
            <template v-slot:append>
              <v-text-field v-model="k_slider" density="compact" style="width: 150px" type="number" variant="outlined"
                hide-details></v-text-field>
            </template>
          </v-slider>

          <v-slider v-model="n_slider" :min="1" :max="100" :step="1" class="ma-4" label="n: Anzahl der Kugeln insgesamt"
            hide-details>
            <template v-slot:append>
              <v-text-field v-model="n_slider" density="compact" style="width: 150px" type="number" variant="outlined"
                hide-details></v-text-field>
            </template>
          </v-slider>

          <v-slider v-model="count_trials" :min="1000" :max="5000000000" :step="1000" class="ma-4"
            label="Anzahl der gekauften LOTTO-Scheine" hide-details>
            <template v-slot:append>
              <v-text-field v-model="count_trials" density="compact" style="width: 150px" type="number"
                variant="outlined" hide-details></v-text-field>
            </template>
          </v-slider>
        </v-card-text>



    </div>
    <div className='bg-blue-500 rounded-lg shadow-xl min-h-[50px] row-span-1' />
    <div className='bg-yellow-500 rounded-lg shadow-xl min-h-[50px] row-span-4 col-span-1'>

      <v-data-table :items="experiments" v-model:items-per-page="itemsPerPage"></v-data-table>
    </div>
    <div className='bg-orange-500 rounded-lg shadow-xl min-h-[50px] col-span-1'>

      <v-btn id="btn-start-sim" block @click="start_simulation" rounded="0" :class="{ hidden: playIsHidden }">
        <svg-icon type="mdi" :path="pathStart"></svg-icon>
        {{ start_text }}
      </v-btn>
    </div>




    <div className='bg-indigo-500 rounded-lg shadow-xl min-h-[50px]'>
        <p class="card-simulation-status">{{ status_text }}</p>
        </div>
    <div className='bg-purple-500 rounded-lg shadow-xl min-h-[50px]'>
<LottoAnimation />
      </div>
    <div className='bg-pink-500 rounded-lg shadow-xl min-h-[50px]' />
    <div className='bg-slate-500 rounded-lg shadow-xl min-h-[50px]' />
  </div>

  <!---<v-btn rounded="0">
        <svg-icon type="mdi" :path="pathRestart"></svg-icon>
        Simulation stoppen und neustarten
    </v-btn>-->



  <v-card class="card-simulation-status">{{ k_slider + " Richtige" }}</v-card>
  <v-card class="card-simulation-status">{{ count_wins }}</v-card>


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

import { useStopwatch } from "vue-timer-hook"
//import CodeBlock from './CodeBlock.vue'
//import Timer from "vue-timer-hook"

import Timer from '@/components/Timer.vue'
import LottoAnimation from '@/components/LottoAnimation.vue'


import { useTimer } from 'vue-timer-hook'

let count_completed_experiments = 0

let k_slider = ref(6)
let n_slider = ref(49)
let count_trials = ref(10000)

//let trial_counter_value = ref(0)
let count_wins = ref(0)

const status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")
const start_text = "Simulation starten"
const stop_text = "Simulation stoppen"

const stopIsHidden = ref(true)
const playIsHidden = ref(false)

let simulation_running = false

let experiments = ref([])

const itemsPerPage = ref(3)

function start_simulation() {
  if (simulation_running == false) {
    console.log(simulation_running)
    simulation_running = true
    status_text.value = "Status: Simulation läuft..."
    playIsHidden.value = true
    stopIsHidden.value = false
    count_wins.value = LottoExperiment(
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
  count_wins.value = 0
  console.log("n ist " + String(n))
  console.log("k ist " + String(k))
  console.log("number_trials ist " + String(number_trials))
  for (let i = 0; i < number_trials; i++) {
    let random_number = Math.random()
    if (random_number <= prob) {
      count_wins.value = count_wins.value + 1
      console.log("win")
      if (i % 1000 == 0) {
        console.log("another 1000 done")
      }
    }
  }
  console.log("Juhu fertig, Gewinn-Zähler: " + String(count_wins.value))
  count_completed_experiments = count_completed_experiments + 1
  experiments.value.push(
    {
      "Experiment Nr.": String(count_completed_experiments),
      "k": String(k),
      "n": String(n),
      "Versuchsanzahl": String(number_trials),
      "Gewinnanzahl": String(count_wins.value)
    }
  )
  return count_wins.value
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

#btn-start-sim {
  height: 100%;
}
</style>
