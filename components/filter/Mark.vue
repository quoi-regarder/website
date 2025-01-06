<template>
  <NuxtLayout name="filter" :title="$t('mark.title')" :description="$t('mark.description')">
    <template #content>
      <URange
        v-model="mark"
        :max="maxMark"
        :min="0"
        :step="0.1"
        class="w-full self-center"
        indicator
        :ui="{
          track: {
            background:
              '[&::-webkit-slider-runnable-track]:dark:bg-gray-400 [&::-moz-range-track]:dark:bg-gray-400'
          }
        }"
      />

      <div class="flex justify-end self-center w-24">
        <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">
          {{ mark }}
        </p>
        <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">/</p>
        <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">
          {{ maxMark }}
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const mark = ref<number>(0)
const maxMark = 10

const emit = defineEmits(['update:selected-mark'])

const reset = () => {
  mark.value = 0
  emit('update:selected-mark', 0)
}

watch(mark, (value) => {
  emit('update:selected-mark', value)
})

defineExpose({
  reset
})
</script>
