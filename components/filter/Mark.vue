<template>
  <NuxtLayout name="filter" :title="$t('mark.title')" :description="$t('mark.description')">
    <template #content>
      <USlider
        v-model="mark"
        :max="maxMark"
        :min="0"
        :step="0.1"
        class="w-full self-center"
        indicator
        :ui="{
          slider: {
            track: 'bg-[var(--ui-bg-accented)]'
          }
        }"
        @update:model-value="emit('update:selected-mark', $event)"
      />

      <div class="flex justify-end self-center w-24">
        <p class="text-lg font-semibold">
          {{ mark }}
        </p>
        <p class="text-lg font-semibold">/</p>
        <p class="text-lg font-semibold">
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

defineExpose({
  reset
})
</script>
