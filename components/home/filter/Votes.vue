<template>
  <NuxtLayout name="filter" :title="$t('votes.title')" has-buttons>
    <template #buttons>
      <UButton
        :label="$t('votes.buttons.reset')"
        color="secondary"
        variant="subtle"
        class="order-1 lg:order-2"
        @click="filters.selectedVotes = 500"
      />
    </template>

    <template #content>
      <USlider
        v-model="filters.selectedVotes as number"
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
      />
      <div class="flex justify-end self-center min-w-32">
        <p class="text-lg font-semibold">
          {{ $t('votes.unit', { count: filters.selectedVotes }) }}
        </p>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { filters } = useFilters()
const minVotes = 0
const maxVotes = 1000
</script>
