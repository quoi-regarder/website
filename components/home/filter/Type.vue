<template>
  <div class="flex flex-col items-center gap-y-2">
    <h3 class="text-lg text-center">
      {{ $t('filter.type') }}
    </h3>

    <UButtonGroup orientation="horizontal">
      <UButton
        value="movie"
        size="lg"
        :variant="model === 'movie' ? 'solid' : 'outline'"
        class="cursor-pointer"
        @click="model = 'movie'"
      >
        {{ $t('filter.options.movie') }}
      </UButton>
      <UButton
        value="tv"
        size="lg"
        :variant="model === 'tv' ? 'solid' : 'outline'"
        class="cursor-pointer"
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
