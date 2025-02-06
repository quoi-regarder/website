<template>
  <div class="relative min-h-[92vh]">
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[92vh] opacity-30 bg-gradient-radial z-0"
      src="/img/background.webp"
      format="webp"
      preload
    />

    <div class="relative z-10 flex flex-col items-center justify-evenly min-h-[92vh] gap-4">
      <div class="flex flex-col items-center justify-center gap-4">
        <h1 class="text-4xl text-[var(--ui-color-primary-400)] text-center font-bold">
          {{ $t('trending.title') }}
        </h1>
        <h2 class="text-center">
          {{ $t('trending.description') }}
        </h2>
      </div>

      <div
        v-if="isLoaded"
        class="flex flex-col max-w-[90%] xl:flex-row items-center justify-evenly gap-16"
      >
        <TrendingSticker :item="results_movies[0]" :genres="movies_genres" :type="'movie'" />
        <TrendingSticker :item="results_tv[0]" :genres="tv_genres" :type="'tv'" />
      </div>

      <div v-else class="flex flex-col xl:flex-row items-center justify-center gap-16 h-full">
        <USkeleton
          v-for="index in 2"
          :key="index"
          class="w-[600px] h-[500px] max-w-[90vw] rounded-lg shadow-xl"
        />
      </div>

      <UButton class="my-4 self-center" size="xl" variant="link" @click="toggleMoreTrending">
        <div class="flex flex-col items-center justify-center">
          <span>{{ $t('trending.more') }}</span>
          <UIcon
            :class="{ 'rotate-180': moreTrending }"
            class="text-[var(--ui-color-primary-400)] size-6 transition-all duration-300"
            name="i-heroicons-chevron-down"
          />
        </div>
      </UButton>
    </div>

    <div
      v-if="moreTrending || moreTrendingTransition"
      id="trendingList"
      :class="{
        'opacity-100 visible': moreTrending,
        'opacity-0 invisible': !moreTrending
      }"
      class="grid grid-cols-1 xl:grid-cols-[1fr_min-content_1fr] transition-all duration-1000 ease-in-out p-6 gap-12"
      @transitionend="handleTransitionEnd"
    >
      <!-- Colonne de gauche -->
      <div class="flex flex-col gap-4">
        <h3 class="text-4xl font-semibold text-center">
          {{ $t('trending.stickers.movie') }}
        </h3>
        <TrendingList
          v-for="(movie, index) in results_movies.slice(1)"
          :item="movie"
          :genres="movies_genres"
          :type="'movie'"
          :index="index"
        />
      </div>

      <!-- Séparateur central -->
      <USeparator orientation="vertical" class="hidden xl:block" />

      <!-- Colonne de droite -->
      <div class="flex flex-col gap-4">
        <h3 class="text-4xl font-semibold text-center">
          {{ $t('trending.stickers.tv') }}
        </h3>
        <TrendingList
          v-for="(tv, index) in results_tv.slice(1)"
          :item="tv"
          :genres="tv_genres"
          :type="'tv'"
          :index="index"
        />
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

const isLoaded = ref(false)
const results_movies = ref<any[]>([])
const results_tv = ref<any[]>([])
const movies_genres = ref<any[]>([])
const tv_genres = ref<any[]>([])

const moreTrending = ref(false)
const moreTrendingTransition = ref(false)

onMounted(async () => {
  await Promise.all([fetchTrendingMovies(), fetchTrendingTv(), fetchMovieGenres(), fetchTvGenres()])

  isLoaded.value = true
})

const fetchTrendingMovies = async () => {
  try {
    const manager = new QueryParamsManager('/api/themoviedb/trending/movie')
    manager.add('language', locale.value)

    const data = await $fetch(manager.toString())

    results_movies.value = data.results
  } catch (error) {
    console.error(error)
  }
}

const fetchTrendingTv = async () => {
  try {
    const manager = new QueryParamsManager('/api/themoviedb/trending/tv')
    manager.add('language', locale.value)

    const data = await $fetch(manager.toString())

    results_tv.value = data.results
  } catch (error) {
    console.error(error)
  }
}

const fetchMovieGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/movie/list')
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  movies_genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name
  }))
}

const fetchTvGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/tv/list')
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  tv_genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name
  }))
}

const toggleMoreTrending = () => {
  moreTrending.value = !moreTrending.value
  moreTrendingTransition.value = true
  setTimeout(() => {
    const scrollTarget = moreTrending.value ? document.getElementById('trendingList')?.offsetTop : 0
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }, 10)
}

const handleTransitionEnd = () => {
  if (!moreTrending.value) {
    moreTrendingTransition.value = false
  }
}
</script>
