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

    <div class="flex justify-center">
      <UCarousel
        v-if="getToWatchCount > 0"
        :items="toWatchList"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default="{ item }">
          <div class="relative flex items-center flex-col">
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

    <!-- TODO: fetch list from database, with pagination -->
    <div class="flex justify-center">
      <UCarousel
        v-if="getWatchedCount > 0"
        :items="watchedList"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default="{ item }">
          <div class="flex items-center flex-col">
            <DetailProfileCard :movie="item" />
          </div>
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
const watchedList = ref<MovieWatchlist[]>([])
const toWatchList = ref<MovieWatchlist[]>([])
const watchedPage = ref(1)
const toWatchPage = ref(1)
const { getUserId } = useAuthStore()
const { t } = useI18n()

onMounted(() => {
  fetchMovieLists()
})

const addToWatchedLists = async (tmdb_id: number) => {
  await movieWatchlistService.updateWatchlist(getUserId.value, tmdb_id, WatchStatus.WATCHED)
  await fetchMovieLists()

  useNotifications().success(
    t('common.toasts.title.success'),
    t('common.content.toasts.success.movie.addedToList.watched')
  )
}

const fetchMovieLists = async () => {
  const watchedResponse = await movieWatchlistService.getWatchlistWithDetails(
    getUserId.value,
    WatchStatus.WATCHED,
    watchedPage.value
  )

  watchedList.value = watchedResponse.data
  toWatchPage.value = Math.min(watchedResponse.meta.lastPage, watchedPage.value + 1)

  const toWatchResponse = await movieWatchlistService.getWatchlistWithDetails(
    getUserId.value,
    WatchStatus.TO_WATCH,
    toWatchPage.value
  )

  toWatchList.value = toWatchResponse.data
  toWatchPage.value = Math.min(toWatchResponse.meta.lastPage, toWatchPage.value + 1)
}
</script>
