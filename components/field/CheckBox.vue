<template>
  <UFormField v-slot="{ error }" size="xl" :name="name" class="sm:min-w-96 pb-6 text-justify">
    <UCheckbox
      v-model="model"
      :label="label"
      :name="name"
      :required="required"
      :help="help"
      :trailing-icon="error ? 'i-lucide:circle-x' : undefined"
      :ui="{ base: 'ring-primary-400' }"
    />
  </UFormField>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: false,
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
