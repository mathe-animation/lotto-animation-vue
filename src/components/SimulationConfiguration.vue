<template>
  <div class="grid-container">


    <div class="box yellow-border" style="grid-area: box1;">
      <h1 class="title-font-size">
        {{ "LOTTO: " + k_slider + " aus " + n_slider }}
      </h1>
      <div class="div-slider">
        <div class="text-body-small lg">
          k (Anzahl der gezogenen Kugeln):
        </div>
        <v-slider color="#ff0" v-model="k_slider" :min="1" :max="30" :step="1" lglabel="k: Anzahl der gezogenen Kugeln"
          hide-details>
          <template v-slot:append>
            <v-text-field v-model="k_slider" color="#ff0" density="compact" style="width: 150px; font-size: 0.9em;"
              type="number" variant="outlined" hide-details></v-text-field>
          </template>
        </v-slider>
      </div>
      <div class="div-slider">
        <div class="text-body-small">
          n (Anzahl Kugeln in Maschine):
        </div>
        <v-slider color="#ff0" v-model="n_slider" :min="1" :max="100" :step="1" class="ma-4"
          lglabel="n: Anzahl der Kugeln insgesamt" hide-details>
          <template v-slot:append>
            <v-text-field v-model="n_slider" color="#ff0" density="compact" style="width: 150px; font-size: 0.9em;"
              type="number" variant="outlined" hide-details></v-text-field>
          </template>
        </v-slider>
      </div>
      <div class="div-slider">
        <div class="text-body-small">
          <span style="margin-bottom: 0.8em;">Anzahl gekaufter LOTTO-Scheine:</span>
        </div>
        <!--<v-slider v-model="count_trials" :min="1000" :max="1000000000" :step="1000" class="ma-4"
          lglabel="Anzahl der gekauften LOTTO-Scheine" hide-details>
          <template v-slot:append>
            <v-text-field v-model="count_trials" density="compact" style="width: 150px" type="number" variant="outlined"
              hide-details></v-text-field>
          </template>
        </v-slider>-->
        <v-select item-color="#ff0" v-model="count_trials" density="compact" :item-props="itemProps"
          :items="count_trials_poss_val"></v-select>
      </div>

      <v-btn id="btn-start-sim" block @click="start_simulation" rounded="0" color="#ff0" variant="tonal">
        <svg-icon type="mdi" :path="pathStart"></svg-icon>
        {{ start_text }}
      </v-btn>

      <span class="card-simulation-status"><i>{{ status_text }}</i></span>
      <p>
        {{ count_wins_text_field }}
      </p>


    </div>
    <div class="box yellow-border" style="grid-area: box5;">
      <v-data-table v-model:sort-by="sortBy" density="compact" :items="experiments"
        class="custom-data-table no-padding-table" :class="{ 'custom-dark-theme': darkTheme }"
        v-model:items-per-page="itemsPerPage"></v-data-table>
    </div>


    <div class="box yellow-border animation" style="grid-area: box2; padding: 0; margin: 0;">
      <div class="inner-div-animation">
        <LottoAnimation /><!--:key="n_slider" />-->
      </div>
    </div>

    <div class="box class-box6 yellow-border" style="grid-area: box6; line-break: strict; display: block;">
      <div class="div-result">
        <p class="count-wins-title">{{ "Gewinnanzahl:" }}</p>
        <span class="result-text">{{ count_wins.toLocaleString() }}</span>
      </div>
      <div class="div-result">

        <p class="count-wins-title">{{ "Kosten (" + price_lottoschein.toLocaleString() + "€ pro Lottoschein):" }}</p>

        <span style="color: #bb0000;" class="result-text">{{ cost_sum.toLocaleString() + "€" }}</span>
      </div>
      <div class="div-result">

        <p class="count-wins-title">{{ "Gewinn insgesamt (ca eine Million € pro Gewinn):" }}</p>
        <span style="color: #00bb00;" class="result-text">{{ win_sum.toLocaleString() + "€"
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
import { useDisplay } from 'vuetify'
import { useTheme } from 'vuetify'

const theme = useTheme()

theme.change('dark');

let viewport_width_bigger_900 = false;
let viewport_width;
let animation_big = true;

let count_completed_experiments = 1

let k_slider = ref(6)
let n_slider = ref(49)
let count_trials = ref(10000)

//let trial_counter_value = ref(0)
let count_wins = ref(0)
let cost_sum = ref(0)
let win_sum = ref(0)
let price_lottoschein = 1.2
let count_wins_text_field = ref("")

const status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")
const start_text = "Simulation starten"
const stop_text = "Simulation stoppen"

let simulation_running = false

let experiments = ref([])

const itemsPerPage = ref(4)
const sortBy = ref([{ key: 'Nr.', order: 'desc' }])

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

const { smAndDown } = useDisplay()

const expanded = ref([])

//wwwwconst { data , post , terminate , worker  } = useWebWorker ("@/worker.js")

function itemProps(item) {
  return {
    title: item.value,
    subtitle: item.description,
  }
}

function start_simulation() {
  if (simulation_running == false) {
    if (k_slider.value > n_slider.value) {
      alert("k muss kleiner oder gleich n sein...\n\nWenn in der LOTTO-Maschine zum Beispiel nur n=10 Kugeln sind, ist es nicht möglich k=11 Kugeln zu ziehen.")
    } else {
      console.log(simulation_running)
      simulation_running = true
      status_text.value = "Status: Simulation läuft..."
      let new_experiment_data = LottoExperiment(n_slider.value, k_slider.value, count_trials.value)
      experiments.value.push(new_experiment_data)
      count_completed_experiments = count_completed_experiments + 1
      price_lottoschein = 1.2
      cost_sum.value = count_trials.value * price_lottoschein
      win_sum.value = count_wins.value * 1000000 * (Prob(n_slider.value, k_slider.value) / Prob(49, 6))
      simulation_running = false
      status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
    }
  }
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
    "Nr.": String(count_completed_experiments),
    "k": String(k),
    "n": String(n),
    "Versuche": number_trials.toLocaleString(),
    "Gewinne": String(count_wins_local)
  }
  count_wins.value = count_wins_local
  return new_experiment_list_item
}

/*function update_animation() {
  renderComponent.value = false;
  renderComponent.value = true;
}*/

const forceRender = async () => {
  // Here, we'll remove MyComponent
  renderComponent.value = false;

  // Then, wait for the change to get flushed to the DOM
  await nextTick();

  // Add MyComponent back in
  renderComponent.value = true;
};

// Will execute myCallback every 0.5 seconds 
var intervalID = window.setInterval(myCallback, 500);

function myCallback() {
  let viewport_width = window.innerWidth;
  if (viewport_width > 900) {
    viewport_width_bigger_900 = true;
  } else {
    viewport_width_bigger_900 = false;
  }
  if (viewport_width_bigger_900 != animation_big) {
    forceRender();
  }
  if (viewport_width_bigger_900 == true) {
    animation_big = true;
  } else {
    animation_big = false;
  }
}


</script>

<style scoped>
* {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.98em;
}


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
  color: #cdcd00;
  font-weight: 800;
}

