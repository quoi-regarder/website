<template>
  <NuxtLayout name="filter" :title="$t('votes.title')" has-buttons>
    <template #buttons>
      <UButton :label="$t('votes.buttons.reset')" class="order-1 lg:order-2" @click="reset" />
    </template>

    <template #content>
      <USlider
        v-model="votes"
        :max="maxVotes"
        :min="minVotes"
        :step="1"
        class="w-full self-center"
        indicator
        :ui="{
          slider: {
            track: 'bg-[var(--ui-bg-accented)]'
          }
        }"
        @update:model-value="emit('update:selected-votes', $event)"
      />
      <div class="flex justify-end self-center min-w-32">
        <p class="text-lg font-semibold">
          {{ $t('votes.unit', { count: votes }) }}
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const votes = ref<number | number[] | undefined>(500)
const minVotes = 0
const maxVotes = 1000

const emit = defineEmits(['update:selected-votes'])

emit('update:selected-votes', votes.value)

const reset = () => {
  votes.value = 500
  emit('update:selected-votes', votes.value)
}

defineExpose({
  reset
})
</script>
