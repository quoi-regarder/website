<template>
  <UContainer
    class="w-full p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] gap-y-4"
  >
    <h2 class="text-2xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
      {{ $t('tvSeasons.title') }}
    </h2>

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 full-hd:grid-cols-5"
    >
      <LazyDetailPartSeasonCard
        v-for="(season, index) in seasons"
        :key="index"
        :season="season"
        :is-selected="selectedNumber === index + 1"
        @select="handleSeasonSelection(index + 1)"
      />

      <USkeleton v-if="seasons.length === 0" class="w-full h-96" />
    </div>

    <USeparator class="pt-4" />

    <div v-if="episodes.length > 0">
      <h3 class="text-xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
        {{ seasons[selectedNumber - 1]?.name }}
      </h3>

      <div class="flex justify-center">
        <UCarousel
          ref="carousel"
          :items="episodes"
          class-names
          class="max-w-[75vw] w-11/12"
          arrows
          :ui="{
            item: 'basis-full lg:basis-[60%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
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
const { isAuthenticated, getUserId } = useAuthStore()
const { setEpisodes } = useEpisodeListStore()
const { locale } = useI18n()
const route = useRoute()
const props = defineProps({
  seasons: {
    type: Array as PropType<any[]>,
    required: true
  }
})

const selectedNumber = ref<number | null>(1)
const episodes = ref<any[]>([])
const carousel = useTemplateRef('carousel')

onMounted(async () => {
  await fetchSeasons()
})

const handleSeasonSelection = async (seasonNumber: number) => {
  selectedNumber.value = selectedNumber.value === seasonNumber ? null : seasonNumber
  fetchSeasons()
}

const fetchSeasons = async () => {
  const manager = new QueryParamsManager(
    `/api/themoviedb/tv/${route.params.id}/season/${selectedNumber.value}`
  )
  manager.add('language', locale.value)
  const data: any = await $fetch(manager.toString())

  episodes.value = data.episodes

  carousel.value?.emblaApi?.scrollTo(0)

  if (!isAuthenticated.value) return
  fetchEpisodeWatchlist(selectedNumber.value)
}

const fetchEpisodeWatchlist = async (seasonNumber: number | null) => {
  if (!seasonNumber) return
  const fetchedEpisodeWatchlist: SerieEpisodeWatchlist = await episodeWatchlistService.getWatchlist(
    getUserId.value,
    route.params.id as string,
    props.seasons.filter((season: any) => season.season_number === seasonNumber)[0].id
  )

  if (!fetchedEpisodeWatchlist) {
    throw new Error('Failed to fetch episode watchlist')
  }

  const watchedEpisodes = fetchedEpisodeWatchlist as unknown as SerieEpisodeWatchlist[]

  setEpisodes(watchedEpisodes)
}
</script>
