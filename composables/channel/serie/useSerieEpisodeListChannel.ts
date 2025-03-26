export const useSerieEpisodeListChannel = () => {
  const episodeWatchlistService = useEpisodeWatchlistService()
  const episodeListStore = useEpisodeListStore()
  const authStore = useAuthStore()
  const { $sse } = useNuxtApp()
  const route = useRoute()

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
    immediate: false,
    onError: (error) => {
      console.error('Serie episode list channel SSE error:', error)
    }
  })

  const onEpisodeListUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      episodeListStore.setWatchedIds(data.watched)
      episodeListStore.setWatchingIds(data.watching)
      episodeListStore.setToWatchIds(data.to_watch)
    } catch (error) {
      console.error('Error parsing episode list update:', error)
    }
  }

  const fetchEpisodeList = async () => {
    const response: ApiResponse<SerieEpisodeIds> = await episodeWatchlistService.getWatchlist(
      authStore.getUserId,
      route.params.id as string
    )

    if (!response.success) {
      console.error('Failed to fetch episode watchlist.')
      return
    }

    episodeListStore.setWatchedIds(response.data?.watched || [])
    episodeListStore.setWatchingIds(response.data?.watching || [])
    episodeListStore.setToWatchIds(response.data?.to_watch || [])
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return
    await fetchEpisodeList()
    addEventListener(SseEventType.SERIE_EPISODE_WATCHLIST_IDS_UPDATE, onEpisodeListUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchEpisodeList().then(() => {
        addEventListener(SseEventType.SERIE_EPISODE_WATCHLIST_IDS_UPDATE, onEpisodeListUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      episodeListStore.setWatchedIds([])
      episodeListStore.setWatchingIds([])
      episodeListStore.setToWatchIds([])
    }
  })
}
