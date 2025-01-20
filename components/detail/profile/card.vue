<template>
  <ULink :to="localPath(`/movie/${movie.tmdb_id}`)" class="flex flex-col items-center">
    <UCard :ui="{ body: 'p-0 sm:p-0', header: 'p-1 sm:p-1', footer: 'p-1 sm:p-1' }">
      <template #header>
        <div class="flex justify-center items-center min-h-[3rem]">
          <ULink
            :to="localPath(`/movie/${movie.tmdb_id}`)"
            class="text-sm font-bold text-center line-clamp-2"
          >
            {{ movie.movie_translations[0].title }}
          </ULink>
        </div>
      </template>

      <NuxtImg :src="getImageUrl(movie.poster_path, 'w300')" width="300" height="450" />

      <template #footer>
        <p class="text-sm text-[var(--ui-text-secondary)]">
          {{ formatLocalDate(movie.release_date) }}
        </p>
      </template>
    </UCard>
  </ULink>
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
