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

const years = computed(() =>
  isFinite(props.runtime) ? Math.floor(props.runtime / 60 / 24 / 365) : 0
)
const months = computed(() =>
  isFinite(props.runtime) ? Math.floor((props.runtime / 60 / 24 / 30) % 12) : 0
)
const days = computed(() =>
  isFinite(props.runtime) ? Math.floor((props.runtime / 60 / 24) % 30) : 0
)
const hours = computed(() => (isFinite(props.runtime) ? Math.floor((props.runtime / 60) % 24) : 0))
const minutes = computed(() => (isFinite(props.runtime) ? Math.floor(props.runtime % 60) : 0))
</script>
