<template>
  <NuxtLayout name="filter" :title="$t('mark.title')" :description="$t('mark.description')">
    <template #content>
      <USlider
        v-model="sliderValue"
        :max="maxMark"
        :min="minMark"
        :step="1"
        class="w-full self-center"
        indicator
      />

      <div class="flex justify-end self-center w-20">
        <p class="text-lg font-semibold">
          {{ sliderValue }}
        </p>
        <p class="text-lg font-semibold">%</p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { filters } = useFilters()

const maxMark = 100
const minMark = 0

const sliderValue = computed({
  get: () => Math.round((filters.value.selectedMark || 0) * 10),
  set: (value: number) => {
    filters.value = {
      ...filters.value,
      selectedMark: value / 10
    }
  }
})
</script>
