<template>
  <NuxtLayout
    name="filter"
    :title="$t('duration.title')"
    :description="$t('duration.description')"
    has-buttons
  >
    <template #buttons>
      <UButton
        :label="$t('duration.buttons.mode', { mode: mode })"
        class="order-2 laptop-md:order-1"
        variant="outline"
        @click="toggleMode"
      />

      <UButton
        :label="$t('duration.buttons.reset')"
        class="order-1 laptop-md:order-2"
        @click="handleReset"
      />
    </template>

    <template #content>
      <URange
        v-model="duration"
        :max="maxDuration"
        :min="minDuration"
        :step="1"
        class="w-full self-center"
        :class="mode === 'max' ? '' : 'transform rotate-180'"
        indicator
        :ui="{
          track: {
            background:
              '[&::-webkit-slider-runnable-track]:dark:bg-gray-400 [&::-moz-range-track]:dark:bg-gray-400'
          }
        }"
      />
      <div class="flex justify-end self-center min-w-32">
        <p v-if="mode === 'max'" class="text-lg font-semibold text-gray-600 dark:text-gray-200">
          {{ $t('duration.unit', { count: duration }) }}
        </p>
        <p v-else class="text-lg font-semibold text-gray-600 dark:text-gray-200">
          {{
            $t('duration.unit', {
              count: duration !== null ? Math.abs(duration - maxDuration) : ''
            })
          }}
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const duration = ref<number | null>(null)
const minDuration = 0
const maxDuration = 400

const mode = ref<'min' | 'max'>('max')

const emit = defineEmits({
  'update:selected-duration': {
    type: Function as PropType<(value: number | null) => void>,
    required: true
  },
  'update:mode': {
    type: Function as PropType<(mode: 'min' | 'max') => void>,
    required: false
  }
})

const toggleMode = () => {
  mode.value = mode.value === 'min' ? 'max' : 'min'
}

const handleReset = () => {
  duration.value = null
}

watchEffect(() => {
  if (!duration.value) {
    return
  }
  if (mode.value === 'min') {
    emit('update:selected-duration', Math.abs(duration.value - maxDuration))
  } else {
    emit('update:selected-duration', duration.value)
  }
  emit('update:mode', mode.value)
})
</script>
