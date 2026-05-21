<!-- https://vueuse.org/core/useWebWorkerFn/ -->

<template>
  <input type="number" v-model="term" min="1" />
  <!--<button @click="onClick">Click me</button>
-->
  <h1>
    {{ fibonnaciValue }}
  </h1>

  <v-btn @click="onClick" id="btn-start-sim" block rounded="0" color="#cd0" variant="flat">
        <svg-icon type="mdi" :path="pathStart"></svg-icon>
        Simulation starten
      </v-btn>
</template>
<script setup lang="js">
import { useWebWorkerFn } from "@vueuse/core";
import { ref } from "vue";
import SvgIcon from '@jamescoyle/vue-icon';
import { simulation_running } from '../assets/store'
import { k_slider } from '../assets/store'
import { n_slider } from '../assets/store'
import { count_trials } from '../assets/store'
import { status_text } from '../assets/store'

let term = ref();
let fibonnaciValue = ref();

function fibonacci(num) {
  if (num === 1) return 0;
  if (num === 2) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

function lotto_experiment(n,k,number_trials) {
  const prob = Prob(n, k)
  //console.log("prob is " + String(prob))
  let count_wins_local = 0
  /*console.log("n ist " + String(n))
  console.log("k ist " + String(k))
  console.log("pls make alert before calc")
  console.log("number_trials ist " + String(number_trials))*/
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

const { workerFn } = useWebWorkerFn(lotto_experiment);

async function onClick() {
  if (simulation_running.value == false) {
    if (k_slider.value > n_slider.value) {
      alert("k muss kleiner oder gleich n sein...\n\nWenn in der LOTTO-Maschine zum Beispiel nur n=10 Kugeln sind, ist es nicht möglich k=11 Kugeln zu ziehen.")
    } else {
      console.log(simulation_running.value)
      simulation_running.value = true
      status_text.value = "Status: Simulation läuft..."
      let new_experiment_data = await workerFn(n_slider.value,k_slider.value, count_trials.value)
      experiments.value.push(new_experiment_data)
      count_completed_experiments = count_completed_experiments + 1
      price_lottoschein = 1.2
      
      if (k_slider.value == 6 && n_slider.value == 49) {
        winCostCalcActive.value = true
        cost_sum.value = count_trials.value * price_lottoschein
        win_sum.value = count_wins.value * 1000000 * (Prob(49, 6)/Prob(n_slider.value, k_slider.value))
      } else {
        winCostCalcActive.value = false
        cost_sum.value = 0
        win_sum.value = 0
      }
        simulation_running.value = false
      status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
    }
  }
}

/*function start_simulation() {

}*/

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
  var result = 1 / N
  return result
}

function LottoExperiment(n, k, number_trials) {
  const prob = Prob(n, k)
  //console.log("prob is " + String(prob))
  let count_wins_local = 0
  /*console.log("n ist " + String(n))
  console.log("k ist " + String(k))
  console.log("pls make alert before calc")
  console.log("number_trials ist " + String(number_trials))*/
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
</script>

<!--<script lang="js">
import { mdiPlay, mdiPlayBox } from "@mdi/js"

export default {
  name: "my-cool-component",

  components: {
  },
  data() {
    return {
      pathStart: mdiPlayBox,
    }
  },
}
</script>-->