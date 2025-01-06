<template>
  <NuxtLayout
    name="filter"
    :title="$t('votes.title')"
    :description="$t('votes.description')"
    :hint="$t('votes.hint')"
    has-buttons
    show-tooltip
  >
    <template #buttons>
      <UButton
        :label="$t('votes.buttons.mode', { mode: mode })"
        class="order-2 laptop-md:order-1"
        variant="outline"
        @click="toggleMode"
      />

      <UButton
        :label="$t('votes.buttons.reset')"
        class="order-1 laptop-md:order-2"
        @click="handleReset"
      />
    </template>

    <template #content>
      <URange
        v-model="votes"
        :max="maxVotes"
        :min="minVotes"
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
          {{ $t('votes.unit', { count: votes }) }}
        </p>
        <p v-else class="text-lg font-semibold text-gray-600 dark:text-gray-200">
          {{ $t('votes.unit', { count: votes !== null ? Math.abs(votes - maxVotes) : '' }) }}
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const votes = ref<number | null>(null)
const minVotes = 0
const maxVotes = 1000

const mode = ref<'min' | 'max'>('max')

const emit = defineEmits({
  'update:selected-votes': {
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
  votes.value = null
}

const reset = () => {
  votes.value = null
  mode.value = 'max'
  emit('update:selected-votes', null)
}

watchEffect(() => {
  if (!votes.value) {
    return
  }
  if (mode.value === 'min') {
    emit('update:selected-votes', Math.abs(votes.value - maxVotes))
  } else {
    emit('update:selected-votes', votes.value)
  }
  emit('update:mode', mode.value)
})

defineExpose({
  reset
})
</script>
