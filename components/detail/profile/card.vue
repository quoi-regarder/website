<template>
  <UCard :ui="{ body: 'p-0 sm:p-0', header: 'p-1 sm:p-1', footer: 'p-1 sm:p-1' }" class="h-full">
    <template #header>
      <ULink :to="localPath(`/${type}/${itemDetails.id}`)" class="block min-h-[3rem]">
        <h3 class="text-sm font-bold text-center line-clamp-2">
          {{ itemDetails.title }}
        </h3>
      </ULink>
    </template>

    <ULink :to="localPath(`/${type}/${itemDetails.id}`)" class="block">
      <NuxtImg
        v-if="itemDetails.posterPath"
        :src="getImageUrl(itemDetails.posterPath, 'w300')"
        width="300"
        height="450"
        class="w-full"
      />
      <USkeleton v-else class="w-full h-48" />
    </ULink>

    <template #footer>
      <p class="text-sm text-[var(--ui-text-secondary)]">
        {{ formatLocalDate(itemDetails.releaseDate) }}
      </p>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const localPath = useLocalePath()

const props = defineProps({
  movie: {
    type: Object as PropType<MovieWatchlist>,
    required: false,
    default: null
  },
  serie: {
    type: Object as PropType<SerieWatchlist>,
    required: false,
    default: null
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const itemDetails = computed(() => {
  if (props.type === 'movie') {
    return {
      id: props.movie?.tmdbId ?? '',
      title: props.movie?.movie?.translations?.[0]?.title ?? 'Unknown Title',
      posterPath: props.movie?.movie?.posterPath ?? '',
      releaseDate: props.movie?.movie?.releaseDate ?? ''
    }
  } else {
    return {
      id: props.serie?.tmdbId ?? '',
      title: props.serie?.serie?.translations?.[0]?.name ?? 'Unknown Series',
      posterPath: props.serie?.serie?.posterPath ?? '',
      releaseDate: props.serie?.serie?.firstAirDate ?? ''
    }
  }
})
</script>
