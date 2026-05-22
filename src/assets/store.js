import { ref } from 'vue'

export let status_text = ref("Status: Die Simulation wurde noch nicht gestartet...")

export let count_completed_experiments = ref(0)

export let k_slider = ref(6)
export let n_slider = ref(49)
export let count_trials = ref(1000)

export let count_wins = ref(0)
export let cost_sum = ref(0)
export let win_sum = ref(0)

export let simulation_running = ref(false)
export let experiments = ref([])

export let winCostCalcActive = ref(true);

export let bool_reload_anim = ref(true);

export let renderComponent = ref(true);


