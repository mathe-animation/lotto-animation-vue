<template>
    <v-btn rounded="0">
        <svg-icon type="mdi" :path="pathRestart"></svg-icon>
        Button
    </v-btn>
    <v-btn rounded="0">
        <svg-icon type="mdi" :path="pathStart"></svg-icon>
        Button
    </v-btn>
    <v-card class="card-simulation-status" text="Status: Die Simulation wurde noch nicht gestartet..."></v-card>
</template>

<script>
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiRestart } from '@mdi/js'
    import { mdiPlayCircleOutline } from '@mdi/js';

    export default {
        name: "my-cool-component",

        components: {
            SvgIcon
        },

        data() {
            return {
                pathRestart: mdiRestart,
                pathStart: mdiPlayCircleOutline,
            }
        }
    }
</script>