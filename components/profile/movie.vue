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
        :items="getToWatchList"
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
              @click="addToWatchedLists(item.tmdb_id)"
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

    <div class="flex justify-center">
      <UCarousel
        v-if="getWatchedCount > 0"
        :items="getWatchedList"
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
const { getToWatchCount, getToWatchList, getWatchedCount, getWatchedList, getTotalRuntime } =
  useMovieListStore()
const { t } = useI18n()

const addToWatchedLists = (tmdb_id: number) => {
  useMovie().addMovieToList(tmdb_id, 'watched')

  useNotifications().success(
    t('common.toasts.title.success'),
    t('common.content.toasts.success.movie.addedToList.watched')
  )
}
</script>
