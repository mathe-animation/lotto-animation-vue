<template>
  <v-card style="margin: auto" width="400">

    <v-card-text>
      <v-slider
        v-model="k_slider"
        :max="255"
        :step="1"
        class="ma-4"
        label="R"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="k_slider"
            density="compact"
            style="width: 80px"
            type="number"
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>
      </v-slider>

      <v-slider
        v-model="n_slider"
        :max="255"
        :step="1"
        class="ma-4"
        label="G"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="n_slider"
            density="compact"
            style="width: 80px"
            type="number"
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>
      </v-slider>

      <v-slider
        v-model="count_trials"
        :max="255"
        :step="1"
        class="ma-4"
        label="B"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="count_trials"
            density="compact"
            style="width: 80px"
            type="number"
            variant="outlined"
            hide-details
          ></v-text-field>
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const k_slider = ref(64)
  const n_slider = ref(128)
  const count_trials = ref(10)
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
