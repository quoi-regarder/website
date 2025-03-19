export const useMovieListChannel = () => {
  const movieListStore = useMovieListStore()
  const movieWatchlistService = useMovieWatchlistService()
  const authStore = useAuthStore()
  const { $transmit } = useNuxtApp()

  const fetchMovieList = async () => {
    const response: ApiResponse = await movieWatchlistService.getWatchlist(authStore.getUserId)

    if (response.status === 'error') {
      return
    }

    movieListStore.setToWatchIds(response.data.to_watch)
    movieListStore.setWatchedIds(response.data.watched)
  }

  const setupChannel = async () => {
    if (!$transmit || !authStore.getUserId) return

    try {
      const subscription = $transmit.subscription(`movie_watchlist/${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        movieListStore.setToWatchIds(data.data.to_watch)
        movieListStore.setWatchedIds(data.data.watched)
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (authStore.isAuthenticated === false) return

    await fetchMovieList()
    await setupChannel()
  })
}
