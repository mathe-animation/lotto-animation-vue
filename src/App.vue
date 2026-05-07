<template>
  <v-app>
    <v-main>
      <HelloWorld />
      <Animation />
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
  import HelloWorld from '@/components/HelloWorld.vue'
  import Animation from '@/components/Animation.vue'
</script>
