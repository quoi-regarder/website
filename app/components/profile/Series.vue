<template>
  <UContainer
    class="w-full px-4 py-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <h1 class="text-3xl font-bold mb-8 text-primary-400">
      {{ t('profile.serie.title') }}
    </h1>

    <!-- watch time -->
    <h2 class="text-xl font-bold mb-4">
      {{ t('profile.serie.watchTime') }}
    </h2>

    <DetailProfileRuntime :runtime="totalRuntime" />

    <USeparator class="py-4" />

    <!-- favorite series -->
    <UChip
      v-if="serieFavoriteStore.getCount > 0"
      :text="serieFavoriteStore.getCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.serie.favorites') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.serie.favorites') }}
    </h2>

    <div id="series-favorites" class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && favoriteList.length > 0"
        ref="favoriteCarousel"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="favoriteList"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
        class-names
        wheel-gestures
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="flex items-center flex-col min-h-[350px]">
            <div class="w-full h-full">
              <DetailProfileCard :serie="item" type="tv" class="h-full" />
            </div>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :items="skeletonItems"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
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
        {{ t('profile.serie.noFavorites') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <!-- to_watch series -->
    <UChip
      v-if="serieListStore.getToWatchCount > 0"
      :text="serieListStore.getToWatchCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.serie.toWatch') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.serie.toWatch') }}
    </h2>

    <div id="series-to-watch" class="flex justify-center min-h-[300px] items-center">
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
          <div :key="item.tmdbId" class="relative flex items-center flex-col min-h-[350px]">
            <div class="w-full h-full">
              <DetailProfileCard :serie="item" type="tv" class="h-full" />
            </div>

            <UButton
              trailing-icon="i-lucide-eye"
              color="secondary"
              class="absolute top-15 right-1"
              @click="addToWatchedLists(item.tmdbId)"
            >
              {{ t('common.content.add_to_viewed_list') }}
            </UButton>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :items="skeletonItems"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
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
        {{ t('profile.serie.noToWatch') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <!-- watching series -->
    <UChip
      v-if="serieListStore.getWatchingCount > 0"
      :text="serieListStore.getWatchingCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.serie.watching') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.serie.watching') }}
    </h2>

    <div id="series-watching" class="flex justify-center min-h-[300px] items-center">
      <UCarousel
        v-if="isLoaded && watchingList.length > 0"
        ref="watchingCarousel"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="watchingList"
        class="w-full"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
        class-names
        wheel-gestures
      >
        <template #default="{ item }">
          <div :key="item.tmdbId" class="relative flex items-center flex-col min-h-[350px]">
            <div class="w-full h-full">
              <DetailProfileCard :serie="item" type="tv" class="h-full" />
            </div>

            <UButton
              trailing-icon="i-lucide-eye"
              color="secondary"
              class="absolute top-15 right-1"
              @click="addToWatchedLists(item.tmdbId)"
            >
              {{ t('common.content.add_to_viewed_list') }}
            </UButton>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :items="skeletonItems"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
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
        {{ t('profile.serie.noWatching') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <!-- watched series -->
    <UChip
      v-if="serieListStore.getWatchedCount > 0"
      :text="serieListStore.getWatchedCount"
      class="mb-4"
      size="3xl"
      :ui="{ base: 'p-1' }"
    >
      <h2 class="text-xl font-bold leading-8">
        {{ t('profile.serie.watched') }}
      </h2>
    </UChip>

    <h2 v-else class="text-xl font-bold leading-8">
      {{ t('profile.serie.watched') }}
    </h2>

    <div id="series-watched" class="flex justify-center min-h-[300px] items-center">
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
              <DetailProfileCard :serie="item" type="tv" class="h-full" />
            </div>
          </div>
        </template>
      </UCarousel>

      <UCarousel
        v-else-if="!isLoaded"
        :items="skeletonItems"
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
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
        {{ t('profile.serie.noWatched') }}
      </p>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const serieListStore = useSerieListStore()
const serieFavoriteStore = useSerieFavoriteStore()
const seriesWatchlistService = useSerieWatchlistService()
const serieFavoriteService = useSerieFavoriteService()
const { totalRuntime } = useSerieEpisodeRuntimeChannel()
const authStore = useAuthStore()
const { t } = useI18n()

const toWatchCarousel = useTemplateRef('toWatchCarousel')
const watchingCarousel = useTemplateRef('watchingCarousel')
const watchedCarousel = useTemplateRef('watchedCarousel')
const favoriteCarousel = useTemplateRef('favoriteCarousel')
const watchedList = ref<Serie[]>([])
const watchingList = ref<Serie[]>([])
const toWatchList = ref<Serie[]>([])
const favoriteList = ref<Serie[]>([])
const watchedTotalPages = ref(1)
const watchingTotalPages = ref(1)
const toWatchTotalPages = ref(1)
const favoriteTotalPages = ref(1)
const watchedPage = ref(0)
const watchingPage = ref(0)
const toWatchPage = ref(0)
const favoritePage = ref(0)

const skeletonItems = Array.from({ length: 6 }, (_, i) => i)
const isLoaded = ref(false)

onMounted(async () => {
  await Promise.all([
    fetchToWatchLists(),
    fetchWatchingLists(),
    fetchWatchedLists(),
    fetchFavoriteLists()
  ])

  isLoaded.value = true
})

const fetchToWatchLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Serie>> | undefined =
    await seriesWatchlistService.getWatchlistWithDetails?.(
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

const fetchWatchingLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Serie>> | undefined =
    await seriesWatchlistService.getWatchlistWithDetails?.(
      authStore.getUserId,
      WatchStatus.WATCHING,
      watchingPage.value,
      20
    )

  if (response === undefined || !response.success) {
    return
  }

  if (reset) {
    watchingList.value = response.data?.content ?? []
  } else {
    watchingList.value = watchingList.value.concat(response.data?.content ?? [])
  }
  watchingTotalPages.value = response.data?.page.totalPages ?? 1
}

const fetchWatchedLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Serie>> | undefined =
    await seriesWatchlistService.getWatchlistWithDetails?.(
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

const fetchFavoriteLists = async (reset = false) => {
  const response: ApiResponse<Pagination<Serie>> | undefined =
    await serieFavoriteService.getFavoriteWithDetails(authStore.getUserId, favoritePage.value, 20)

  if (response === undefined || !response.success) {
    return
  }

  if (reset) {
    favoriteList.value = response.data?.content ?? []
  } else {
    favoriteList.value = favoriteList.value.concat(response.data?.content ?? [])
  }
  favoriteTotalPages.value = response.data?.page.totalPages ?? 1
}

const addToWatchedLists = async (tmdbId: number) => {
  await seriesWatchlistService.updateWatchlist?.(authStore.getUserId, tmdbId, WatchStatus.WATCHED)
  watchedPage.value = 0
  toWatchPage.value = 0
  watchingPage.value = 0

  await fetchToWatchLists(true)
  await fetchWatchedLists(true)
  await fetchWatchingLists(true)
  await fetchFavoriteLists(true)

  useNotifications().success(
    t('common.toasts.title.success'),
    t('common.content.toasts.success.tv.addedToList.watched')
  )
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

watch(watchingCarousel, () => {
  if (watchingCarousel.value?.emblaApi) {
    watchingCarousel.value.emblaApi.on('select', () => {
      const index = watchingCarousel.value?.emblaApi?.selectedScrollSnap()
      if (index === watchingList.value.length - 6) {
        if (watchingPage.value < watchingTotalPages.value - 1) {
          watchingPage.value++
        } else {
          return
        }

        fetchWatchingLists()
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

watch(favoriteCarousel, () => {
  if (favoriteCarousel.value?.emblaApi) {
    favoriteCarousel.value.emblaApi.on('select', () => {
      const index = favoriteCarousel.value?.emblaApi?.selectedScrollSnap()
      if (index === favoriteList.value.length - 6) {
        if (favoritePage.value < favoriteTotalPages.value - 1) {
          favoritePage.value++
        } else {
          return
        }

        fetchFavoriteLists()
      }
    })
  }
})
</script>
