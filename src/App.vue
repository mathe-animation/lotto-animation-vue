<template>
  <v-app>
    <v-main>
      <Calculations />
      <Animation />
      <Configuration />
      <StartStop />
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
  import Calculations from '@/components/Calculations.vue'
  import Configuration from '@/components/Configuration.vue'
  import StartStop from '@/components/StartStop.vue'
  import Animation from '@/components/Animation.vue'
</script>
