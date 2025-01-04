<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <aside class="flex flex-row laptop-md:flex-col w-full justify-between laptop-md:w-1/3">
        <div class="w-3/4 mobile-md:w-full">
          <h3 class="font-bold laptop-md:text-right text-wrap">
            {{ $t('votes.title') }}
          </h3>
          <p class="text-sm laptop-md:text-justify text-wrap text-gray-500 dark:text-gray-200">
            {{ $t('votes.hint') }}
          </p>
        </div>

        <div
          class="flex flex-row flex-wrap laptop-md:flex-nowrap justify-end laptop-md:flex-col items-center gap-2"
        >
          <UButton
            :label="$t('votes.buttons.mode', { mode: mode })"
            class="mt-0 laptop-md:mt-2 self-center laptop-md:self-end order-2 laptop-md:order-1"
            variant="outline"
            @click="toggleMode"
          />

          <UButton
            :label="$t('votes.buttons.reset')"
            class="mt-0 laptop-md:mt-2 self-center laptop-md:self-end order-1 laptop-md:order-2"
            @click="handleReset"
          />
        </div>
      </aside>
      <div class="w-full h-full flex self-center gap-4">
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
        <div class="flex justify-end w-48">
          <p v-if="mode === 'max'" class="text-lg font-semibold text-gray-600 dark:text-gray-200">
            {{ $t('votes.unit', { count: votes }) }}
          </p>
          <p v-else class="text-lg font-semibold text-gray-600 dark:text-gray-200">
            {{ $t('votes.unit', { count: votes ? Math.abs(votes - maxVotes) : maxVotes }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
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
</script>
