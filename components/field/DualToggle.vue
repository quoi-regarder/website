<template>
  <div>
    <UButton
      :value="leftValue"
      :ui="{ rounded: 'rounded-none rounded-l-md' }"
      :variant="modelValue === leftModelValue ? 'solid' : 'outline'"
      size="lg"
      @click="setValue(leftModelValue)"
    >
      {{ leftValue }}
    </UButton>
    <UButton
      :value="rightValue"
      :ui="{ rounded: 'rounded-none rounded-r-md' }"
      :variant="modelValue === rightModelValue ? 'solid' : 'outline'"
      size="lg"
      disabled
      @click="setValue(rightModelValue)"
    >
      {{ rightValue }}
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  leftValue: {
    type: String,
    required: true
  },
  leftModelValue: {
    type: String,
    required: true
  },
  rightValue: {
    type: String,
    required: true
  },
  rightModelValue: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits({
  'update:modelValue': {
    type: Function as PropType<(value: string) => void>,
    required: true
  }
})

// Méthode pour mettre à jour la valeur du modèle
const setValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>
