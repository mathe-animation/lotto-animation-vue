<template>
    <v-card class="card-simulation-status">Anzahl der Versuche</v-card>
    <v-card class="card-simulation-status">{{ trial_counter_value }}</v-card>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const trial_counter_value = ref(0)
</script>