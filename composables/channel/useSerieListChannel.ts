import { Transmit } from '@adonisjs/transmit-client'

export const useSerieListChannel = () => {
  const serieListStore = useSerieListStore()
  const serieWatchlistService = useSerieWatchlistService()
  const authStore = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const series = ref<SerieWatchlist[] | null>(null)
  const runtimeConfig = useRuntimeConfig()

  const fetchSerieWatchlist = async () => {
    const response: ApiResponse = await serieWatchlistService.getWatchlist(authStore.getUserId)

    if (response.status === 'error') {
      return
    }

    series.value = response.data as SerieWatchlist[]

    serieListStore.setSeries(series.value)
  }

  const setupChannel = async () => {
    if (!transmit.value || !authStore.getUserId) return

    try {
      const subscription = transmit.value.subscription(`serie_watchlist:${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'list':
            serieListStore.setSeries(data.series)
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (authStore.isAuthenticated === false) return

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
