import { Transmit } from '@adonisjs/transmit-client'

export const useSerieListChannel = () => {
  const { addSerie, updateSerie, removeSerie, setSeries } = useSerieListStore()
  const serieWatchlistService = useSerieWatchlistService()
  const { isAuthenticated, getUserId } = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const series = ref<SerieWatchlist[] | null>(null)
  const runtimeConfig = useRuntimeConfig()

  const fetchSerieWatchlist = async () => {
    const fetchedSerieWatchlist: SerieWatchlist = await serieWatchlistService.getWatchlist(
      getUserId.value
    )

    if (!fetchedSerieWatchlist) {
      throw new Error('Failed to fetch serie watchlist')
    }

    series.value = fetchedSerieWatchlist as unknown as SerieWatchlist[]

    setSeries(series.value)
  }

  const setupChannel = async () => {
    if (!transmit.value || !getUserId.value) return

    try {
      const subscription = transmit.value.subscription(`serie_watchlist:${getUserId.value}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'list':
            setSeries(data.series)
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

    transmit.value = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl
    })

    await fetchSerieWatchlist()
    await setupChannel()
  })

  onUnmounted(() => {
    transmit.value?.close()
    transmit.value = null
  })
}
