export const useSerieFavoriteChannel = () => {
  const serieFavoriteService: FavoriteService = useSerieFavoriteService()
  const serieFavoriteStore = useSerieFavoriteStore()
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

  const onSerieFavoriteUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      serieFavoriteStore.setIds(data.favorite)
    } catch (error) {
      console.error('Error parsing serie favorite update.')
    }
  }

  const fetchSerieFavorite = async () => {
    const response: ApiResponse<SerieFavoriteIds> = await serieFavoriteService.getFavorite(
      authStore.getUserId
    )

    if (!response.success) {
      console.error('Failed to fetch serie favorite.')
      return
    }

    serieFavoriteStore.setIds(response.data?.favorite || [])
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

    await fetchSerieFavorite()
    addEventListener(SseEventType.SERIE_FAVORITE_IDS_UPDATE, onSerieFavoriteUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchSerieFavorite().then(() => {
        addEventListener(SseEventType.SERIE_FAVORITE_IDS_UPDATE, onSerieFavoriteUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      serieFavoriteStore.reset()
    }
  })
}
