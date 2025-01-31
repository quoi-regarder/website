<template>
  <UContainer
    class="w-full sm:p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]"
  >
    <h2 class="text-2xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
      {{ title }}
    </h2>

    <div v-if="similar?.length > 0" class="flex justify-center">
      <UCarousel
        :items="similar"
        class-names
        auto-height
        class="max-w-[75vw] w-11/12"
        arrows
        :ui="{
          item: 'basis-full 2xl:basis-[65%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
        }"
      >
        <template #default="{ item }">
          <div class="flex items-center flex-col">
            <MovieCard :genres="genres" :item="item" class="h-full" :type="type" />
          </div>
        </template>
      </UCarousel>
    </div>

    <p v-else>
      {{ $t('similar.no_similar') }}
    </p>
  </UContainer>
</template>

<script lang="ts" setup>
defineProps({
  similar: {
    type: Object as PropType<any>,
    required: false,
    default: null
  },
  genres: {
    type: Array as PropType<Option[]>,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: false,
    default: 'movie'
  }
})
</script>
