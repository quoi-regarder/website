<template>
  <div class="relative min-h-[92vh]">
    <div
      class="bg-white/85 dark:bg-black/82 min-h-[95vh] w-full bg-[url('/img/background.webp')] bg-blend-overlay bg-cover bg-center bg-no-repeat absolute z-0"
    />

    <div class="relative z-10 flex flex-col items-center justify-center min-h-[95vh] gap-4">
      <div class="flex flex-col items-center justify-center gap-4 py-8">
        <h1 class="text-5xl text-primary-500 dark:text-primary-400 text-center font-bold">
          {{ t('trending.title') }}
        </h1>
        <h2 class="text-center text-2xl font-semibold">
          {{ t('trending.description') }}
        </h2>
      </div>

      <UTabs :items="tabs" class="w-[90vw] pt-4 mx-auto z-10">
        <template #movies>
          <UContainer
            class="flex flex-col items-center gap-4 px-0 min-h-[72vh] justify-evenly pt-16 sm:pt-6"
          >
            <div v-if="isLoaded" class="flex flex-col items-center justify-center gap-4 relative">
              <span
                class="text-7xl font-bold text-secondary-400 absolute -top-16 md:-top-14 -left-6 md:-left-14 transform -rotate-25"
              >
                #1
              </span>

              <MovieCard
                :item="results_movies[0]"
                :genres="movies_genres"
                :type="'movie'"
                class="z-10"
              />
            </div>

            <div v-else class="flex flex-col xl:flex-row items-center justify-center gap-16 h-full">
              <USkeleton class="w-full h-[500px] max-w-[90vw] rounded-lg shadow-xl" />
            </div>

            <UButton
              class="my-4 self-center z-10"
              size="xl"
              color="secondary"
              :trailing-icon="moreTrending ? 'i-lucide:chevron-up' : 'i-lucide:chevron-down'"
              :label="moreTrending ? t('trending.less') : t('trending.more')"
              @click="toggleMoreTrending"
            />
          </UContainer>

          <UContainer
            v-if="moreTrending || moreTrendingTransition"
            id="trendingList"
            :class="{
              'opacity-100 visible': moreTrending,
              'opacity-0 invisible': !moreTrending
            }"
            class="flex flex-col gap-4 py-8 px-0 transition-all duration-1000 ease-in-out"
            @transitionend="handleTransitionEnd"
          >
            <div class="flex flex-wrap justify-center gap-6">
              <TrendingCard
                v-for="(movie, index) in results_movies.slice(1)"
                :key="`movie-${movie.id}`"
                :item="movie"
                :genres="movies_genres"
                :type="'movie'"
                :rank="index + 2"
                class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
              />
            </div>
          </UContainer>
        </template>

        <template #tv>
          <UContainer
            class="flex flex-col items-center gap-4 px-0 min-h-[72vh] justify-evenly pt-16 sm:pt-6"
          >
            <div v-if="isLoaded" class="flex flex-col items-center justify-center gap-4 relative">
              <span
                class="text-7xl font-bold text-secondary-400 absolute -top-16 md:-top-14 -left-6 md:-left-14 transform -rotate-25"
              >
                #1
              </span>

              <MovieCard :item="results_tv[0]" :genres="tv_genres" :type="'tv'" class="z-10" />
            </div>

            <div v-else class="flex flex-col xl:flex-row items-center justify-center gap-16 h-full">
              <USkeleton class="w-full h-[500px] max-w-[90vw] rounded-lg shadow-xl" />
            </div>

            <UButton
              size="xl"
              color="secondary"
              :trailing-icon="moreTrending ? 'i-lucide:chevron-up' : 'i-lucide:chevron-down'"
              :label="moreTrending ? t('trending.less') : t('trending.more')"
              @click="toggleMoreTrending"
            />
          </UContainer>

          <UContainer
            v-if="moreTrending || moreTrendingTransition"
            id="trendingList"
            :class="{
              'opacity-100 visible': moreTrending,
              'opacity-0 invisible': !moreTrending
            }"
            class="flex flex-col gap-4 py-8 px-0 transition-all duration-1000 ease-in-out"
            @transitionend="handleTransitionEnd"
          >
            <div class="flex flex-wrap justify-center gap-6">
              <TrendingCard
                v-for="(tv, index) in results_tv.slice(1)"
                :key="`tv-${tv.id}`"
                :item="tv"
                :genres="tv_genres"
                :type="'tv'"
                :rank="index + 2"
                class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
              />
            </div>
          </UContainer>
        </template>
      </UTabs>
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

const tabs = [
  {
    label: t('trending.tabs.movies'),
    icon: 'i-lucide:clapperboard',
    slot: 'movies'
  },
  {
    label: t('trending.tabs.tv'),
    icon: 'i-lucide:tv-minimal-play',
    slot: 'tv'
  }
]

onMounted(async () => {
  await Promise.all([fetchTrendingMovies(), fetchTrendingTv(), fetchMovieGenres(), fetchTvGenres()])

  isLoaded.value = true
})

interface TmdbResponse {
  results: any[]
  [key: string]: any
}

const fetchTrendingMovies = async () => {
  try {
    const manager = new QueryParamsManager('/api/themoviedb/trending/movie')
    manager.add('language', locale.value)

    const data = await $fetch<TmdbResponse>(manager.toString())

    results_movies.value = data.results
  } catch (error) {
    console.error(error)
  }
}

const fetchTrendingTv = async () => {
  try {
    const manager = new QueryParamsManager('/api/themoviedb/trending/tv')
    manager.add('language', locale.value)

    const data = await $fetch<TmdbResponse>(manager.toString())

    results_tv.value = data.results
  } catch (error) {
    console.error(error)
  }
}

interface GenreResponse {
  genres: Array<{
    id: number
    name: string
  }>
}

const fetchMovieGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/movie/list')
  manager.add('language', locale.value)
  const data = await $fetch<GenreResponse>(manager.toString())

  movies_genres.value = data.genres.map((genre) => ({
    id: genre.id,
    label: formatGenre(genre.name)
  }))
}

const fetchTvGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/tv/list')
  manager.add('language', locale.value)
  const data = await $fetch<GenreResponse>(manager.toString())

  tv_genres.value = data.genres.map((genre) => ({
    id: genre.id,
    label: formatGenre(genre.name)
  }))
}

const toggleMoreTrending = async () => {
  moreTrending.value = !moreTrending.value
  moreTrendingTransition.value = true

  if (moreTrending.value) {
    nextTick(() => {
      const trendingList = document.getElementById('trendingList')
      const isMobile = window.innerWidth <= 768
      const offset = isMobile ? 70 : 250
      if (trendingList) {
        window.scrollTo({ top: trendingList.offsetTop - offset, behavior: 'smooth' })
      }
    })
  } else {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
}

const handleTransitionEnd = () => {
  if (!moreTrending.value) {
    moreTrendingTransition.value = false
  }
}
</script>
