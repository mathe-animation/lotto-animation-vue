<template>
  <v-app>
    <v-main>
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

<script lang="js" setup>
  import SimulationConfiguration from '@/components/SimulationConfiguration.vue'
</script>
