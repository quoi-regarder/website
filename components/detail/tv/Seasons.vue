<template>
  <UContainer
    class="w-full p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] gap-y-4"
  >
    <h2 class="text-2xl font-bold mb-4 text-primary-400">
      {{ $t('tvSeasons.title') }}
    </h2>

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 full-hd:grid-cols-5"
    >
      <LazyDetailPartSeasonCard
        v-for="(season, index) in seasons"
        :key="index"
        :season="season"
        :is-selected="selectedNumber === index + (hasSpecials ? 0 : 1)"
        @select="handleSeasonSelection(index + (hasSpecials ? 0 : 1))"
      />

      <USkeleton v-if="seasons.length === 0" class="w-full h-96" />
    </div>

    <USeparator class="pt-4" />

    <div v-if="episodes.length > 0">
      <h3 class="text-xl font-bold mb-4 text-primary-400">
        {{ seasons[selectedNumber! - (hasSpecials ? 0 : 1)]?.name }}
      </h3>

      <div class="flex justify-center">
        <UCarousel
          ref="carousel"
          :items="episodes"
          class-names
          class="max-w-[75vw] w-11/12"
          arrows
          wheel-gestures
          :ui="{
            item: 'basis-full 2xl:basis-[65%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
          }"
        >
          <template #default="{ item }">
            <LazyDetailPartEpisodeCard :episode="item" />
          </template>
        </UCarousel>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const episodeWatchlistService = useEpisodeWatchlistService()
const authStore = useAuthStore()
const episodeListStore = useEpisodeListStore()
const { locale } = useI18n()
const route = useRoute()
const props = defineProps({
  seasons: {
    type: Array as PropType<any[]>,
    required: true
  }
})
const hasSpecials = props.seasons.some((season: any) => season.season_number === 0)

const selectedNumber = ref<number | null>(hasSpecials ? 0 : 1)
const episodes = ref<any[]>([])
const carousel = useTemplateRef('carousel')

onMounted(async () => {
  await fetchSeasons()
})

const handleSeasonSelection = async (seasonNumber: number) => {
  selectedNumber.value = selectedNumber.value === seasonNumber ? null : seasonNumber
  await fetchSeasons()
}

const fetchSeasons = async () => {
  if (selectedNumber.value === null) return

  const manager = new QueryParamsManager(
    `/api/themoviedb/tv/${route.params.id}/season/${selectedNumber.value}`
  )
  manager.add('language', locale.value)

  try {
    const data: any = await $fetch(manager.toString())
    episodes.value = data.episodes
    carousel.value?.emblaApi?.scrollTo(0)

    if (authStore.isAuthenticated) {
      await fetchEpisodeWatchlist(selectedNumber.value)
    }
  } catch (error) {
    console.error('Failed to fetch episodes:', error)
  }
}

const fetchEpisodeWatchlist = async (seasonNumber: number | null) => {
  if (seasonNumber === null) return

  const season = props.seasons.find((s) => s.season_number === seasonNumber)
  if (!season) return

  try {
    const response: ApiResponse = await episodeWatchlistService.getWatchlist(
      authStore.getUserId,
      route.params.id as string,
      season.id
    )

    if (response.status !== 'error') {
      episodeListStore.setWatchedIds(response.data.watched)
      episodeListStore.setWatchingIds(response.data.watching)
      episodeListStore.setToWatchIds(response.data.to_watch)
    }
  } catch (error) {
    console.error('Failed to fetch watchlist:', error)
  }
}
</script>
