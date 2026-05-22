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
        <v-slider color="#ee0" v-model="k_slider" :min="1" :max="30" :step="1" lglabel="k: Anzahl der gezogenen Kugeln"
          hide-details>
          <template v-slot:append>
            <v-text-field v-model="k_slider" color="#ee0" density="compact" style="width: 150px; font-size: 0.9em;"
              type="number" variant="outlined" hide-details></v-text-field>
          </template>
        </v-slider>
      </div>
      <div class="div-slider">
        <div class="text-body-small">
          n (Anzahl Kugeln in Maschine):
        </div>
        <v-slider color="#ee0" v-model="n_slider" :min="1" :max="100" :step="1" class="ma-4"
          lglabel="n: Anzahl der Kugeln insgesamt" hide-details>
          <template v-slot:append>
            <v-text-field v-model="n_slider" color="#ee0" density="compact" style="width: 150px; font-size: 0.9em;"
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
        <v-select item-color="#ee0" v-model="count_trials" density="compact" :item-props="itemProps"
          :items="count_trials_poss_val"></v-select>
      </div>
      
      <div><Worker /></div>

      <span class="card-simulation-status"><b>{{ status_text }}</b></span>
      <p>
        {{ count_wins_text_field }}
      </p>


    </div>
    <div class="box yellow-border" style="grid-area: box5;">
      <div class="div-e-border" style="position: relative;">
          <ElectricBorder
    :color="'#ee0'"
    :speed="0"
    :chaos="0.000000001"
    :thickness="2"
    :style="{ borderRadius: '0px'}"
  >
    <div>
      
        <v-data-table-virtual v-model:sort-by="sortBy" style="background-color: #2d2d30; color: #ee0; position: relative; z-index: -1;" height="260" fixed-header density="compact" :items="experiments"
        class="no-padding-table"
        v-model:items-per-page="itemsPerPage"></v-data-table-virtual>
      
    </div>
  </ElectricBorder>
  </div>
    </div>


    <div class="box yellow-border animation" style="grid-area: box2; padding: 0; margin: 0;">
      <div class="inner-div-animation">
        <LottoAnimation class="lotto_animation" :key="bool_reload_anim" />
      </div>
    </div>

    <div class="box class-box6 yellow-border" style="grid-area: box6; line-break: strict; display: block;">
      <div class="div-result" :class="{divResultActive: winCostCalcActive}">
        <p class="count-wins-title result_text_heading_active">{{ "Gewinnanzahl:" }}</p>
        <span class="result-text result_text_count_wins">{{ count_wins.toLocaleString() }}</span>
      </div>
            <div class="div-result" :class="{active: winCostCalcActive}">

        <p class="count-wins-title" :class="{result_text_heading_active : winCostCalcActive}">{{ "Gewinn insgesamt (ca. 1 Mio. € pro Gewinn):" }}</p>
        <span class="result-text" :class="{result_text_win_sum_active : winCostCalcActive}">{{"≈" + parseInt(win_sum).toLocaleString() + "€"
        }}</span>
      </div>
      <div class="div-result" :class="{active: winCostCalcActive}">

        <p class="count-wins-title" :class="{result_text_heading_active : winCostCalcActive}">{{ "Kosten insgesamt (1,20€ pro Lottoschein):" }}</p>

        <span class="result-text" :class="{result_text_cost_active : winCostCalcActive}">{{cost_sum.toLocaleString() + "€" }}</span>
      </div>

    </div>
  </div>
</template>

<!--<script lang="js">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiRestart } from "@mdi/js"
import { mdiStopCircleOutline } from "@mdi/js"


export default {
  name: "my-cool-component",

  components: {
  },
  data() {
    return {
      pathRestart: mdiRestart,
      pathStop: mdiStopCircleOutline,
    }
  },
}
// `setup` is a special hook dedicated for the Composition API.
</script>-->

