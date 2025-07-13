<template>
  <UContainer
    class="w-full px-4 py-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <h1 class="text-3xl font-bold mb-8 text-primary-400">
      {{ t('profile.movie.title') }}
    </h1>

    <!-- watch time -->
    <h2 class="text-xl font-bold mb-4">
      {{ t('profile.movie.watchTime') }}
    </h2>

    <DetailProfileRuntime :runtime="totalRuntime" />

    <USeparator class="py-4" />

    <!-- favorites movies -->
    <UChip
      v-if="movieFavoriteStore.getCount > 0"
      :text="movieFavoriteStore.getCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.movie.favorites') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.movie.favorites') }}
    </h2>

    <div id="movies-favorites" class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && favoritesList.length > 0"
        ref="favoritesCarousel"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="favoritesList"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
        class-names
        wheel-gestures
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="relative flex items-center flex-col min-h-[350px]">
            <div class="w-full h-full">
              <DetailProfileCard :movie="item" type="movie" class="h-full" />
            </div>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="skeletonItems"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default>
          <USkeleton
            class="w-full min-h-[350px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
            :ui="{ base: 'rounded-lg' }"
          />
        </template>
      </UCarousel>

      <p v-else>
        {{ t('profile.movie.noFavorites') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <!-- to_watch movies -->
    <UChip
      v-if="movieListStore.getToWatchCount > 0"
      :text="movieListStore.getToWatchCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.movie.toWatch') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.movie.toWatch') }}
    </h2>

    <div id="movies-to-watch" class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && toWatchList.length > 0"
        ref="toWatchCarousel"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="toWatchList"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
        class-names
        wheel-gestures
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="flex items-center flex-col min-h-[350px]">
            <div class="w-full h-full">
              <DetailProfileCard :movie="item" type="movie" class="h-full" />
            </div>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="skeletonItems"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default>
          <USkeleton
            class="w-full min-h-[350px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
            :ui="{ base: 'rounded-lg' }"
          />
        </template>
      </UCarousel>

      <p v-else>
        {{ t('profile.movie.noToWatch') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <UChip
      v-if="movieListStore.getWatchedCount > 0"
      :text="movieListStore.getWatchedCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.movie.watched') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.movie.watched') }}
    </h2>

    <div id="movies-watched" class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && watchedList.length > 0"
        ref="watchedCarousel"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="watchedList"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
        class-names
        wheel-gestures
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="flex items-center flex-col min-h-[350px]">
            <div class="w-full h-full">
              <DetailProfileCard :movie="item" type="movie" class="h-full" />
            </div>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="skeletonItems"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default>
          <USkeleton
            class="w-full min-h-[350px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
            :ui="{ base: 'rounded-lg' }"
          />
        </template>
      </UCarousel>

      <p v-else>
        {{ t('profile.movie.noWatched') }}
      </p>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const movieListStore = useMovieListStore()
const movieFavoriteStore = useMovieFavoriteStore()
const movieWatchlistService = useMovieWatchlistService()
const movieFavoritesService = useMovieFavoriteService()
const { totalRuntime } = useMovieRuntimeChannel()

const toWatchCarousel = useTemplateRef('toWatchCarousel')
const watchedCarousel = useTemplateRef('watchedCarousel')
const favoritesCarousel = useTemplateRef('favoritesCarousel')
const watchedList = ref<Movie[]>([])
const toWatchList = ref<Movie[]>([])
const favoritesList = ref<Movie[]>([])
const watchedTotalPages = ref(1)
const toWatchTotalPages = ref(1)
const favoritesTotalPages = ref(1)
const watchedPage = ref(0)
const toWatchPage = ref(0)
const favoritesPage = ref(0)

const authStore = useAuthStore()
const { t } = useI18n()

const skeletonItems = Array.from({ length: 6 }, (_, i) => i)
const isLoaded = ref(false)

onMounted(async () => {
  await Promise.all([fetchToWatchLists(), fetchWatchedLists(), fetchFavoritesLists()])

  isLoaded.value = true
})

const fetchToWatchLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Movie>> | undefined =
    await movieWatchlistService.getWatchlistWithDetails?.(
      authStore.getUserId,
      WatchStatus.TO_WATCH,
      toWatchPage.value,
      20
    )

  if (response === undefined || !response.success) {
    return
  }

  if (reset) {
    toWatchList.value = response.data?.content ?? []
  } else {
    toWatchList.value = toWatchList.value.concat(response.data?.content ?? [])
  }

  toWatchTotalPages.value = response.data?.page.totalPages ?? 1
}

const fetchWatchedLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Movie>> | undefined =
    await movieWatchlistService.getWatchlistWithDetails?.(
      authStore.getUserId,
      WatchStatus.WATCHED,
      watchedPage.value,
      20
    )

  if (response === undefined || !response.success) {
    return
  }

  if (reset) {
    watchedList.value = response.data?.content ?? []
  } else {
    watchedList.value = watchedList.value.concat(response.data?.content ?? [])
  }

  watchedTotalPages.value = response.data?.page.totalPages ?? 1
}

const fetchFavoritesLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Movie>> | undefined =
    await movieFavoritesService.getFavoriteWithDetails(authStore.getUserId, favoritesPage.value, 20)

  if (response === undefined || !response.success) {
    return
  }

  if (reset) {
    favoritesList.value = response.data?.content ?? []
  } else {
    favoritesList.value = favoritesList.value.concat(response.data?.content ?? [])
  }

  favoritesTotalPages.value = response.data?.page.totalPages ?? 1
}

watch(toWatchCarousel, () => {
  if (toWatchCarousel.value?.emblaApi) {
    toWatchCarousel.value.emblaApi.on('select', () => {
      const index = toWatchCarousel.value?.emblaApi?.selectedScrollSnap()
      if (index === toWatchList.value.length - 6) {
        if (toWatchPage.value < toWatchTotalPages.value - 1) {
          toWatchPage.value++
        } else {
          return
        }

        fetchToWatchLists()
      }
    })
  }
})

watch(watchedCarousel, () => {
  if (watchedCarousel.value?.emblaApi) {
    watchedCarousel.value.emblaApi.on('select', () => {
      const index = watchedCarousel.value?.emblaApi?.selectedScrollSnap()
      if (index === watchedList.value.length - 6) {
        if (watchedPage.value < watchedTotalPages.value - 1) {
          watchedPage.value++
        } else {
          return
        }

        fetchWatchedLists()
      }
    })
  }
})

watch(favoritesCarousel, () => {
  if (favoritesCarousel.value?.emblaApi) {
    favoritesCarousel.value.emblaApi.on('select', () => {
      const index = favoritesCarousel.value?.emblaApi?.selectedScrollSnap()
      if (index === favoritesList.value.length - 6) {
        if (favoritesPage.value < favoritesTotalPages.value - 1) {
          favoritesPage.value++
        } else {
          return
        }

        fetchFavoritesLists()
      }
    })
  }
})
</script>
