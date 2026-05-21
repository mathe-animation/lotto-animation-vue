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
  if (this.$parent.simulation_running.value == false) {
    if (this.$parent.k_slider.value > this.$parent.n_slider.value) {
      alert("k muss kleiner oder gleich n sein...\n\nWenn in der LOTTO-Maschine zum Beispiel nur n=10 Kugeln sind, ist es nicht möglich k=11 Kugeln zu ziehen.")
    } else {
      console.log(simulation_running.value)
      simulation_running.value = true
      this.$parent.status_text.value = "Status: Simulation läuft..."
      let new_experiment_data = await workerFn(this.$parent.n_slider.value,this.$parent.k_slider.value, this.$parent.count_trials.value)
      this.$parent.experiments.value.push(new_experiment_data)
      this.$parent.count_completed_experiments = count_completed_experiments + 1
      price_lottoschein = 1.2
      
      if (k_slider.value == 6 && n_slider.value == 49) {
        winCostCalcActive.value = true
        this.$parent.cost_sum.value = this.$parent.count_trials.value * price_lottoschein
        this.$parent.win_sum.value = this.$parent.count_wins.value * 1000000 * (Prob(49, 6)/Prob(this.$parent.n_slider.value, this.$parent.k_slider.value))
      } else {
        winCostCalcActive.value = false
        this.$parent.cost_sum.value = 0
        this.$parent.win_sum.value = 0
      }
        this.$parent.simulation_running.value = false
      this.$parent.status_text.value = "Status: Die Simulation wurde noch nicht gestartet..."
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