<script setup lang="js">
import { ref } from "vue"
import { nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import { useTheme } from 'vuetify'
import Worker from "./components/Worker.vue";
import { status_text } from './assets/store.js'
import { k_slider } from './assets/store.js'
import { n_slider } from './assets/store.js'
import { count_trials } from './assets/store.js'
import { count_wins } from './assets/store.js'
import { experiments } from './assets/store.js'
import { win_sum } from "./assets/store"
import { cost_sum } from './assets/store'
import { bool_reload_anim } from './assets/store'
import { renderComponent } from './assets/store'
import LottoAnimation from "./components/LottoAnimation.vue"
import ElectricBorder from "./components/ElectricBorder.vue";



const theme = useTheme()

theme.change('dark');

let viewport_width_bigger_900 = false;
let viewport_width;
let animation_big = true;

//let trial_counter_value = ref(0)

let price_lottoschein = 1.2
let count_wins_text_field = ref("")

const itemsPerPage = ref(4)
const sortBy = ref([{ key: 'Nr.', order: 'desc' }])


const winCostCalcActive = ref(true);

const count_trials_poss_val = [
  {
    value: 1000,
    description: '1 Tausend',
  },
  /*{
    value: 10000,
    description: '10 Tausend',
  },
  {
    value: 100000,
    description: '100 Tausend',
  },*/
  {
    value: 1000000,
    description: '1 Million',
  },
  /*{
    value: 10000000,
    description: '10 Millionen',
  },
  {
    value: 100000000,
    description: '100 Millionen',
  },*/
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

/*function colorRowItem(item) {
  if (item.item.some_property != undefined && item.item.some_property.includes("49")) {
    return { class: 'some_text' };
  } 
}*/

/*function update_animation() {
  renderComponent.value = false;
  renderComponent.value = true;
}*/

// Will execute myCallback every 0.5 seconds 
/*var intervalID = window.setInterval(myCallback, 500);

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
}*/


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
  color: #ee0;
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
  color: #220;
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
  color: #ee0;
  background-color: #111;
  line-height: 0.3em;
}

/* Custom styling for dark theme */
/*.custom-dark-theme {
  Your custom styles for the dark theme go here
}*/

.div-result {
  margin-top: 0em;
  padding: 0;

}

.result_text_heading_active {
  color: #ff0;
}

.result_text_count_wins {
  color: #fff;
}

.result_text_cost_active {
  color: #f00;
}

.result_text_win_sum_active {
  color: #0f0;
}

.inner-div-animation {
  /*position: absolute;
  left: 28%;
  top: 10%;*/
  margin: 0 auto 0 auto;
  width: 30vw;
}

@media screen and (max-height: 900px) {
  .inner-div-animation {
    margin: 3.5em auto 0 auto;
  }
}

/*@media screen and (max-height: 880px) {
  .inner-div-animation {
    top: 8%;
  }
}

@media screen and (max-height: 860px) {
  .inner-div-animation {
    top: 6%;
  }
}

@media screen and (max-height: 840px) {
  .inner-div-animation {
    top: 4%;
  }
}

@media screen and (max-height: 820px) {
  .inner-div-animation {
    top: 2%;
  }
}

@media screen and (max-height: 800px) {
  .inner-div-animation {
    top: 0%;
  }
}

@media screen and (max-height: 780px) {
  .inner-div-animation {
    top: -2%;
  }
}

@media screen and (max-height: 760px) {
  .inner-div-animation {
    top: -4%;
  }
}*/

@media screen and (max-height: 740px) {
  .inner-div-animation {
    margin: 2.2em auto 0 auto;
  }
}

@media screen and (max-height: 720px) {
  .inner-div-animation {
    margin: 1.7em auto 0 auto;
  }
}

@media screen and (max-height: 705px) {
  .inner-div-animation {
    margin: 1.6em auto 0 auto;
  }
}

@media screen and (max-height: 695px) {
  .inner-div-animation {
    margin: 1.1em auto 0 auto;
  }
}

@media screen and (max-height: 685px) {
  .inner-div-animation {
    margin: 0.6em auto 0 auto;
  }
}

@media screen and (max-height: 675px) {
  .inner-div-animation {
    margin: 0.4em auto 0 auto;
  }
}

@media screen and (max-height: 665px) {
  .inner-div-animation {
    margin: 0.2em auto 0 auto;
  }
}

/*@media screen and (max-height: 655px) {
  .inner-div-animation {
    margin: 0em auto 0 auto;
  }
}

@media screen and (max-height: 640px) {
  .inner-div-animation {
    top: -23%;
    margin-top: 0em;
  }
}*/

@media screen and (max-height: 655px) {
  .grid-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "box1 box1 box1 box1 box2 box2"
      "box6 box6 box6 box6 box6 box6"
      "box5 box5 box5 box5 box5 box5"
      "box5 box5 box5 box5 box5 box5";
}
  .inner-div-animation {
    left:0%;
  }
}

@media screen and (max-width: 1600px) {

  .inner-div-animation {
      width: 20vw;

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
      width: 25vw;

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
    padding: 0.7em !important;
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
    width: 27vw;
  }
}

@media screen and (max-width: 1100px) {
  .inner-div-animation {
    width: 29vw;
  }
}

@media screen and (max-width: 1010px) {
  .inner-div-animation {
    width: 30vw;
  }
}

@media screen and (max-width: 980px) {
  .inner-div-animation {
    width: 32vw;
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
    width: 37vw;
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
