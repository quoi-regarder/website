<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <h3 class="text-4xl font-semibold">
      {{ $t(`trending.stickers.${type}`) }}
    </h3>

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
