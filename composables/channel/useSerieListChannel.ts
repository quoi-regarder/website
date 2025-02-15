export const useSerieListChannel = () => {
  const serieListStore = useSerieListStore()
  const serieWatchlistService = useSerieWatchlistService()
  const authStore = useAuthStore()
  const { $transmit } = useNuxtApp()

  const fetchSerieWatchlist = async () => {
    const response: ApiResponse = await serieWatchlistService.getWatchlist(authStore.getUserId)

    if (response.status === 'error') {
      return
    }

    serieListStore.setWatchedIds(response.data.watched)
    serieListStore.setWatchingIds(response.data.watching)
    serieListStore.setToWatchIds(response.data.to_watch)
  }

  const setupChannel = async () => {
    if (!$transmit || !authStore.getUserId) return

    try {
      const subscription = $transmit.subscription(`serie_watchlist/${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        serieListStore.setToWatchIds(data.data.to_watch)
        serieListStore.setWatchedIds(data.data.watched)
        serieListStore.setWatchingIds(data.data.watching)
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (authStore.isAuthenticated === false) return

    await fetchSerieWatchlist()
    await setupChannel()
  })
}