#div_slider {
  display: block;
}

.div-slider {
  margin-top: 0em;
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
    "box1 box2"
    "box1 box2"
    "box1 box2"
    "box1 box2"
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

.yellow-border {
  border: 1px dotted #abab00;
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

.result-text {
  font-size: 3em;
}

.title-font-size {
  font-size: 3.5em;
}

span {
  display: inline-block;
}

.text-body-small {
  padding-left: 0.7em;
}

/* Custom styling for the whole v-data-table */
.custom-data-table {
  color: #ff0;
  background-color: #111;
  line-height: 0.3em;
}

/* Custom styling for dark theme */
.custom-dark-theme {
  /* Your custom styles for the dark theme go here */
}

.div-result {
  margin-top: 0em;
  padding: 0;

}

.animation {
  position: relative;
}

.inner-div-animation {
  position: absolute;
  left: 28%;
}

@media screen and (max-height: 900px) {
.inner-div-animation {
  top: -23%;
  margin-top: 0em;
}
}

@media screen and (max-height: 670px) {
.inner-div-animation {
  top: -14%;
    margin-top: 0em;
}
}

@media screen and (max-height: 650px) {
.inner-div-animation {
  top: -16%;
    margin-top: 0em;
}
}

@media screen and (max-height: 640px) {
.inner-div-animation {
  top: -17%;
    margin-top: 0em;
}
}


@media screen and (max-width: 1350px) {
  .title-font-size {
    font-size: 3.2em;
  }

  .result-text {
    font-size: 2.4em;
  }

  .inner-div-animation {
    left: 25%;
  }
}

@media screen and (max-width: 1300px) {
  .title-font-size {
    font-size: 2.6em;
  }

  .result-text {
    font-size: 2em;
  }

  ::v-deep .no-padding-table .v-data-table__td {
    padding: 0 !important;
    /* Override Vuetify's default padding */
  }
}

@media screen and (max-width: 1200px) {
  .inner-div-animation {
    left: 24%;
  }
}

@media screen and (max-width: 1180px) {
  .inner-div-animation {
    left: 23%;
  }
}

@media screen and (max-width: 1150px) {
  .inner-div-animation {
    left: 22%;
  }
}

@media screen and (max-width: 1120px) {
  .inner-div-animation {
    left: 21%;
  }
}

@media screen and (max-width: 1060px) {
  .inner-div-animation {
    left: 19%;
  }
}

@media screen and (max-width: 980px) {
  .inner-div-animation {
    left: 17%;
  }
}

@media screen and (max-width: 940px) {
  .inner-div-animation {
    left: 15%;
  }
}

@media screen and (max-width: 900px) {
  .grid-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "box1 box1 box1 box2 box2"
      "box6 box6 box6 box6 box6"
      "box5 box5 box5 box5 box5"
      "box5 box5 box5 box5 box5";
  }

  .inner-div-animation {
    left: 5%;
  }
}

@media screen and (max-width: 850px) {
  .inner-div-animation {
    left: 3%;
  }
}

@media screen and (max-width: 820px) {
  .inner-div-animation {
    left: 1%;
  }
}

@media screen and (max-width: 780px) {
  .grid-container {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "box1 box1 box1 box1"
      "box6 box6 box6 box6"
      "box5 box5 box5 box5"
      "box5 box5 box5 box5";
  }

  .animation {
    display: none;
  }
}

@media screen and (max-width: 500px) {
  .result-text {
    font-size: 1.6em;
  }
}

@media screen and (max-width: 450px) {
  .title-font-size {
    font-size: 2em;
  }
}
</style>
