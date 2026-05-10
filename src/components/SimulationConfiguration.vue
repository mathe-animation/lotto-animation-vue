<template>

  <v-card style="margin: auto" width="600">
    <h1
        class="relative top-0 w-fit py-4 justify-center flex bg-gradient-to-r items-center from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-6xl font-extrabold text-transparent text-center select-auto">
        LOTTO: 6 aus 49
    </h1>
    <v-card-text>
      <v-slider v-model="k_slider" :min="1" :max="30" :step="1" class="ma-4" label="k: Anzahl der gezogenen Kugeln"
        hide-details>
        <template v-slot:append>
          <v-text-field v-model="k_slider" density="compact" style="width: 120px" type="number" variant="outlined"
            hide-details></v-text-field>
        </template>
      </v-slider>

      <v-slider v-model="n_slider" :min="1" :max="100" :step="1" class="ma-4" label="n: Anzahl der Kugeln insgesamt"
        hide-details>
        <template v-slot:append>
          <v-text-field v-model="n_slider" density="compact" style="width: 120px" type="number" variant="outlined"
            hide-details></v-text-field>
        </template>
      </v-slider>

      <v-slider v-model="count_trials" :min="1000" :max="500000000" :step="1000" class="ma-4"
        label="Anzahl der gekauften LOTTO-Scheine" hide-details>
        <template v-slot:append>
          <v-text-field v-model="count_trials" density="compact" style="width: 120px" type="number" variant="outlined"
            hide-details></v-text-field>
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { store } from './store.js'

const k_slider = ref(store.k)
const n_slider = ref(49)
const count_trials = ref(10000)
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
</style>
