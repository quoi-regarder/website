export const useSerieEpisodeListChannel = () => {
  const episodeWatchlistService = useEpisodeWatchlistService()
  const episodeListStore = useEpisodeListStore()
  const authStore = useAuthStore()
  const { subscribe } = useSseManager()
  const route = useRoute()

  let unsubscribe: (() => void) | null = null

  const onEpisodeListUpdate = (data: any) => {
    try {
      episodeListStore.setWatchedIds(data.watched || [])
      episodeListStore.setWatchingIds(data.watching || [])
      episodeListStore.setToWatchIds(data.to_watch || [])
    } catch (error) {
      console.error('Error processing episode list update:', error)
    }
  }

  const fetchEpisodeList = async () => {
    if (!authStore.isAuthenticated) return

    try {
      const response: ApiResponse<SerieEpisodeIds> = await episodeWatchlistService.getWatchlist(
        authStore.getUserId,
        route.params.id as string
      )

      if (!response.success) {
        console.error('Failed to fetch episode watchlist')
        return
      }

      episodeListStore.setWatchedIds(response.data?.watched || [])
      episodeListStore.setWatchingIds(response.data?.watching || [])
      episodeListStore.setToWatchIds(response.data?.to_watch || [])
    } catch (error) {
      console.error('Error fetching episode list:', error)
    }
  }

  const init = async () => {
    if (!authStore.isAuthenticated || unsubscribe) return

    try {
      // Fetch initial data
      await fetchEpisodeList()

      // Subscribe to updates
      unsubscribe = subscribe(SseEventType.SERIE_EPISODE_WATCHLIST_IDS_UPDATE, onEpisodeListUpdate)
    } catch (error) {
      console.error('Error initializing serie episode list channel:', error)
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null

      // Reset store
      episodeListStore.setWatchedIds([])
      episodeListStore.setWatchingIds([])
      episodeListStore.setToWatchIds([])
    }
  }

  const isActive = computed(() => !!unsubscribe)

  // Auto-init if authenticated
  if (import.meta.client && authStore.isAuthenticated) {
    init()
  }

  // Watch auth changes
  watch(
    () => authStore.isAuthenticated,
    (newAuth, oldAuth) => {
      if (newAuth && !oldAuth) {
        init()
      } else if (!newAuth && oldAuth) {
        cleanup()
      }
    }
  )

  return {
    cleanup,
    isActive
  }
}
