export const useSerieSeasonListChannel = () => {
  const seasonWatchlistService = useSeasonWatchlistService()
  const seasonListStore = useSeasonListStore()
  const authStore = useAuthStore()
  const { subscribe } = useSseManager()
  const route = useRoute()

  let unsubscribe: (() => void) | null = null

  const onSeasonListUpdate = (data: any) => {
    try {
      seasonListStore.setToWatchIds(data.to_watch)
      seasonListStore.setWatchedIds(data.watched)
      seasonListStore.setWatchingIds(data.watching)
    } catch (error) {
      console.error('Error processing season list update:', error)
    }
  }

  const fetchSeasonList = async () => {
    if (!authStore.isAuthenticated) return

    try {
      const response: ApiResponse<SerieSeasonIds> = await seasonWatchlistService.getWatchlist(
        authStore.getUserId,
        route.params.id as string
      )

      if (!response.success) {
        console.error('Failed to fetch season watchlist')
        return
      }

      seasonListStore.setToWatchIds(response.data?.to_watch || [])
      seasonListStore.setWatchedIds(response.data?.watched || [])
      seasonListStore.setWatchingIds(response.data?.watching || [])
    } catch (error) {
      console.error('Error fetching season list:', error)
    }
  }

  const init = async () => {
    if (!authStore.isAuthenticated || unsubscribe) return

    try {
      await fetchSeasonList()
      unsubscribe = subscribe(SseEventType.SERIE_SEASON_WATCHLIST_IDS_UPDATE, onSeasonListUpdate)
    } catch (error) {
      console.error('Error initializing serie season list channel:', error)
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null

      seasonListStore.setToWatchIds([])
      seasonListStore.setWatchedIds([])
      seasonListStore.setWatchingIds([])
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
