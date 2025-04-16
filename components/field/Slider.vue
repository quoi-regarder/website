<template>
  <UFormField
    :hint="required ? undefined : $t('common.hint.optional')"
    :description="description"
    :label="label"
    :name="name"
    :required="required"
    class="text-justify w-full"
    size="xl"
  >
    <div class="flex items-center justify-between">
      <USlider
        v-model="model"
        :min="min"
        :max="max"
        :step="step || 1"
        :ui="{
          track: 'dark:bg-[var(--ui-bg-muted)]'
        }"
      />
      <div class="flex justify-end self-center w-20">
        <p class="text-lg font-semibold">
          {{ model }}
        </p>
        <p class="text-lg font-semibold">%</p>
      </div>
    </div>
    <template #error="{ error }">
      <span class="text-wrap">{{ error }}</span>
    </template>
  </UFormField>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  name: string
  required?: boolean
  description?: string
  min: number
  max: number
  step?: number
}>()

const model = defineModel<number | undefined>({
  required: true
})
</script>
