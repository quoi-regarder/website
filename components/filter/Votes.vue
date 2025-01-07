<template>
  <NuxtLayout name="filter" :title="$t('votes.title')" has-buttons>
    <template #buttons>
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
          {{ $t('votes.unit', { count: votes }) }}
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const votes = ref<number | null>(null)
const minVotes = 0
const maxVotes = 1000

const emit = defineEmits({
  'update:selected-votes': {
    type: Function as PropType<(value: number | null) => void>,
    required: true
  }
})

const handleReset = () => {
  votes.value = null
}

const reset = () => {
  votes.value = null
  emit('update:selected-votes', null)
}

watchEffect(() => {
  if (!votes.value) {
    return
  }

  emit('update:selected-votes', votes.value)
})

defineExpose({
  reset
})
</script>
