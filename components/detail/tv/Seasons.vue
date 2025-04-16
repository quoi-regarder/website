<template>
  <UContainer
    class="flex flex-col gap-y-6 p-6 rounded-xl bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] shadow-xl transition-all duration-300"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-primary-500">
        {{ $t('tvSeasons.title') }}
      </h2>
      <UBadge
        v-if="selectedNumber !== null"
        :label="seasons[selectedNumber - (hasSpecials ? 0 : 1)]?.name"
        color="secondary"
        variant="outline"
        size="lg"
      />
    </div>

    <div class="flex justify-center">
      <UCarousel
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :items="seasons"
        class="max-w-[75vw] w-11/12"
        arrows
        wheel-gestures
        :ui="{
          item: 'basis-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'
        }"
      >
        <template #default="{ item }">
          <div class="w-full h-full p-2">
            <LazyDetailPartSeasonCard
              :season="item"
              :is-selected="selectedNumber === item.season_number"
              class="transition-transform duration-300 hover:scale-[1.02]"
              :provider-ids="props.providerIds"
              @select="handleSeasonSelection(item.season_number)"
            />
          </div>
        </template>
      </UCarousel>
    </div>

    <USeparator class="pt-4" />

    <div v-if="episodes.length > 0">
      <h3 class="text-xl font-bold mb-4 text-primary-400">
        {{ seasons[selectedNumber! - (hasSpecials ? 0 : 1)]?.name }}
      </h3>

      <div class="flex justify-center">
        <UCarousel
          ref="carousel"
          :prev="{ color: 'secondary', variant: 'solid' }"
          :next="{ color: 'secondary', variant: 'solid' }"
          :items="episodes"
          class-names
          class="max-w-[75vw] w-11/12"
          arrows
          wheel-gestures
          :ui="{
            item: 'basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'
          }"
        >
          <template #default="{ item }">
            <div class="w-full h-full p-2">
              <LazyDetailPartEpisodeCard :episode="item" :provider-ids="props.providerIds" />
            </div>
          </template>
        </UCarousel>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const episodeWatchlistService = useEpisodeWatchlistService()
const episodeListStore = useEpisodeListStore()
const authStore = useAuthStore()
const { locale } = useI18n()
const route = useRoute()

const props = defineProps<{
  seasons: any[]
  providerIds: number[]
}>()

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
    console.error('Failed to fetch episodes.')
  }
}

const fetchEpisodeWatchlist = async (seasonNumber: number | null) => {
  if (seasonNumber === null) return

  const season = props.seasons.find((s) => s.season_number === seasonNumber)
  if (!season) return

  try {
    const response: ApiResponse<SerieEpisodeIds> = await episodeWatchlistService.getWatchlist(
      authStore.getUserId,
      route.params.id as string,
      season.id
    )

    if (response.success) {
      episodeListStore.setWatchedIds(response.data?.watched || [])
      episodeListStore.setWatchingIds(response.data?.watching || [])
      episodeListStore.setToWatchIds(response.data?.to_watch || [])
    }
  } catch (error) {
    console.error('Failed to fetch watchlist.')
  }
}
</script>
