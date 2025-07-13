export const useSerieEpisodeRuntimeChannel = () => {
  const authStore = useAuthStore()
  const { subscribe } = useSseManager()
  const totalRuntime = ref(0)

  let unsubscribe: (() => void) | null = null

  const onSerieEpisodeRuntimeUpdate = (data: any) => {
    totalRuntime.value = data.totalRuntime || 0
  }

  const fetchTotalRuntime = async () => {
    if (!authStore.isAuthenticated) return

    try {
      const response: ApiResponse<SerieRuntime> = await apiFetch(
        `/serie-watchlist/${authStore.getUserId}/serie/runtime`
      )

      if (!response.success) {
        console.error('Failed to fetch serie total runtime')
        return
      }

      totalRuntime.value = response.data?.totalRuntime || 0
    } catch (error) {
      console.error('Error fetching serie total runtime:', error)
    }
  }

  const init = async () => {
    if (!authStore.isAuthenticated || unsubscribe) return

    try {
      await fetchTotalRuntime()
      unsubscribe = subscribe(SseEventType.SERIE_TOTAL_RUNTIME_UPDATE, onSerieEpisodeRuntimeUpdate)
    } catch (error) {
      console.error('Error initializing serie episode runtime channel:', error)
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      totalRuntime.value = 0
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

  // Cleanup on component unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    totalRuntime: readonly(totalRuntime),
    cleanup,
    isActive
  }
}
