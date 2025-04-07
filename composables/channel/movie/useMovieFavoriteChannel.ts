export const useMovieFavoriteChannel = () => {
  const movieFavoriteService: FavoriteService = useMovieFavoriteService()
  const movieFavoriteStore = useMovieFavoriteStore()
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

  const onMovieFavoriteUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      movieFavoriteStore.setIds(data.favorite)
    } catch (error) {
      console.error('Error parsing movie favorite update.')
    }
  }

  const fetchMovieFavorite = async () => {
    const response: ApiResponse<MovieFavoriteIds> = await movieFavoriteService.getFavorite(
      authStore.getUserId
    )

    if (!response.success) {
      console.error('Failed to fetch movie favorite.')
      return
    }

    movieFavoriteStore.setIds(response.data?.favorite || [])
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

    await fetchMovieFavorite()
    addEventListener(SseEventType.MOVIE_FAVORITE_IDS_UPDATE, onMovieFavoriteUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchMovieFavorite().then(() => {
        addEventListener(SseEventType.MOVIE_FAVORITE_IDS_UPDATE, onMovieFavoriteUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      movieFavoriteStore.setIds([])
    }
  })
}
