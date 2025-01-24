<template>
  <div class="relative min-h-[92vh]">
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[92vh] opacity-30 bg-gradient-radial z-0"
      src="/img/background.webp"
      format="webp"
      preload
    />

    <div class="relative z-10 flex flex-col items-center justify-start min-h-[92vh] gap-4 pt-[2vh]">
      <h1 class="text-4xl text-[var(--ui-color-primary-400)] text-center font-bold">
        {{ $t('trending.title') }}
      </h1>
      <h2 class="text-center">
        {{ $t('trending.description') }}
      </h2>

      <div id="sticker" class="flex gap-30 mt-4 mb-4">
        <MovieSticker v-if="results_movies[0]" :item="results_movies[0]" />
        <MovieSticker v-if="results_tv[0]" :item="results_tv[0]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()

useHead({
  title: t('seo.pages.trending'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('seo.descriptions.trending')
    }
  ]
})

const selectedType = ref<'movie' | 'tv'>('movie')
const trending = ref(false)
const trend = ref<string>('')
const page = ref(1)
const totalPages = ref(0)
const results_movies = ref<any[]>([])
const results_tv = ref<any[]>([])

const trendingQuery = async (reset = false, showToast = true) => {
  if (reset) {
    page.value = 1
    results_movies.value = []
    results_tv.value = []
    totalPages.value = 0
  }
  if (page.value > totalPages.value && totalPages.value !== 0) return

  let dataMovies
  let dataTv

  try {
    trending.value = true

    const movieManager = new QueryParamsManager('/api/themoviedb/trending/movie')
    movieManager.add('query', trend.value || '')
    movieManager.add('page', page.value)
    movieManager.add('language', locale.value)

    dataMovies = await $fetch(movieManager.toString())
    // results_movies.value = data.results

    const tvManager = new QueryParamsManager('/api/themoviedb/trending/tv')
    tvManager.add('query', trend.value || '')
    tvManager.add('page', page.value)
    tvManager.add('language', locale.value)

    dataTv = await $fetch(tvManager.toString())
    // results_tv.value = data.results

    console.log(dataMovies, dataTv)

    page.value = dataMovies.page
    totalPages.value = dataMovies.total_pages
    results_movies.value = [...results_movies.value, ...dataMovies.results]
    results_tv.value = [...results_tv.value, ...dataTv.results]
  } catch (error) {
    console.error(error)
  } finally {
    trending.value = false
  }
}

onMounted(() => {
  trendingQuery()
})
</script>
