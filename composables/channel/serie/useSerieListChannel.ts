export const useSerieListChannel = () => {
  const serieListStore = useSerieListStore()
  const serieWatchlistService = useSerieWatchlistService()
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

  const onSerieListUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      serieListStore.setToWatchIds(data.to_watch)
      serieListStore.setWatchedIds(data.watched)
      serieListStore.setWatchingIds(data.watching)
    } catch (error) {
      console.error('Error parsing serie list update.')
    }
  }

  const fetchSerieList = async () => {
    const response: ApiResponse<SerieIds> = await serieWatchlistService.getWatchlist(
      authStore.getUserId
    )

    if (!response.success) {
      console.error('Failed to fetch serie watchlist.')
      return
    }

    serieListStore.setToWatchIds(response.data?.to_watch || [])
    serieListStore.setWatchedIds(response.data?.watched || [])
    serieListStore.setWatchingIds(response.data?.watching || [])
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return
    await fetchSerieList()
    addEventListener(SseEventType.SERIE_WATCHLIST_IDS_UPDATE, onSerieListUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchSerieList().then(() => {
        addEventListener(SseEventType.SERIE_WATCHLIST_IDS_UPDATE, onSerieListUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      serieListStore.setToWatchIds([])
      serieListStore.setWatchedIds([])
      serieListStore.setWatchingIds([])
    }
  })
}
