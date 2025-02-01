import { Transmit } from '@adonisjs/transmit-client'

export const useSerieSeasonListChannel = () => {
  const seasonListStore = useSeasonListStore()
  const seasonWatchlistService = useSeasonWatchlistService()
  const authStore = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const seasons = ref<SerieSeasonWatchlist[] | null>(null)
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()

  const fetchSeasonWatchlist = async () => {
    const fetchedSeasonWatchlist: SerieSeasonWatchlist = await seasonWatchlistService.getWatchlist(
      authStore.getUserId,
      route.params.id as string
    )

    if (!fetchedSeasonWatchlist) {
      throw new Error('Failed to fetch season watchlist')
    }

    seasons.value = fetchedSeasonWatchlist as unknown as SerieSeasonWatchlist[]

    seasonListStore.setSeasons(seasons.value)
  }

  const setupChannel = async () => {
    if (!transmit.value || !authStore.getUserId) return

    try {
      const subscription = transmit.value.subscription(
        `serie_season_watchlist:${authStore.getUserId}`
      )
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'list':
            seasonListStore.setSeasons(data.seasons)
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated) return

    transmit.value = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl
    })

    await fetchSeasonWatchlist()
    await setupChannel()
  })

  onUnmounted(() => {
    if (transmit.value) {
      transmit.value.close()
    }
    seasonListStore.reset()
  })
}
