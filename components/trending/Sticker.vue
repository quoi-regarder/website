<template>
  <div class="flex flex-col items-center justify-center gap-4 bg-[var(--ui-bg)]">
    <MovieCard :item="item" :genres="genres" :type="type" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  genres: {
    type: Array as PropType<Option[]>,
    required: true
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})
</script>
