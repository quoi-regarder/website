<template>
  <div class="flex flex-col items-center gap-y-8">
    <h3 class="text-xl text-semibold text-center">
      {{ $t('filter.type') }}
    </h3>

    <UButtonGroup orientation="horizontal">
      <UButton
        id="filter-movie"
        value="movie"
        color="secondary"
        size="lg"
        :variant="model === 'movie' ? 'solid' : 'outline'"
        class="cursor-pointer"
        icon="i-lucide:clapperboard"
        @click="model = 'movie'"
      >
        {{ $t('filter.options.movie') }}
      </UButton>
      <UButton
        id="filter-tv"
        value="tv"
        color="secondary"
        size="lg"
        :variant="model === 'tv' ? 'solid' : 'outline'"
        class="cursor-pointer"
        trailing-icon="i-lucide:tv-minimal-play"
        @click="model = 'tv'"
      >
        {{ $t('filter.options.tv') }}
      </UButton>
    </UButtonGroup>
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<'movie' | 'tv'>({ required: true })
</script>
