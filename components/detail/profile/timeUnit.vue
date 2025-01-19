<template>
  <UCard v-if="showCard" class="w-24">
    <div class="flex flex-col items-center">
      <span
        v-if="value > 0"
        class="text-4xl font-mono font-bold text-[var(--ui-color-primary-400)]"
      >
        {{ displayValue }}
      </span>
      <span v-else class="text-4xl font-mono font-bold">
        {{ displayValue }}
      </span>
      <span class="text-xs">{{ $t(`time.${unit}`) }}</span>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    validator: (value: string) => ['years', 'months', 'days', 'hours', 'minutes'].includes(value)
  },
  alwaysShow: {
    type: Boolean,
    default: false
  },
  forceTwoDigits: {
    type: Boolean,
    default: false
  }
})

const showCard = computed(() => props.alwaysShow || props.value > 0)
const displayValue = computed(() =>
  props.forceTwoDigits ? props.value.toString().padStart(2, '0') : props.value
)
</script>
