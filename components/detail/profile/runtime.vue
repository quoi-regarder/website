<!-- RuntimeDisplay.vue -->
<template>
  <UContainer>
    <div class="flex flex-wrap gap-4 justify-center items-center">
      <DetailProfileTimeUnit :value="years" unit="years" :always-show="true" />
      <DetailProfileTimeUnit
        :value="months"
        unit="months"
        :always-show="true"
        :force-two-digits="true"
      />
      <DetailProfileTimeUnit
        :value="days"
        unit="days"
        :always-show="true"
        :force-two-digits="true"
      />
      <DetailProfileTimeUnit
        :value="hours"
        unit="hours"
        :always-show="true"
        :force-two-digits="true"
      />
      <DetailProfileTimeUnit
        :value="minutes"
        unit="minutes"
        :always-show="true"
        :force-two-digits="true"
      />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps({
  runtime: {
    type: Number as PropType<number>,
    required: true
  }
})

// Computed properties for each time unit
const years = computed(() => Math.floor(props.runtime / 60 / 24 / 365))
const months = computed(() => Math.floor((props.runtime / 60 / 24 / 30) % 12))
const days = computed(() => Math.floor((props.runtime / 60 / 24) % 30))
const hours = computed(() => Math.floor((props.runtime / 60) % 24))
const minutes = computed(() => props.runtime % 60)
</script>
