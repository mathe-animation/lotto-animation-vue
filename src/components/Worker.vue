<!-- https://vueuse.org/core/useWebWorkerFn/ -->

<template>
  <input type="number" v-model="term" min="1" />
  <button @click="onClick">Click me</button>

  <h1>
    {{ fibonnaciValue }}
  </h1>

  <v-btn id="btn-start-sim" block rounded="0" color="#cd0" variant="flat">
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

const { workerFn } = useWebWorkerFn(fibonacci);

async function onClick() {
  if (term.value) {
    fibonnaciValue.value = await workerFn(term.value);
  }
}
</script>

<script lang="js">
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
// `setup` is a special hook dedicated for the Composition API.
</script>