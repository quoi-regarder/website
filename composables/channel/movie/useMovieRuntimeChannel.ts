export const useMocieRuntimeChannel = () => {
  const authStore = useAuthStore()
  const totalRuntime = ref(0)
  const { $transmit } = useNuxtApp()

  const fetchTotalRuntime = async () => {
    if (!authStore.isAuthenticated) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/movie-watchlist/${authStore.getUserId}/movie/runtime`
    )

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch total runtime.')
      return
    }

    totalRuntime.value = response.data?.totalRuntime
  }

  const setupChannel = async () => {
    if (!$transmit || !authStore.getUserId) return

    try {
      const subscription = $transmit.subscription(`movie_runtime/${authStore.getUserId}`)

      await subscription.create()

      subscription.onMessage((data: any) => {
        totalRuntime.value = data.data
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated) return

    await fetchTotalRuntime()
    await setupChannel()
  })

  return { totalRuntime }
}
