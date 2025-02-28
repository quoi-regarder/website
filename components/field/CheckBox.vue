<template>
  <UFormField v-slot="{ error }" size="xl" :name="name" class="sm:min-w-96 pb-6 text-justify">
    <UCheckbox
      v-model="model"
      :label="label"
      :name="name"
      :required="required"
      :help="help"
      :trailing-icon="error ? 'i-lucide:exclamation-triangle' : undefined"
      :ui="{ base: 'ring-[var(--ui-color-primary-400)]' }"
    />
  </UFormField>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  help: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

const model = defineModel<boolean>()
</script>

<style></style>
