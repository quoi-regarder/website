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

    <DetailProfileRuntime :runtime="totalRuntime" />

    <USeparator class="py-4" />

    <!-- to_watch movies -->
    <UChip :text="toWatchMovies.length" class="mb-4" size="3xl" :ui="{ base: 'p-1' }">
      <h2 class="text-xl font-bold leading-8">
        {{ $t('profile.movie.toWatch') }}
      </h2>
    </UChip>

    <div class="flex justify-center">
      <UCarousel
        v-if="toWatchMovies.length > 0"
        :items="toWatchMovies"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default="{ item }">
          <div class="flex items-center flex-col">
            <DetailProfileCard :movie="item.movies" />
          </div>
        </template>
      </UCarousel>

      <p v-else>
        {{ $t('profile.movie.noToWatch') }}
      </p>
    </div>

    <USeparator class="py-4" />

    <UChip :text="watchedMovies.length" class="mb-4" size="3xl" :ui="{ base: 'p-1' }">
      <h2 class="text-xl font-bold leading-8">
        {{ $t('profile.movie.watched') }}
      </h2>
    </UChip>

    <div class="flex justify-center">
      <UCarousel
        v-if="watchedMovies.length > 0"
        :items="watchedMovies"
        class="max-w-[75vw] w-11/12"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6' }"
        arrows
      >
        <template #default="{ item }">
          <div class="flex items-center flex-col">
            <DetailProfileCard :movie="item.movies" />
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
const user = useSupabaseUser()
const { locale } = useI18n()

const toWatchMovies = ref([])
const watchedMovies = ref([])
const totalRuntime = ref(0)

onMounted(async () => {
  await fetchWatchedMovies()
  await fetchToWatchMovies()
  await computeTotalRuntime()
})

const fetchToWatchMovies = async () => {
  const manager = new QueryParamsManager(`/api/movie-lists/${user.value.id}/status/to_watch`)
  manager.add('language', locale.value)

  toWatchMovies.value = await $fetch(manager.toString(), {
    method: 'GET'
  })
}

const fetchWatchedMovies = async () => {
  const manager = new QueryParamsManager(`/api/movie-lists/${user.value.id}/status/watched`)
  manager.add('language', locale.value)

  watchedMovies.value = await $fetch(manager.toString(), {
    method: 'GET'
  })
}

const computeTotalRuntime = async () => {
  totalRuntime.value = watchedMovies.value.reduce((acc, movie) => acc + movie.movies.runtime, 0)
}
</script>
