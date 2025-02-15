export const useSerieSeasonListChannel = () => {
  const seasonListStore = useSeasonListStore()
  const seasonWatchlistService = useSeasonWatchlistService()
  const authStore = useAuthStore()
  const { $transmit } = useNuxtApp()
  const route = useRoute()

  const fetchSeasonWatchlist = async () => {
    const response: ApiResponse = await seasonWatchlistService.getWatchlist(
      authStore.getUserId,
      route.params.id as string
    )

    if (response.status === 'error') {
      return
    }

    seasonListStore.setWatchedIds(response.data.watched)
    seasonListStore.setWatchingIds(response.data.watching)
    seasonListStore.setToWatchIds(response.data.to_watch)
  }

  const setupChannel = async () => {
    if (!$transmit || !authStore.getUserId) return

    try {
      const subscription = $transmit.subscription(`serie_season_watchlist/${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        seasonListStore.setWatchedIds(data.data.watched)
        seasonListStore.setWatchingIds(data.data.watching)
        seasonListStore.setToWatchIds(data.data.to_watch)
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated) return

    await fetchSeasonWatchlist()
    await setupChannel()
  })

  onUnmounted(() => {
    seasonListStore.reset()
  })
}
