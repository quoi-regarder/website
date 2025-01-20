<template>
  <UCard :ui="{ body: 'p-0 sm:p-0', header: 'p-1 sm:p-1', footer: 'p-1 sm:p-1' }" class="h-full">
    <template #header>
      <ULink :to="localPath(`/movie/${movie.tmdb_id}`)" class="block min-h-[3rem]">
        <h3 class="text-sm font-bold text-center line-clamp-2">
          {{ movie.title }}
        </h3>
      </ULink>
    </template>

    <ULink :to="localPath(`/movie/${movie.tmdb_id}`)" class="block">
      <NuxtImg
        :src="getImageUrl(movie.poster_path, 'w300')"
        width="300"
        height="450"
        class="w-full"
      />
    </ULink>

    <template #footer>
      <p class="text-sm text-[var(--ui-text-secondary)]">
        {{ formatLocalDate(movie.release_date) }}
      </p>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const localPath = useLocalePath()

defineProps({
  movie: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>
