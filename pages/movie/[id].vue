<template>
  <div class="w-full flex flex-col justify-center items-center overflow-x-hidden">
    <!-- Header -->
    <LazyDetailMovieHeader
      v-if="movie"
      :title="movie?.title"
      :release-date="movie?.release_date"
      :poster-path="movie?.poster_path"
      :backdrop-path="movie?.backdrop_path"
      :vote-average="movie?.vote_average"
      :vote-count="movie?.vote_count"
      :overview="movie?.overview"
      :genres="movie?.genres"
      :runtime="movie?.runtime"
    />
    <USkeleton v-else class="w-full h-96" />

    <div class="w-full max-w-7xl p-4 space-y-8">
      <!-- Provider -->
      <LazyDetailCommonProvider
        v-if="movie"
        :providers="movie?.['watch/providers']?.results[locale.toUpperCase()]"
      />
      <USkeleton v-else class="w-full h-96" />

      <!-- Trailer -->
      <LazyDetailCommonTrailer v-if="movie" :videos="movie?.videos.results" />
      <USkeleton v-else class="w-full h-96" />

      <!-- Collection -->
      <LazyDetailMovieCollection
        v-if="movie && movie.belongs_to_collection"
        :collection="movie?.belongs_to_collection"
      />

      <!-- Casting -->
      <LazyDetailCommonCasting
        v-if="movie"
        :casts="movie?.credits.cast"
        :crews="movie?.credits.crew"
        :production="movie?.production_companies"
      />
      <USkeleton v-else class="w-full h-96" />

      <!-- Similar -->
      <LazyDetailCommonSimilar
        v-if="movie"
        :similar="movie?.similar.results"
        :genres="genres"
        :title="$t('similar.title.movies')"
      />
      <USkeleton v-else class="w-full h-96" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
useHead({
  title: t('seo.pages.detail.movie'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('seo.descriptions.detail.movie')
    }
  ]
})

const movie = ref<any>(null)
const genres = ref<Badge[]>([])

onMounted(async () => {
  await fetchMovie()
  await fetchGenres()
})

const fetchMovie = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/movie/${route.params.id}`)
  manager.add('language', locale.value)
  movie.value = await $fetch(manager.toString())
}

const fetchGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/movie/list')
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  genres.value = data.genres.map((genre: any, index: number) => ({
    id: genre.id,
    name: genre.name,
    color: getGenreColor(genre.id),
    selected: false
  }))
}
</script>
