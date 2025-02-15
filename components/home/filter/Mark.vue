<template>
  <NuxtLayout name="filter" :title="$t('mark.title')" :description="$t('mark.description')">
    <template #content>
      <USlider
        v-model="filters.selectedMark as number"
        :max="maxMark"
        :min="minVotes"
        :step="0.1"
        class="w-full self-center"
        indicator
        :ui="{
          slider: {
            track: 'bg-[var(--ui-bg-accented)]'
          }
        }"
      />

      <div class="flex justify-end self-center w-24">
        <p class="text-lg font-semibold">
          {{ filters.selectedMark }}
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
const { filters } = useFilters()
const minVotes = 0
const maxMark = 10
</script>
