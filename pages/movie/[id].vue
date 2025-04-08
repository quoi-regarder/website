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
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()

useSeoMeta({
  title: t('seo.pages.detail.movie'),
  description: t('seo.descriptions.detail.movie'),
  ogTitle: t('seo.pages.detail.movie'),
  ogDescription: t('seo.descriptions.detail.movie'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebPage({
    name: t('seo.pages.detail.movie'),
    description: t('seo.descriptions.detail.movie'),
    inLanguage: locale.value
  })
])

const movie = ref<any>(null)
const { genres } = useTmdbGenres('movie')
const isLoaded = ref(false)

onMounted(async () => {
  await fetchMovie()
  isLoaded.value = true
})

const fetchMovie = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/movie/${route.params.id}`)
  manager.add('language', locale.value)

  await $fetch(manager.toString()).then((data: any) => {
    movie.value = data
  })
}
</script>
