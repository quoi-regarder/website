<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full laptop-md:w-1/3">
        <h3 class="font-bold laptop-md:text-right text-wrap">
          {{ $t('mark.title') }}
        </h3>
        <p class="text-sm laptop-md:text-justify text-wrap text-gray-500 dark:text-gray-200">
          {{ $t('mark.hint') }}
        </p>
      </div>
      <div class="w-full h-full flex self-center gap-4">
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

        <div class="flex justify-end w-24">
          <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">
            {{ mark }}
          </p>
          <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">/</p>
          <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">
            {{ maxMark }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const mark = ref<number>(0)
const maxMark = 10

const emit = defineEmits(['update:selected-mark'])

watch(mark, (value) => {
  emit('update:selected-mark', value)
})
</script>
