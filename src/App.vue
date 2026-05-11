<template>
  <v-app>
    <v-main>
      <LottoAnimation />
      <SimulationConfiguration />
      <v-btn
        class="m-2"
        icon="mdi-theme-light-dark"
        location="top right"
        position="absolute"
        @click="$vuetify.theme.cycle()"
      />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import SimulationConfiguration from '@/components/SimulationConfiguration.vue'
  import LottoAnimation from '@/components/LottoAnimation.vue'
import TrialCounter from './components/TrialCounter.vue';
</script>
