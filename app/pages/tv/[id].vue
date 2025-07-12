<template>
  <div class="w-full flex flex-col justify-center items-center overflow-x-hidden gap-y-4 my-4">
    <!-- Header -->
    <LazyDetailTvHeader
      v-if="isLoaded"
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
      :provider-ids="extractAllProviderIds(tv?.['watch/providers']?.results[locale.toUpperCase()])"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Provider -->
    <LazyDetailCommonProvider
      v-if="isLoaded"
      :providers="tv?.['watch/providers']?.results[locale.toUpperCase()]"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Trailer -->
    <LazyDetailCommonTrailer v-if="isLoaded" :videos="tv?.videos.results" />
    <USkeleton v-else class="w-full h-96" />

    <!-- Seasons -->
    <LazyDetailTvSeasons
      v-if="isLoaded"
      :seasons="tv?.seasons"
      :provider-ids="extractAllProviderIds(tv?.['watch/providers']?.results[locale.toUpperCase()])"
    />
    <USkeleton v-else class="w-full h-96" />

    <!-- Casting -->
    <LazyDetailCommonCasting
      v-if="isLoaded"
      :casts="tv?.credits.cast"
      :crews="tv?.credits.crew"
      :production="tv?.production_companies"
    />
    <USkeleton v-else class="w-full h-96" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
useSerieEpisodeListChannel()
useSerieSeasonListChannel()

useSeoMeta({
  title: t('seo.pages.detail.tv'),
  description: t('seo.descriptions.detail.tv'),
  ogTitle: t('seo.pages.detail.tv'),
  ogDescription: t('seo.descriptions.detail.tv'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebPage({
    name: t('seo.pages.detail.tv'),
    description: t('seo.descriptions.detail.tv'),
    inLanguage: locale.value
  })
])

const tv = ref<any>(null)
const { genres } = useTmdbGenres('tv')
const isLoaded = ref(false)

onMounted(async () => {
  await fetchTv()
  isLoaded.value = true
})

const fetchTv = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/tv/${route.params.id}`)
  manager.add('language', locale.value)

  await $fetch(manager.toString()).then((data: any) => {
    tv.value = data
  })
}
</script>
