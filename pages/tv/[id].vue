<template>
  <div class="w-full flex flex-col justify-center items-center overflow-x-hidden gap-y-4 my-4">
    <!-- Header -->
    <LazyDetailTvHeader
      v-if="tv"
      :name="tv?.name"
      :first-air-date="tv?.first_air_date"
      :last-air-date="tv?.last_air_date"
      :poster-path="tv?.poster_path"
      :backdrop-path="tv?.backdrop_path"
      :vote-average="tv?.vote_average"
      :vote-count="tv?.vote_count"
      :overview="tv?.overview"
      :genres="tv?.genres"
      :in-production="tv?.in_production"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Provider -->
    <LazyDetailCommonProvider
      v-if="tv"
      :providers="tv?.['watch/providers']?.results[locale.toUpperCase()]"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Trailer -->
    <LazyDetailCommonTrailer v-if="tv" :videos="tv?.videos.results" />
    <USkeleton v-else class="w-full h-96" />

    <!-- Seasons -->
    <LazyDetailTvSeasons v-if="tv" :seasons="tv?.seasons" />
    <USkeleton v-else class="w-full h-96" />

    <!-- Casting -->
    <LazyDetailCommonCasting
      v-if="tv"
      :casts="tv?.credits.cast"
      :crews="tv?.credits.crew"
      :production="tv?.production_companies"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Similar -->
    <LazyDetailCommonSimilar
      v-if="tv"
      :similar="tv?.similar.results"
      :genres="genres"
      :title="$t('similar.title.tv')"
      type="tv"
    />
    <USkeleton v-else class="w-full h-96" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()

useHead({
  title: t('seo.pages.detail.tv'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('seo.descriptions.detail.tv')
    }
  ]
})

const tv = ref<any>(null)
const genres = ref<Option[]>([])

onMounted(async () => {
  await fetchTv()
  await fetchGenres()
})

const fetchTv = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/tv/${route.params.id}`)
  manager.add('language', locale.value)
  tv.value = await $fetch(manager.toString())
}

const fetchGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/tv/list')
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  genres.value = data.genres.map((genre: any, index: number) => ({
    id: genre.id,
    label: genre.name,
    selected: false
  }))
}
</script>
