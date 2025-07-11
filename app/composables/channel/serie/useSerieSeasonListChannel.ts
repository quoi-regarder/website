export const useSerieSeasonListChannel = () => {
  const seasonWatchlistService = useSeasonWatchlistService()
  const seasonListStore = useSeasonListStore()
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
    immediate: false
  })

  const onSeasonListUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      seasonListStore.setToWatchIds(data.to_watch)
      seasonListStore.setWatchedIds(data.watched)
      seasonListStore.setWatchingIds(data.watching)
    } catch (error) {
      console.error('Error parsing season list update.')
    }
  }

  const fetchSeasonList = async () => {
    const response: ApiResponse<SerieSeasonIds> = await seasonWatchlistService.getWatchlist(
      authStore.getUserId,
      route.params.id as string
    )

    if (!response.success) {
      console.error('Failed to fetch season watchlist.')
      return
    }

    seasonListStore.setToWatchIds(response.data?.to_watch || [])
    seasonListStore.setWatchedIds(response.data?.watched || [])
    seasonListStore.setWatchingIds(response.data?.watching || [])
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return
    await fetchSeasonList()
    addEventListener(SseEventType.SERIE_SEASON_WATCHLIST_IDS_UPDATE, onSeasonListUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchSeasonList().then(() => {
        addEventListener(SseEventType.SERIE_SEASON_WATCHLIST_IDS_UPDATE, onSeasonListUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      seasonListStore.setToWatchIds([])
      seasonListStore.setWatchedIds([])
      seasonListStore.setWatchingIds([])
    }
  })
}
