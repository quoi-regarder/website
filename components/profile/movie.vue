<template>
  <UContainer
    class="w-full px-4 py-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <h1 class="text-3xl font-bold mb-8 text-[var(--ui-color-primary-400)]">
      {{ $t('profile.movie.title') }}
    </h1>

    <!-- watch time -->
    <h2 class="text-xl font-bold mb-4">
      {{ $t('profile.movie.watchTime') }}
    </h2>

    <DetailProfileRuntime :runtime="getTotalRuntime" />

    <USeparator class="py-4" />

    <!-- to_watch movies -->
    <UChip
      v-if="getToWatchCount > 0"
      :text="getToWatchCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ $t('profile.movie.toWatch') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ $t('profile.movie.toWatch') }}
    </h2>

    <div class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && toWatchList.length > 0"
        ref="toWatchCarousel"
        :items="toWatchList"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="relative flex items-center flex-col">
            <DetailProfileCard :movie="item" />

            <UButton
              trailing-icon="i-lucide-eye"
              class="absolute top-15 right-1"
              @click="addToWatchedLists(item.tmdbId)"
            >
              {{ $t('common.content.add_to_viewed_list') }}
            </UButton>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :items="skeletonItems"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default>
          <USkeleton
            class="w-full h-[300px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
            :ui="{ base: 'rounded-lg' }"
          />
        </template>
      </UCarousel>

      <p v-else>
        {{ $t('profile.movie.noToWatch') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <UChip
      v-if="getWatchedCount > 0"
      :text="getWatchedCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ $t('profile.movie.watched') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ $t('profile.movie.watched') }}
    </h2>

    <div class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && watchedList.length > 0"
        ref="watchedCarousel"
        :items="watchedList"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="flex items-center flex-col">
            <DetailProfileCard :movie="item" />
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :items="skeletonItems"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default>
          <USkeleton
            class="w-full h-[300px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
            :ui="{ base: 'rounded-lg' }"
          />
        </template>
      </UCarousel>

      <p v-else>
        {{ $t('profile.movie.noWatched') }}
      </p>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { getToWatchCount, getWatchedCount, getTotalRuntime } = useMovieListStore()
const movieWatchlistService = useMovieWatchlistService()

const toWatchCarousel = useTemplateRef('toWatchCarousel')
const watchedCarousel = useTemplateRef('watchedCarousel')
const watchedList = ref<MovieWatchlist[]>([])
const toWatchList = ref<MovieWatchlist[]>([])
const watchedTotalPages = ref(1)
const toWatchTotalPages = ref(1)
const watchedPage = ref(1)
const toWatchPage = ref(1)

const { getUserId } = useAuthStore()
const { t } = useI18n()

const skeletonItems = Array.from({ length: 6 }, (_, i) => i)
const isLoaded = ref(false)

onMounted(async () => {
  await fetchToWatchLists()
  await fetchWatchedLists()

  isLoaded.value = true
})

const addToWatchedLists = async (tmdb_id: number) => {
  await movieWatchlistService.updateWatchlist(getUserId.value, tmdb_id, WatchStatus.WATCHED)
  watchedPage.value = 1
  toWatchPage.value = 1

  await fetchToWatchLists(true)
  await fetchWatchedLists(true)

  useNotifications().success(
    t('common.toasts.title.success'),
    t('common.content.toasts.success.movie.addedToList.watched')
  )
}

const fetchToWatchLists = async (reset = false) => {
  const response = await movieWatchlistService.getWatchlistWithDetails(
    getUserId.value,
    WatchStatus.TO_WATCH,
    toWatchPage.value,
    20
  )

  if (reset) {
    toWatchList.value = response.data
  } else {
    toWatchList.value = toWatchList.value.concat(response.data)
  }
  toWatchTotalPages.value = response.meta.lastPage
}

const fetchWatchedLists = async (reset = false) => {
  const response = await movieWatchlistService.getWatchlistWithDetails(
    getUserId.value,
    WatchStatus.WATCHED,
    watchedPage.value,
    20
  )

  if (reset) {
    watchedList.value = response.data
  } else {
    watchedList.value = watchedList.value.concat(response.data)
  }
  watchedTotalPages.value = response.meta.lastPage
}

watch(toWatchCarousel, () => {
  if (toWatchCarousel.value?.emblaApi) {
    toWatchCarousel.value.emblaApi.on('select', () => {
      const index = toWatchCarousel.value?.emblaApi?.selectedScrollSnap()
      if (index === toWatchList.value.length - 6) {
        if (toWatchPage.value < toWatchTotalPages.value) {
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
        if (watchedPage.value < watchedTotalPages.value) {
          watchedPage.value++
        } else {
          return
        }

        fetchWatchedLists()
      }
    })
  }
})
</script>
