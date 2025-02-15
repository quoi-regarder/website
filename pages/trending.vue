<template>
  <div class="relative min-h-[92vh]">
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[92vh] opacity-30 bg-gradient-radial z-0"
      src="/img/background.webp"
      format="webp"
      preload
    />
    <div class="flex flex-col items-center justify-center gap-4 py-8">
      <h1 class="text-4xl text-[var(--ui-color-primary-400)] text-center font-bold">
        {{ t('trending.title') }}
      </h1>
      <h2 class="text-center">
        {{ t('trending.description') }}
      </h2>
    </div>

    <UTabs :items="tabs" class="w-[90vw] pt-4 mx-auto z-10">
      <template #movies>
        <UContainer class="flex flex-col items-center gap-4 px-0 min-h-[72vh] justify-evenly pt-16">
          <div v-if="isLoaded" class="flex flex-col items-center justify-center gap-4 relative">
            <span
              class="text-7xl font-bold text-[var(--ui-color-primary-400)] absolute -top-16 md:-top-14 -left-6 md:-left-14 transform -rotate-25"
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
            variant="link"
            @click="toggleMoreTrending"
          >
            <div class="flex flex-col items-center justify-center">
              <span>{{ t('trending.more') }}</span>
              <UIcon
                :class="{ 'rotate-180': moreTrending }"
                class="text-[var(--ui-color-primary-400)] size-6 transition-all duration-300"
                name="i-heroicons-chevron-down"
              />
            </div>
          </UButton>
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
          <TrendingList
            v-for="(movie, index) in results_movies.slice(1)"
            :item="movie"
            :genres="movies_genres"
            :type="'movie'"
            :index="index"
          />
        </UContainer>
      </template>

      <template #tv>
        <UContainer class="flex flex-col items-center gap-4 px-0 min-h-[72vh] justify-evenly pt-16">
          <div v-if="isLoaded" class="flex flex-col items-center justify-center gap-4 relative">
            <span
              class="text-7xl font-bold text-[var(--ui-color-primary-400)] absolute -top-16 md:-top-14 -left-6 md:-left-14 transform -rotate-25"
            >
              #1
            </span>

            <MovieCard :item="results_tv[0]" :genres="tv_genres" :type="'tv'" class="z-10" />
          </div>

          <div v-else class="flex flex-col xl:flex-row items-center justify-center gap-16 h-full">
            <USkeleton class="w-full h-[500px] max-w-[90vw] rounded-lg shadow-xl" />
          </div>

          <UButton
            class="my-4 self-center z-10"
            size="xl"
            variant="link"
            @click="toggleMoreTrending"
          >
            <div class="flex flex-col items-center justify-center">
              <span>{{ t('trending.more') }}</span>
              <UIcon
                :class="{ 'rotate-180': moreTrending }"
                class="text-[var(--ui-color-primary-400)] size-6 transition-all duration-300"
                name="i-heroicons-chevron-down"
              />
            </div>
          </UButton>
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
          <TrendingList
            v-for="(tv, index) in results_tv.slice(1)"
            :item="tv"
            :genres="tv_genres"
            :type="'tv'"
            :index="index"
          />
        </UContainer>
      </template>
    </UTabs>
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
    icon: 'i-heroicons-film',
    slot: 'movies'
  },
  {
    label: t('trending.tabs.tv'),
    icon: 'i-heroicons-tv',
    slot: 'tv'
  }
]

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
  const data: any = await $fetch(manager.toString())

  movies_genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name
  }))
}

const fetchTvGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/tv/list')
  manager.add('language', locale.value)
  const data: any = await $fetch(manager.toString())

  tv_genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name
  }))
}

const toggleMoreTrending = async () => {
  moreTrending.value = !moreTrending.value
  moreTrendingTransition.value = true

  await nextTick()

  const carousel = document.getElementById('carousel')
  if (carousel) {
    const isMobile = window.innerWidth <= 768

    window.scrollTo({
      top: isMobile ? carousel.offsetTop - 70 : carousel.offsetTop - 250,
      behavior: 'smooth'
    })
  }
}

const handleTransitionEnd = () => {
  if (!moreTrending.value) {
    moreTrendingTransition.value = false
  }
}
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.7) 100%);
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
}
</style>
