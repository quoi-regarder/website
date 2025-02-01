import { Transmit } from '@adonisjs/transmit-client'

export const useMocieRuntimeChannel = () => {
  const authStore = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const runtimeConfig = useRuntimeConfig()
  const totalRuntime = ref(0)

  const fetchTotalRuntime = async () => {
    if (!authStore.isAuthenticated) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/movie-watchlist/${authStore.getUserId}/movie/runtime`
    )

    totalRuntime.value = response.data?.totalRuntime
  }

  const setupChannel = async () => {
    if (!transmit.value || !authStore.getUserId) return

    try {
      const subscription = transmit.value.subscription(`movie_runtime:${authStore.getUserId}`)

      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'update':
            totalRuntime.value = data.totalRuntime
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated) return

    transmit.value = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl
    })

    await fetchTotalRuntime()
    await setupChannel()
  })

  onUnmounted(() => {
    transmit.value?.close()
    transmit.value = null
  })

  return { totalRuntime }
}
