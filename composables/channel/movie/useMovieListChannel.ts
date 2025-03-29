export const useMovieListChannel = () => {
  const movieListStore = useMovieListStore()
  const movieWatchlistService = useMovieWatchlistService()
  const authStore = useAuthStore()
  const { $sse } = useNuxtApp()

  const isAuthenticated = computed(
    () => authStore.isAuthenticated && !!authStore.getToken && !!authStore.getUserId
  )

  const sseUrl = computed<string | undefined>(() => {
    if (!isAuthenticated.value) return undefined
    return $sse.createAuthSseUrl('/api/notifications', authStore.getToken)
  })

  const connectionKey = 'notifications-channel'

  const {
    isConnected,
    error: connectionError,
    reconnect,
    addEventListener,
    disconnect
  } = useSse(sseUrl, connectionKey, {
    immediate: false
  })

  const onMovieListUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      movieListStore.setToWatchIds(data.to_watch)
      movieListStore.setWatchedIds(data.watched)
    } catch (error) {
      console.error('Error parsing movie list update.')
    }
  }

  const fetchMovieList = async () => {
    const response: ApiResponse<MovieIds> = await movieWatchlistService.getWatchlist(
      authStore.getUserId
    )

    if (!response.success) {
      console.error('Failed to fetch movie watchlist.')
      return
    }

    movieListStore.setToWatchIds(response.data?.to_watch || [])
    movieListStore.setWatchedIds(response.data?.watched || [])
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

    await fetchMovieList()
    addEventListener(SseEventType.MOVIE_WATCHLIST_IDS_UPDATE, onMovieListUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchMovieList().then(() => {
        addEventListener(SseEventType.MOVIE_WATCHLIST_IDS_UPDATE, onMovieListUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      movieListStore.setToWatchIds([])
      movieListStore.setWatchedIds([])
    }
  })
}
