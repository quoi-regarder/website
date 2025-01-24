<template>
  <UCard :ui="{ body: 'p-0 sm:p-0', header: 'p-1 sm:p-1', footer: 'p-1 sm:p-1' }" class="h-full">
    <template #header>
      <ULink :to="localPath(`/movie/${movie.tmdbId}`)" class="block min-h-[3rem]">
        <h3 class="text-sm font-bold text-center line-clamp-2">
          {{ movie.movie?.translations?.[0].title }}
        </h3>
      </ULink>
    </template>

    <ULink :to="localPath(`/movie/${movie.tmdbId}`)" class="block">
      <NuxtImg
        v-if="movie.movie?.posterPath"
        :src="getImageUrl(movie.movie?.posterPath, 'w300')"
        width="300"
        height="450"
        class="w-full"
      />
      <USkeleton v-else class="w-full h-48" />
    </ULink>

    <template #footer>
      <p class="text-sm text-[var(--ui-text-secondary)]">
        {{ formatLocalDate(movie.movie?.releaseDate) }}
      </p>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const localPath = useLocalePath()

defineProps({
  movie: {
    type: Object as PropType<MovieWatchlist>,
    required: true
  }
})
</script>
