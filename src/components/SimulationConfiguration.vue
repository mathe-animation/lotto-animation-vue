<template>
  <div class="grid-container">

    <div class="box" style="grid-area: box2; padding: 0; margin: 0;">
      <LottoAnimation :key="n_slider" />
    </div>

    <div class="box" style="grid-area: box1;">
      <h1
        class="title-font-size relative top-0 w-fit py-4 justify-center text-yellow-300 flex items-center bg-clip-text text-7xl font-extrabold text-center select-auto">
        {{ "LOTTO: " + k_slider + " aus " + n_slider }}
      </h1>
      <div class="div-slider">
        <div class="text-body-small lg">
          k (Anzahl der gezogenen Kugeln):
        </div>
        <v-slider v-model="k_slider" :min="1" :max="30" :step="1" class="ma-4" lglabel="k: Anzahl der gezogenen Kugeln"
          hide-details>
          <template v-slot:append>
            <v-text-field v-model="k_slider" density="compact" style="width: 150px" type="number" variant="outlined"
              hide-details></v-text-field>
          </template>
        </v-slider>
      </div>
      <div class="div-slider">
        <div class="text-body-small">
          n (Anzahl der Kugeln in der LOTTO-Ziehmaschine):
        </div>
        <v-slider @change="update_animation" v-model="n_slider" :min="1" :max="100" :step="1" class="ma-4"
          lglabel="n: Anzahl der Kugeln insgesamt" hide-details>
          <template v-slot:append>
            <v-text-field v-model="n_slider" density="compact" style="width: 150px" type="number" variant="outlined"
              hide-details></v-text-field>
          </template>
        </v-slider>
      </div>
      <div class="div-slider">
        <div class="text-body-small" style="margin-bottom: 0.2em;">
          Anzahl gekaufter LOTTO-Scheine:
        </div>
        <!--<v-slider v-model="count_trials" :min="1000" :max="1000000000" :step="1000" class="ma-4"
          lglabel="Anzahl der gekauften LOTTO-Scheine" hide-details>
          <template v-slot:append>
            <v-text-field v-model="count_trials" density="compact" style="width: 150px" type="number" variant="outlined"
              hide-details></v-text-field>
          </template>
        </v-slider>-->
        <v-select v-model="count_trials" density="compact" :item-props="itemProps"
          :items="count_trials_poss_val"></v-select>
      </div>
    </div>
    <div class="box" style="grid-area: box5;">
      <v-data-table v-model:sort-by="sortBy" density="compact" :items="experiments"
        v-model:items-per-page="itemsPerPage"></v-data-table>
    </div>
    <div class="box box-sim-start" style="grid-area: box3;">
      <v-btn id="btn-start-sim" block @click="start_simulation" rounded="0">
        <svg-icon type="mdi" :path="pathStart"></svg-icon>
        {{ start_text }}
      </v-btn>


    </div>


    <div class="box" style="grid-area: box4;">
      <span style="padding: 0; margin: 0;" class="card-simulation-status">{{ status_text }}</span>
      <p>
        {{ count_wins_text_field }}
      </p>
    </div>

    <div class="box class-box6" style="grid-area: box6; line-break: strict; display: block;">
      <div class="div-result">
        <p class="count-wins-title">{{ "Gewinnanzahl:" }}</p>
        <span class="count-wins-number">{{ count_wins }}</span>
      </div>
      <div class="div-result">

        <p class="count-wins-title">{{ "Kosten insgesamt:" }}</p>
      
      <span style="color: #bb0000;" class="count-wins-number">{{ (count_trials * 1.2).toLocaleString() + "€" }}</span></div>
      <div class="div-result">

        <p class="count-wins-title">{{ "Gewinn insgesamt (durchschnittlich):" }}</p>
        <span style="color: #00bb00;" class="count-wins-number">{{ (count_wins * 1000000).toLocaleString() + "€"
          }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiRestart } from "@mdi/js"
import { mdiPlayBox } from "@mdi/js"
import { mdiStopCircleOutline } from "@mdi/js"
import LottoAnimation from "./LottoAnimation.vue";

export default {
  name: "my-cool-component",

  components: {
  },
  data() {
    return {
      pathRestart: mdiRestart,
      pathStart: mdiPlayBox,
      pathStop: mdiStopCircleOutline,
    }
  },
}
// `setup` is a special hook dedicated for the Composition API.
</script>

