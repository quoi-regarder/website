<template>
  <div class="w-full flex flex-col justify-center items-center overflow-x-hidden gap-y-4 my-4">
    <!-- Header -->
    <LazyDetailMovieHeader
      v-if="isLoaded"
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

    <!-- Provider -->
    <LazyDetailCommonProvider
      v-if="isLoaded"
      :providers="movie?.['watch/providers']?.results[locale.toUpperCase()]"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Trailer -->
    <LazyDetailCommonTrailer v-if="isLoaded" :videos="movie?.videos.results" />
    <USkeleton v-else class="w-full h-96" />

    <!-- Collection -->
    <LazyDetailMovieCollection
      v-if="movie && movie.belongs_to_collection"
      :collection="movie?.belongs_to_collection"
    />

    <!-- Casting -->
    <LazyDetailCommonCasting
      v-if="isLoaded"
      :casts="movie?.credits.cast"
      :crews="movie?.credits.crew"
      :production="movie?.production_companies"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Similar -->
    <LazyDetailCommonSimilar
      v-if="isLoaded"
      :similar="movie?.similar.results"
      :genres="genres"
      :title="$t('similar.title.movies')"
    />
    <USkeleton v-else class="w-full h-96" />
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
const genres = ref<Option[]>([])
const isLoaded = ref(false)

onMounted(async () => {
  await fetchMovie()
  await fetchGenres()

  isLoaded.value = true
})

const fetchMovie = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/movie/${route.params.id}`)
  manager.add('language', locale.value)

  await $fetch(manager.toString()).then((data: any) => {
    movie.value = data
  })
}

const fetchGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/movie/list')
  manager.add('language', locale.value)

  await $fetch(manager.toString()).then((data: any) => {
    genres.value = data.genres.map((genre: any) => ({
      id: genre.id,
      label: genre.name,
      selected: false
    }))
  })
}
</script>
