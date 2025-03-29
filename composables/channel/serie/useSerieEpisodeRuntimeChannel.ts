export const useSerieEpisodeRuntimeChannel = () => {
  const authStore = useAuthStore()
  const totalRuntime = ref(0)
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

  const onSerieEpisodeRuntimeUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      totalRuntime.value = data.totalRuntime
    } catch (error) {
      console.error('Error parsing serie episode runtime update.')
    }
  }

  const fetchTotalRuntime = async () => {
    if (!authStore.isAuthenticated) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieRuntime> = await apiFetch(
      `/serie-watchlist/${authStore.getUserId}/serie/runtime`
    )

    if (!response.success) {
      console.error('Failed to fetch total runtime.')
      return
    }

    totalRuntime.value = response.data?.totalRuntime || 0
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return
    await fetchTotalRuntime()
    addEventListener(SseEventType.SERIE_TOTAL_RUNTIME_UPDATE, onSerieEpisodeRuntimeUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchTotalRuntime().then(() => {
        addEventListener(SseEventType.SERIE_TOTAL_RUNTIME_UPDATE, onSerieEpisodeRuntimeUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      totalRuntime.value = 0
    }
  })

  return {
    totalRuntime
  }
}
