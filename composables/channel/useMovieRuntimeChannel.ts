import { Transmit } from '@adonisjs/transmit-client'

export const useMocieRuntimeChannel = () => {
  const { isAuthenticated, getUserId } = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const runtimeConfig = useRuntimeConfig()
  const totalRuntime = ref(0)

  const fetchTotalRuntime = async () => {
    if (!isAuthenticated.value) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/movie-watchlist/${getUserId.value}/movie/runtime`
    )

    totalRuntime.value = response.data?.totalRuntime
  }

  const setupChannel = async () => {
    if (!transmit.value || !getUserId.value) return

    try {
      const subscription = transmit.value.subscription(`movie_runtime:${getUserId.value}`)

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
    if (!isAuthenticated.value) return

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
