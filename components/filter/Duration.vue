<template>
  <NuxtLayout
    name="filter"
    :title="$t('duration.title')"
    :description="$t('duration.description')"
    :hint="$t('duration.hint')"
    has-buttons
    show-tooltip
  >
    <template #buttons>
      <UButton
        :label="$t('duration.buttons.reset')"
        class="order-1 laptop-md:order-2"
        @click="reset"
      />
    </template>

    <template #content>
      <div class="w-full flex flex-col">
        <div class="w-full flex flex-col">
          <p class="text-sm text-gray-500 dark:text-gray-200">
            {{ $t('duration.mode.min') }}
          </p>
          <div class="flex w-full">
            <URange
              v-model="minDurationModel"
              :max="maxDuration"
              :min="minDuration"
              :step="1"
              class="w-full self-center"
              indicator
              :ui="{
                track: {
                  background:
                    '[&::-webkit-slider-runnable-track]:dark:bg-gray-400 [&::-moz-range-track]:dark:bg-gray-400'
                }
              }"
            />
            <div class="flex justify-end self-center min-w-32">
              <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">
                {{ $t('duration.unit', { count: minDurationModel }) }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col mt-4">
          <p class="text-sm text-gray-500 dark:text-gray-200">
            {{ $t('duration.mode.max') }}
          </p>
          <div class="w-full flex">
            <URange
              v-model="maxDurationModel"
              :max="maxDuration"
              :min="minDuration"
              :step="1"
              class="w-full self-center transform rotate-180"
              indicator
              :ui="{
                track: {
                  background:
                    '[&::-webkit-slider-runnable-track]:dark:bg-gray-400 [&::-moz-range-track]:dark:bg-gray-400'
                }
              }"
            />
            <div class="flex justify-end self-center min-w-32">
              <p class="text-lg font-semibold text-gray-600 dark:text-gray-200">
                {{
                  $t('duration.unit', {
                    count: maxDurationModel !== null ? maxDuration - maxDurationModel : 0
                  })
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const minDurationModel = ref<number | null>(0)
const maxDurationModel = ref<number | null>(0)
const minDuration = 0
const maxDuration = 400

const emit = defineEmits({
  'update:selected-min-duration': {
    type: Function as PropType<(value: number | null) => void>,
    required: true
  },
  'update:selected-max-duration': {
    type: Function as PropType<(value: number | null) => void>,
    required: true
  }
})

const reset = () => {
  minDurationModel.value = 0
  maxDurationModel.value = 0
}

watchEffect(() => {
  if (minDurationModel.value !== null && maxDurationModel.value !== null) {
    if (minDurationModel.value > maxDuration - maxDurationModel.value) {
      minDurationModel.value = maxDuration - maxDurationModel.value
    }
  }

  emit('update:selected-min-duration', minDurationModel.value)
  emit('update:selected-max-duration', maxDuration - maxDurationModel.value)
})

defineExpose({
  reset
})
</script>