<script setup lang="js">
import { ref } from "vue"
import { nextTick } from 'vue'
import { useWebWorker } from '@vueuse/core'

let count_completed_experiments = 1

let k_slider = ref(6)
let n_slider = ref(49)
let count_trials = ref(10000)

//let trial_counter_value = ref(0)
let count_wins = ref(0)
let count_wins_text_field = ref("")

const status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")
const start_text = "Simulation starten"
const stop_text = "Simulation stoppen"

let simulation_running = false

let experiments = ref([])

const itemsPerPage = ref(4)
const sortBy = ref([{ key: 'Experiment Nr.', order: 'desc' }])

const renderComponent = ref(true);

const count_trials_poss_val = [
  {
    value: 1000,
    description: '1 Tausend',
  },
  {
    value: 10000,
    description: '10 Tausend',
  },
  {
    value: 100000,
    description: '100 Tausend',
  },
  {
    value: 1000000,
    description: '1 Million',
  },
  {
    value: 10000000,
    description: '10 Millionen',
  },
  {
    value: 100000000,
    description: '100 Millionen',
  },
  {
    value: 1000000000,
    description: '1 Milliarde (1000 Millionen)',
  },
]

//wwwwconst { data , post , terminate , worker  } = useWebWorker ("@/worker.js")

function itemProps(item) {
  return {
    title: item.value,
    subtitle: item.description,
  }
}

function start_simulation() {
  if (simulation_running == false) {
    console.log(simulation_running)
    simulation_running = true
    status_text.value = "Status: Simulation läuft..."
    let new_experiment_data = LottoExperiment(n_slider.value, k_slider.value, count_trials.value)
    experiments.value.push(new_experiment_data)
    count_completed_experiments = count_completed_experiments + 1
    simulation_running = false
    status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
  } else { }
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
  let count_wins_local = 0
  console.log("n ist " + String(n))
  console.log("k ist " + String(k))
  console.log("pls make alert before calc")
  console.log("number_trials ist " + String(number_trials))
  for (let i = 0; i < number_trials; i++) {
    let random_number = Math.random()
    if (random_number <= prob) {
      count_wins_local = count_wins_local + 1
    }
  }
  let new_experiment_list_item = {
    "Experiment Nr.": String(count_completed_experiments),
    "k": String(k),
    "n": String(n),
    "Versuchsanzahl": String(number_trials),
    "Gewinnanzahl": String(count_wins_local)
  }
  count_wins.value = count_wins_local
  return new_experiment_list_item
}

function update_animation() {
  renderComponent.value = false;
  renderComponent.value = true;
}

</script>

<style scoped>
/*@reference "../styles/tailwind.css"*/

/*
  1. mixing helper classes and @apply for demonstration purposes only
  2. the classes below are NOT wrapped in any CSS layer, so they "win" over everything else
*/
/*.hero-card {
  @apply py-3 md:pr-[120px] w-full transition-none;
}*/

/*:deep(.v-card) {
  @apply bg-gray-200;
  @apply dark:bg-black dark:bg-linear-to-r dark:from-primary/50 dark:to-primary/30 dark:text-white/80;
}*/

div {
  --my-grid-cols: 2;
}

.hidden {
  display: none;
}

.shown {
  display: block;
}

h1 {
  padding: 0;
}

#btn-start-sim {
  height: 100%;
}

#div_slider {
  display: block;
}

.div-slider {
  margin-top: 0.6em;
}

.grid-container {
  height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5em;
  grid-template-areas:
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box3 box2"
    "box3 box2"
    "box3 box2"
    "box4 box2"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6"
    "box5 box6";

}

img {
  width: 100%;
  height: 400px;
  object-fit: contain;
}

.box {
  padding: 0.5em;
}

.box-sim-start {
  padding: 0.3em;
  margin: 1em 0.3em 0.3em 0.3em;
}

div.v-card-text {
  padding: 0;
}

.class-box6 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.count-wins-title {
  flex: 0 0 100px;
  font-size: 1em;
}

.count-wins-number {
  font-size: 2.5em;
}

* /deep/ .v-list-item__subtitle {
  white-space: normal;
}

.title-font-size {
  font-size: 4em;
}

span {
  display: inline-block;
}

.text-body-small {
  padding-left: 0.7em;
}

.v-data-table__tr {
  margin: 0;
  padding: 0;
  height: 10px;
  line-height: 0.5;
}

.div-result {
  margin-top: 0em;
  padding: 0;
  
}
</style>
