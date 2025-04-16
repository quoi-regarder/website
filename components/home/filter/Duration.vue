<template>
  <NuxtLayout name="filter" :title="$t('duration.title')" has-buttons>
    <template #buttons>
      <UButton
        :label="$t('duration.buttons.reset')"
        variant="subtle"
        color="secondary"
        class="order-1 lg:order-2"
        @click="filters.selectedDuration = [minDuration, maxDuration]"
      />
    </template>

    <template #content>
      <div class="w-full h-full flex flex-col items-start justify-evenly">
        <USlider
          v-model="filters.selectedDuration as number[]"
          :max="maxDuration"
          :min="minDuration"
          :step="1"
          class="w-full self-center"
          indicator
          :ui="{
            track: 'bg-[var(--ui-bg-accented)]'
          }"
        />

        <div class="flex gap-x-1">
          <p>
            {{ $t('duration.between') }}
          </p>
          <p>
            {{ $t('duration.unit', { count: filters.selectedDuration?.[0] }) }}
          </p>
          <p>
            {{ $t('duration.and') }}
          </p>
          <p>
            {{ $t('duration.unit', { count: filters.selectedDuration?.[1] }) }}
          </p>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { filters } = useFilters()
const minDuration = 0
const maxDuration = 400
</script>
